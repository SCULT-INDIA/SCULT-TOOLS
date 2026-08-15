import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'everyday-writing-prompts-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/writing/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Cover Letters, Cold Emails, Resume Bullets: Everyday Writing Prompts',
  h1: 'The writing everyone has to do, but almost nobody enjoys',
  targetKeyword: 'everyday writing prompts',
  description:
    'A cover letter tailored to a real posting, resume bullets with quantified impact, a cold email that gets replies, and difficult-conversation scripts — free prompts for it.',
  dek: 'Cover letters, resume bullets and cold outreach are the writing tasks almost everyone has to do at some point and almost nobody has genuinely practised — the exact gap a well-structured prompt closes fastest.',
  sections: [
    {
      heading: 'Why this category exists alongside more specialised ones',
      body: [
        [
          'The ',
          { text: 'Everyday Writing prompt library', href: '/prompts/writing' },
          ' covers the genuinely high-volume, practical writing tasks that come up for almost everyone at some point — a cover letter, a resume, a cold email — included here specifically for that breadth rather than as a growth bet for the site.',
        ],
      ],
    },
    {
      heading: 'Job search: tailored cover letters and quantified resume bullets',
      body: [
        [
          'Tailoring a cover letter to a specific job posting — ',
          {
            text: 'this prompt',
            href: '/prompts/writing/tailor-a-cover-letter-to-a-job-posting',
          },
          ' — beats a generic template reused across every application, since hiring managers notice the difference. Rewriting resume bullets to show quantified impact — ',
          {
            text: 'covered here',
            href: '/prompts/writing/rewrite-resume-bullets-with-quantified-impact',
          },
          ' — turns "responsible for X" into a specific, measurable outcome, which is the single biggest lever most resumes are missing.',
        ],
      ],
    },
    {
      heading: 'Outreach that earns a reply',
      body: [
        [
          'A cold outreach email built to actually get replies — ',
          {
            text: 'this prompt',
            href: '/prompts/writing/write-a-cold-outreach-email-that-gets-replies',
          },
          ' — respects the same principle real sales outreach does: genuine specificity beats a generic template every time, whether the goal is a job, a client, or a partnership.',
        ],
      ],
    },
    {
      heading: 'Difficult conversations, in writing first',
      body: [
        [
          'Drafting a script for a genuinely difficult conversation — ',
          {
            text: 'this prompt',
            href: '/prompts/writing/draft-a-script-for-a-difficult-conversation',
          },
          ' — before having it live gives you the chance to find the right words in advance rather than improvising under pressure in the moment.',
        ],
      ],
    },
    {
      heading: 'Explaining, condensing, and following up',
      body: [
        [
          'Explaining a topic like the reader is a complete beginner — ',
          {
            text: 'this prompt',
            href: '/prompts/writing/explain-a-topic-like-im-a-beginner',
          },
          ' — forces genuine clarity rather than assumed context. Tightening writing down to a strict word limit — ',
          {
            text: 'covered here',
            href: '/prompts/writing/tighten-writing-to-a-strict-word-limit',
          },
          ' — respects a real constraint many writing tasks have. A genuine thank-you or follow-up note — ',
          {
            text: 'this prompt',
            href: '/prompts/writing/write-a-genuine-thank-you-or-follow-up-note',
          },
          ' — avoids sounding like a template. And turning messy bullet notes into a coherent paragraph — ',
          {
            text: 'covered here',
            href: '/prompts/writing/turn-messy-notes-into-a-coherent-paragraph',
          },
          ' — solves the specific, common problem of having the content already but not the structure.',
        ],
      ],
    },
    {
      heading: 'Checking the result before sending it',
      body: [
        [
          'Once a draft is done, run it through the ',
          { text: 'Word Counter', href: '/productivity/word-counter' },
          ' to confirm it actually fits whatever length constraint applies — a cover letter, a LinkedIn message, an email subject line each have their own practical limits worth checking before hitting send.',
        ],
      ],
    },
    {
      heading: 'When writing needs to become a real communication system',
      body: [
        [
          "These prompts solve individual writing tasks well. If communication needs to become a coordinated system across a team — templates, a shared voice, consistent process — that's a bigger operational question. ",
          {
            text: "That's the kind of tooling Scult's software team can help build",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk it through.',
        ],
      ],
    },
  ],
  relatedTools: ['word-counter', 'email-signature-generator'],
  relatedPrompts: [
    'tailor-a-cover-letter-to-a-job-posting',
    'rewrite-resume-bullets-with-quantified-impact',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
