import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'linkedin-prompts-guide'
const SERVICE = resolveServiceLink('google-ads-management', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/linkedin/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'LinkedIn Prompts That Read Like a Person, Not Engagement Bait',
  h1: 'Why do so many LinkedIn posts sound exactly the same?',
  targetKeyword: 'linkedin post prompts',
  description:
    'LinkedIn prompts calibrated to how the platform actually rewards content — posts, profile rewrites, comment strategy — without the engagement-bait clichés flooding the feed.',
  dek: "LinkedIn's feed has a distinct, recognisable register, and most generic AI writing prompts miss it entirely — producing either corporate press-release tone or hollow engagement bait. These are calibrated to the actual platform.",
  sections: [
    {
      heading: 'What "written for LinkedIn" actually means',
      body: [
        [
          'A post that would work fine as a blog article often falls flat on LinkedIn, and vice versa — the platform rewards a specific register: a strong hook in the first line (since the feed truncates after two), personal narrative over abstract advice, and a clear point rather than a vague reflection. The ',
          { text: 'LinkedIn prompt library', href: '/prompts/linkedin' },
          ' is calibrated to that register specifically, without the clichés the feed is genuinely drowning in.',
        ],
      ],
    },
    {
      heading: 'The hook: the only line most readers ever see',
      body: [
        [
          'Since LinkedIn truncates a post after roughly two lines behind a "see more," the ',
          {
            text: 'first line has to work as a genuine hook',
            href: '/prompts/linkedin/linkedin-post-hook-first-line',
          },
          ' or the rest of the post never gets read at all — a structural fact this prompt is built around directly.',
        ],
      ],
    },
    {
      heading: 'Turning experience into content: stories, case studies, recaps',
      body: [
        [
          'Turning a personal experience into a genuine lesson, not a thinly-disguised humblebrag — ',
          {
            text: 'this prompt',
            href: '/prompts/linkedin/linkedin-personal-story-to-lesson-post',
          },
          ' — is the format that performs best on the platform when done honestly. A ',
          {
            text: 'case study post built from a real project',
            href: '/prompts/linkedin/linkedin-case-study-post-from-project',
          },
          ' and a ',
          {
            text: 'conference speaking recap',
            href: '/prompts/linkedin/linkedin-conference-speaking-recap-post',
          },
          " both apply the same show-don't-tell principle to different formats.",
        ],
      ],
    },
    {
      heading: 'Profile and presence: headline, About section, featured',
      body: [
        [
          'Rewriting a ',
          {
            text: 'LinkedIn headline to actually work everywhere it appears',
            href: '/prompts/linkedin/linkedin-headline-optimization',
          },
          ' — not just on your own profile, but in search results and comment threads — matters more than most people realise. A ',
          {
            text: 'rewritten About section that reads as a person, not a resume',
            href: '/prompts/linkedin/linkedin-about-section-rewrite',
          },
          ' and a ',
          {
            text: 'curated Featured section plan',
            href: '/prompts/linkedin/linkedin-featured-section-curation-plan',
          },
          ' round out a profile that actually represents you rather than a corporate summary.',
        ],
      ],
    },
    {
      heading: 'Formats beyond a single text post',
      body: [
        [
          'A ',
          {
            text: 'carousel/document post outline',
            href: '/prompts/linkedin/linkedin-carousel-document-post-outline',
          },
          ' structures a longer idea for the swipe format specifically. A well-designed ',
          {
            text: 'poll question',
            href: '/prompts/linkedin/linkedin-poll-question-design',
          },
          ' genuinely invites engagement rather than baiting a hollow reaction, and deciding between ',
          {
            text: 'an Article versus a standard Post',
            href: '/prompts/linkedin/linkedin-article-vs-post-decision-and-outline',
          },
          ' — with the right outline for whichever format wins — matters since the two have genuinely different reach mechanics.',
        ],
      ],
    },
    {
      heading: 'Business use: hiring, company voice, employee advocacy',
      body: [
        [
          'A ',
          {
            text: 'hiring post that actually attracts the right candidates',
            href: '/prompts/linkedin/linkedin-hiring-post-that-attracts-candidates',
          },
          ' beats a generic job-posting reshare. A ',
          {
            text: 'company page post in a consistent brand voice',
            href: '/prompts/linkedin/linkedin-company-page-post-brand-voice',
          },
          ' and ',
          {
            text: 'employee advocacy post templates',
            href: '/prompts/linkedin/linkedin-employee-advocacy-post-templates',
          },
          ' extend that same voice across a whole team rather than every employee improvising their own tone.',
        ],
      ],
    },
    {
      heading: 'Handling disagreement and repurposing existing content',
      body: [
        [
          'Posting a genuine disagreement without triggering backlash — ',
          {
            text: 'this prompt',
            href: '/prompts/linkedin/linkedin-disagreement-post-without-backlash',
          },
          ' — is a real skill distinct from either agreeing with everything or picking an unnecessary fight. And repurposing a full ',
          {
            text: 'blog post',
            href: '/prompts/linkedin/linkedin-repurpose-blog-post-into-post',
          },
          ' or an entire ',
          {
            text: 'report into an atomized series of posts',
            href: '/prompts/linkedin/linkedin-report-into-post-atomization',
          },
          ' turns one piece of writing into weeks of content rather than starting from scratch each time.',
        ],
      ],
    },
    {
      heading: 'Measuring what actually worked',
      body: [
        [
          'Analysing post performance and actually iterating on it — ',
          {
            text: 'this prompt',
            href: '/prompts/linkedin/linkedin-post-performance-analysis-and-iterate',
          },
          ' — closes the loop rather than posting on instinct indefinitely without checking what genuinely resonated.',
        ],
      ],
    },
    {
      heading: 'When LinkedIn needs to be part of a real content strategy',
      body: [
        [
          'Individual posts help build a presence. A coordinated content calendar, consistent posting cadence, and genuine thought-leadership positioning across a team is bigger, ongoing work. ',
          {
            text: "That's exactly what Scult's marketing team runs",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your content strategy.',
        ],
      ],
    },
  ],
  relatedTools: ['word-counter', 'slogan-generator'],
  relatedPrompts: ['linkedin-post-hook-first-line', 'linkedin-about-section-rewrite'],
  serviceTarget: 'google-ads-management',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
