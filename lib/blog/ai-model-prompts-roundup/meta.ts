import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'ai-model-prompts-roundup'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'ChatGPT vs Claude vs Gemini vs Perplexity vs Grok: Prompting Each One Right',
  h1: "The same prompt does not work equally well across every AI model — here's why",
  targetKeyword: 'best ai model prompts comparison',
  description:
    'Nine AI assistant prompt libraries, each written for what actually differentiates that model — structure for Claude, long context for Gemini, live X data for Grok.',
  dek: 'A prompt copy-pasted across ChatGPT, Claude, Gemini, Perplexity and Grok performs differently on each one, not because of quality differences but because each model has a genuinely different real strength worth prompting toward.',
  sections: [
    {
      heading: 'Why "the same prompt" is the wrong instinct',
      body: [
        [
          "Each major AI assistant has a genuine, documented behavioural difference from the others — treating them as interchangeable and reusing one generic prompt across all of them leaves real capability on the table. This site's nine model-specific prompt libraries are each written around what actually differentiates that specific model.",
        ],
      ],
    },
    {
      heading: 'ChatGPT, Claude, and Gemini: three different structural strengths',
      body: [
        [
          'The ',
          { text: 'ChatGPT library', href: '/prompts/chatgpt' },
          ' leans on structured, reusable prompts that survive model updates — Custom Instructions, Custom GPTs, Actions, Memory, Canvas. The ',
          { text: 'Claude library', href: '/prompts/claude' },
          ' leans on explicit XML-style structure, since Claude parses that measurably better than loose conversational prompting. The ',
          { text: 'Gemini library', href: '/prompts/gemini' },
          ' leans on its very long context window and native multimodal input — video, audio, images processed directly, not through separate transcription.',
        ],
      ],
    },
    {
      heading: 'Perplexity and Grok: research versus real-time',
      body: [
        [
          'The ',
          { text: 'Perplexity library', href: '/prompts/perplexity' },
          ' treats it as a citation-first research engine, not a chatbot — source triangulation, citation-accuracy audits, structured research briefs. The ',
          { text: 'Grok library', href: '/prompts/grok' },
          ' leans specifically on real-time X/Twitter access, useful for exactly nothing a training-data-only model can replicate: live sentiment, breaking news, viral-claim fact-checking.',
        ],
      ],
    },
    {
      heading: 'Coding assistants: Claude Code, Cursor, GitHub Copilot',
      body: [
        [
          'The ',
          { text: 'Claude Code library', href: '/prompts/claude-code' },
          ' is framed around reusable rules and skills files (CLAUDE.md, slash commands, hooks), not one-off chat prompts. The ',
          { text: 'Cursor library', href: '/prompts/cursor' },
          ' is built around constraint-heavy Agent-mode briefs that stop an agentic editor from wandering into unintended files. The ',
          { text: 'GitHub Copilot library', href: '/prompts/github-copilot' },
          ' leans on repository-level instructions that change every suggestion project-wide, not just per-chat context.',
        ],
      ],
    },
    {
      heading: 'The two remaining categories: companions and Grok specifically',
      body: [
        [
          'The ',
          { text: 'AI Companions & Personas library', href: '/prompts/ai-companions' },
          ' is scoped specifically to professional and educational role-play — interview practice, negotiation rehearsal, language exams — not a companion-relationship product.',
        ],
      ],
    },
    {
      heading: 'Picking the right model for a specific task',
      body: [
        [
          'Long-document analysis or multimodal input: Gemini. Cited, verifiable research: Perplexity. Structured code work in a coding assistant: Claude Code, Cursor or Copilot depending on the tool you already use. Real-time social monitoring: Grok. Everything else, general-purpose structured tasks: ChatGPT or Claude, chosen by which one you already have access to and whether the task benefits from explicit XML structure.',
        ],
      ],
    },
    {
      heading: 'When one prompt library is not enough',
      body: [
        [
          'Individual prompts across these libraries solve individual tasks well. Building a genuine multi-model AI workflow into a real business process is engineering work. ',
          {
            text: "That's what Scult's AI agents team builds",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your use case.',
        ],
      ],
    },
  ],
  relatedTools: ['ai-visibility-checker', 'json-formatter'],
  relatedPrompts: [
    'chatgpt-custom-instructions-recurring-role-profile',
    'claude-projects-persistent-knowledge-base',
  ],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
