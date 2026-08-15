import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ai-companion-roleplay-prompts-guide'
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)
const SERVICE = resolveServiceLink('custom-software', SLUG)

/**
 * Slugs verified against lib/prompts/ai-companions/prompts.ts. Content
 * scope matches this category's documented contentBoundary (categories.ts):
 * persona-design and role-play scenarios only, professional/educational
 * use cases — no romantic or intimate framing of any kind.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'AI Roleplay Prompts for Practice: Interviews, Debates, Difficult Conversations',
  h1: 'Practising a hard conversation with an AI persona before the real one',
  targetKeyword: 'ai roleplay practice prompts',
  description:
    'Structured AI persona prompts for practising a job interview, a sales negotiation, a difficult performance review, or a public-speaking rehearsal — before the real one.',
  dek: 'Rehearsing a genuinely difficult conversation — a job interview, a hard performance review, a sales negotiation with a skeptical buyer — with a well-built AI persona beats rehearsing alone, because a persona actually pushes back.',
  sections: [
    {
      heading: 'What this category is, and what it deliberately is not',
      body: [
        [
          'This is a persona-design and role-play prompt library scoped specifically to professional and educational practice — job interviews, negotiation, public speaking, language exams, difficult workplace conversations. It is not a companion or romantic-roleplay category, and the ',
          { text: 'AI Companions & Personas', href: '/prompts/ai-companions' },
          ' library reflects that scope directly: every prompt here is a training or rehearsal scenario, not a persona-relationship product.',
        ],
      ],
    },
    {
      heading: 'Interview and career-conversation practice',
      body: [
        [
          'A ',
          {
            text: 'mock job interviewer persona',
            href: '/prompts/ai-companions/ai-companions-mock-job-interviewer-persona',
          },
          ' rehearses the actual pressure of an interview, not just the questions in isolation. An ',
          {
            text: 'investor-pitch grilling persona',
            href: '/prompts/ai-companions/ai-companions-investor-pitch-grilling-persona',
          },
          ' does the same for founders facing skeptical questioning, and a ',
          {
            text: 'performance-review difficult-conversation roleplay',
            href: '/prompts/ai-companions/ai-companions-performance-review-difficult-conversation-roleplay',
          },
          ' lets a manager rehearse delivering hard feedback before the real conversation.',
        ],
      ],
    },
    {
      heading: 'Negotiation, sales, and handling a difficult customer',
      body: [
        [
          'A ',
          {
            text: 'skeptical-buyer sales negotiation roleplay',
            href: '/prompts/ai-companions/ai-companions-sales-negotiation-skeptical-buyer-roleplay',
          },
          ' rehearses genuine pushback rather than an easy, cooperative counterpart. A ',
          {
            text: 'difficult-customer roleplay for staff training',
            href: '/prompts/ai-companions/ai-companions-difficult-customer-roleplay-staff-training',
          },
          ' trains frontline staff on de-escalation before a real, higher-stakes interaction. A ',
          {
            text: 'debate-practice opponent persona',
            href: '/prompts/ai-companions/ai-companions-debate-practice-opponent-persona',
          },
          ' sharpens argumentation by genuinely arguing back rather than agreeing.',
        ],
      ],
    },
    {
      heading: 'Language, oral exams, and public speaking',
      body: [
        [
          'A ',
          {
            text: 'conversation partner for language practice',
            href: '/prompts/ai-companions/ai-companions-language-practice-conversation-partner',
          },
          ' provides low-stakes speaking practice on demand, and an ',
          {
            text: 'oral language exam examiner persona',
            href: '/prompts/ai-companions/ai-companions-oral-language-exam-examiner-persona',
          },
          ' rehearses the specific format of a real spoken exam. A ',
          {
            text: 'public-speaking rehearsal audience persona',
            href: '/prompts/ai-companions/ai-companions-public-speaking-rehearsal-audience-persona',
          },
          ' gives a speaker a genuine sense of presenting to someone, not an empty room.',
        ],
      ],
    },
    {
      heading: 'Training scenarios: healthcare, law, media',
      body: [
        [
          'A ',
          {
            text: 'clinical patient roleplay for healthcare training',
            href: '/prompts/ai-companions/ai-companions-clinical-patient-roleplay-healthcare-training',
          },
          ' lets trainee clinicians practise a consultation before a real patient. A ',
          {
            text: 'mock-trial witness persona for law students',
            href: '/prompts/ai-companions/ai-companions-mock-trial-witness-persona-law-students',
          },
          ' does the same for cross-examination practice, and a ',
          {
            text: 'press-conference reporter persona for media training',
            href: '/prompts/ai-companions/ai-companions-press-conference-reporter-persona-media-training',
          },
          ' rehearses handling pointed questions under pressure.',
        ],
      ],
    },
    {
      heading: 'Creative and historical: writing collaborators and Q&A personas',
      body: [
        [
          'For writers, a ',
          {
            text: 'creative-writing collaborator persona',
            href: '/prompts/ai-companions/ai-companions-creative-writing-collaborator-persona',
          },
          ' and a ',
          {
            text: 'fiction-character persona for creative writing',
            href: '/prompts/ai-companions/ai-companions-fiction-character-persona-creative-writing',
          },
          ' both give a writer a genuine creative sparring partner. A ',
          {
            text: 'historical-figure Q&A persona',
            href: '/prompts/ai-companions/ai-companions-historical-figure-qa-persona',
          },
          ' makes history genuinely interactive for study, and a ',
          {
            text: 'tabletop narrator for solo RPG play',
            href: '/prompts/ai-companions/ai-companions-tabletop-narrator-solo-rpg',
          },
          ' runs a genuine game session for a single player.',
        ],
      ],
    },
    {
      heading: 'The rule that makes any of these actually useful',
      body: [
        [
          'A persona that agrees too easily teaches nothing — the entire value of rehearsing a hard conversation is that the counterpart genuinely pushes back, asks the awkward follow-up, or holds a position under pressure. Every prompt in this library is built to make the AI actually play its adversarial or challenging role convincingly, rather than defaulting to the agreeable, cooperative tone most assistants use by default.',
        ],
      ],
    },
    {
      heading: 'When rehearsal needs to be part of a real training programme',
      body: [
        [
          "A single prompt gets one person through one rehearsal. Building structured training scenarios into an actual onboarding or L&D programme across a whole team is different, bigger work. If that's what you need, ",
          {
            text: "that's the kind of tooling Scult's software team can build",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through it.',
        ],
      ],
    },
  ],
  relatedTools: ['ai-visibility-checker', 'word-counter'],
  relatedPrompts: [
    'ai-companions-mock-job-interviewer-persona',
    'ai-companions-sales-negotiation-skeptical-buyer-roleplay',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
