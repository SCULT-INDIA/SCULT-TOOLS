import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'job-interview-prep-with-ai-playbook'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Preparing for a Job Interview With AI: Resume, Cover Letter, Mock Practice',
  h1: 'A resume rewrite, a tailored letter, and a real rehearsal before the interview',
  targetKeyword: 'job interview preparation with ai',
  description:
    'Quantified resume bullets, a tailored cover letter, and mock interview practice with an AI persona that actually pushes back — a real job-search preparation playbook.',
  dek: 'Job search preparation has three genuinely separate steps — fixing the resume, tailoring the letter, and rehearsing the actual conversation — and most people skip the third one entirely.',
  sections: [
    {
      heading: 'Step 1: resume bullets with real quantified impact',
      body: [
        [
          'Rewrite resume bullets to ',
          {
            text: 'show quantified impact',
            href: '/prompts/writing/rewrite-resume-bullets-with-quantified-impact',
          },
          ' — turning "responsible for X" into a specific, measurable outcome is the single biggest lever most resumes are missing.',
        ],
      ],
    },
    {
      heading: 'Step 2: a cover letter tailored to the specific posting',
      body: [
        [
          'Tailor ',
          {
            text: 'the cover letter to the actual job posting',
            href: '/prompts/writing/tailor-a-cover-letter-to-a-job-posting',
          },
          ' rather than reusing one generic version across every application — a generic letter is noticeable to anyone reading dozens of them.',
        ],
      ],
    },
    {
      heading: 'Step 3: the rehearsal most people skip',
      body: [
        [
          'A ',
          {
            text: 'mock job interviewer persona',
            href: '/prompts/ai-companions/ai-companions-mock-job-interviewer-persona',
          },
          ' rehearses the actual pressure of an interview, not just the questions in isolation — the persona is built to genuinely push back rather than agree easily, since a persona that agrees too readily teaches nothing.',
        ],
      ],
    },
    {
      heading: 'Step 4: your LinkedIn presence, matched to the story',
      body: [
        [
          'Make sure the story on paper matches the story online: rewrite the ',
          {
            text: 'LinkedIn About section',
            href: '/prompts/linkedin/linkedin-about-section-rewrite',
          },
          ' and ',
          { text: 'headline', href: '/prompts/linkedin/linkedin-headline-optimization' },
          ' so a hiring manager who checks your profile sees the same narrative the resume and letter are telling.',
        ],
      ],
    },
    {
      heading: 'The night before: one more rehearsal',
      body: [
        [
          'Run the mock interview persona one more time the night before, specifically practising the questions that felt weakest in earlier rounds — the value of repeated rehearsal compounds, and the specific weak spots are worth targeting directly rather than starting from scratch each time.',
        ],
      ],
    },
    {
      heading: 'Checking everything fits',
      body: [
        [
          'Run the final resume and letter through the ',
          { text: 'Word Counter', href: '/productivity/word-counter' },
          ' to confirm they fit standard length expectations before submitting.',
        ],
      ],
    },
    {
      heading: 'When the search is for a technical or founder-level role',
      body: [
        [
          'If the role itself is technical, pairing this with real project work — a portfolio, a working prototype — matters as much as the interview prep. ',
          { text: "Scult's software team", href: SERVICE.href, external: true },
          ' helps founders and technical candidates build exactly that, or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk it through.',
        ],
      ],
    },
  ],
  relatedTools: ['word-counter'],
  relatedPrompts: [
    'rewrite-resume-bullets-with-quantified-impact',
    'ai-companions-mock-job-interviewer-persona',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
