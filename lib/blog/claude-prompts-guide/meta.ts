import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'claude-prompts-guide'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Prompt titles/slugs verified against lib/prompts/claude/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'Claude Prompts: Why XML Tags Actually Work (Free Library)',
  h1: "Claude reads structure differently than ChatGPT — here's how to write for that",
  targetKeyword: 'claude prompts',
  description:
    'Claude responds measurably better to explicit XML-style structure than to conversational prompting. A free library of prompts built for how Claude actually parses input.',
  dek: 'A prompt copy-pasted from a generic ChatGPT list often works less well in Claude, not because Claude is worse, but because it parses structure differently — and most prompt libraries never write for that difference at all.',
  sections: [
    {
      heading: 'Why the same prompt performs differently across models',
      body: [
        [
          'Claude responds measurably better to explicit structure — XML-style tags, imperative instructions, clearly stated output formats — than to a loosely worded conversational request. That is a real, documented behavioural difference, not a stylistic preference, which is exactly why a prompt written generically for "an AI assistant" and never adjusted for Claude specifically tends to underperform here compared with a model-specific one.',
        ],
        [
          'The ',
          { text: 'Claude prompt library', href: '/prompts/claude' },
          ' is written for that difference directly, not copy-pasted from a ChatGPT list with the model name swapped.',
        ],
      ],
    },
    {
      heading: 'Projects: the persistence layer most people underuse',
      body: [
        [
          "Claude Projects let you build a persistent knowledge base that stays accurate across many separate conversations, rather than re-explaining context every single chat. The library's prompt for ",
          {
            text: 'setting up a Claude Project that stays accurate for months, not just this chat',
            href: '/prompts/claude/claude-projects-persistent-knowledge-base',
          },
          ' is built around the actual maintenance discipline that keeps a Project useful over time rather than becoming stale reference material nobody trusts anymore.',
        ],
      ],
    },
    {
      heading: 'Artifacts: building something real, not a wall of text',
      body: [
        [
          'Artifacts let Claude produce a self-contained, interactive output — a dashboard, a tool, a visualization — rather than a text description of one. The prompt for ',
          {
            text: 'building a multi-view dashboard as one self-contained Claude Artifact',
            href: '/prompts/claude/claude-artifacts-multi-view-dashboard',
          },
          ' is structured around getting a genuinely usable, multi-view result in one generation rather than iterating blindly toward it.',
        ],
      ],
    },
    {
      heading: 'Long context: the real risk of "just paste the whole contract in"',
      body: [
        [
          "Claude's long context window is a genuine strength, but pasting a full document in and asking a vague question wastes most of that advantage. The library's prompt for ",
          {
            text: 'a long-context contract risk audit',
            href: '/prompts/claude/claude-long-context-contract-risk-audit',
          },
          ' is structured to actually use the full context for a specific, thorough task — flagging risk clauses systematically — rather than a generic summarisation request that could have been done with a much shorter excerpt.',
        ],
      ],
    },
    {
      heading: 'Safely ingesting untrusted content, and calibrating Extended Thinking',
      body: [
        [
          'Two more technical prompts worth knowing about: ',
          {
            text: 'XML-injection-safe content ingestion',
            href: '/prompts/claude/claude-xml-injection-safe-content-ingestion',
          },
          " addresses a real, specific risk — since Claude's own structure relies on XML-style tags, content containing similar-looking tags needs careful handling so it cannot be mistaken for actual instructions. And ",
          {
            text: 'Extended Thinking effort calibration',
            href: '/prompts/claude/claude-extended-thinking-effort-calibration',
          },
          ' helps you set the right reasoning depth for a task, rather than defaulting to maximum effort (slower, costlier) for something that did not need it, or too little for something that did.',
        ],
      ],
    },
    {
      heading: 'Getting Claude to write in your actual voice',
      body: [
        [
          'A recurring, real complaint about AI writing generally is that it reads as generically "AI-flavoured" regardless of the actual instruction given. The library\'s prompt for ',
          {
            text: 'getting Claude to write in your actual voice, not the generic AI default',
            href: '/prompts/claude/claude-voice-style-match-from-samples',
          },
          ' works by feeding real writing samples rather than describing a tone abstractly — showing, not telling, which is measurably more effective at actually shifting output style.',
        ],
      ],
    },
    {
      heading: 'When Claude needs to be part of a real product, not a chat window',
      body: [
        [
          "These prompts cover using Claude directly, in a browser tab. Building Claude into an actual product or internal tool via the API — a support agent, a document-processing pipeline — is a different scope of work. That's ",
          {
            text: "exactly what Scult's AI agents team does",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through what that would take.',
        ],
      ],
    },
  ],
  relatedTools: ['ai-visibility-checker', 'word-counter'],
  relatedPrompts: [
    'claude-projects-persistent-knowledge-base',
    'claude-voice-style-match-from-samples',
  ],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
