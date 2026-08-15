import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'chatgpt-prompts-guide'
const SERVICE = resolveServiceLink('ai-consulting', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Prompt titles/slugs verified against lib/prompts/chatgpt/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'ChatGPT Prompts That Survive a Model Update (Free Library)',
  h1: 'Why your best ChatGPT prompt stopped working after the last update',
  targetKeyword: 'chatgpt prompts',
  description:
    'Most ChatGPT prompts break the moment the model updates because they lean on conversational quirks instead of structure. A free library of prompts built to survive that.',
  dek: 'The single highest-volume prompt search there is, and also the easiest category to get generic advice about. Here is what actually separates a ChatGPT prompt that keeps working across model versions from one that quietly stops.',
  sections: [
    {
      heading: 'Why so many ChatGPT prompts have a short shelf life',
      body: [
        [
          'A prompt that works well relies on one of two things: either genuine structure — a stated role, explicit context, a defined output format — or a specific behavioural quirk of the exact model version you tested it against. The first kind keeps working after OpenAI ships a model update; the second kind breaks silently, often without any error, just a subtly worse or differently-formatted response than you remember getting a few weeks earlier.',
        ],
        [
          'The ',
          { text: 'ChatGPT prompt library', href: '/prompts/chatgpt' },
          " on this site is built specifically around the first kind: structured, reusable prompts with role, context and format constraints spelled out explicitly, rather than relying on conversational momentum or a specific model's current default tone.",
        ],
      ],
    },
    {
      heading: 'Custom Instructions: the setting most people configure once and forget',
      body: [
        [
          'Custom Instructions let you set a persistent role and context that should apply across every new chat — but a common failure mode is setting it once, loosely, and then finding it quietly resets or gets ignored as conversations pile up. The library includes a prompt specifically for ',
          {
            text: 'locking in a recurring role so Custom Instructions stop resetting every new chat',
            href: '/prompts/chatgpt/chatgpt-custom-instructions-recurring-role-profile',
          },
          ', built around the actual mechanics of how that setting persists rather than a vague "describe yourself to ChatGPT" suggestion.',
        ],
      ],
    },
    {
      heading: 'Custom GPTs need instructions that hold past message five',
      body: [
        [
          "A Custom GPT's persona instructions frequently work fine for the first few exchanges and then drift — the model reverts to a generic tone once the conversation has enough turns that the original system instructions carry proportionally less weight. The library's prompt for ",
          {
            text: "writing a Custom GPT's persona and instructions so it holds up past the first five messages",
            href: '/prompts/chatgpt/chatgpt-custom-gpt-persona-instructions-brief',
          },
          ' is built around exactly that drift problem, not just a generic personality brief.',
        ],
      ],
    },
    {
      heading: 'Actions and Memory: the features most prompt libraries ignore entirely',
      body: [
        [
          'Two ChatGPT capabilities most prompt collections skip because they are newer and more technical: Actions, which let a Custom GPT call a real API, and Memory, which persists facts across sessions. Turning a plain-English API description into a genuinely callable Actions schema is a structured technical task, covered by ',
          {
            text: 'a dedicated prompt for authoring that schema correctly',
            href: '/prompts/chatgpt/chatgpt-gpt-actions-openapi-schema-authoring',
          },
          '. Memory has a different, quieter problem: it silently accumulates whatever ChatGPT decides to save, some of it wrong or outdated, and ',
          {
            text: 'auditing and correcting what has actually been saved',
            href: '/prompts/chatgpt/chatgpt-memory-audit-and-correction-pass',
          },
          ' is worth doing periodically rather than trusting it accumulates correctly on its own.',
        ],
      ],
    },
    {
      heading: 'Canvas: scoped edits instead of regenerating everything',
      body: [
        [
          'Canvas exists specifically to solve the regenerate-the-whole-document problem — editing one section of a long document without ChatGPT rewriting the rest and introducing new inconsistencies. Two prompts target this directly: ',
          {
            text: 'section-scoped writing revisions in Canvas',
            href: '/prompts/chatgpt/chatgpt-canvas-scoped-writing-revision-pass',
          },
          ' for prose, and ',
          {
            text: 'an iterative code review loop in Canvas',
            href: '/prompts/chatgpt/chatgpt-canvas-iterative-code-review-loop',
          },
          ' for code specifically — structured so earlier fixes do not get silently lost as later rounds of review happen.',
        ],
      ],
    },
    {
      heading: 'Worked example: fixing a prompt that broke after an update',
      body: [
        [
          'If a prompt that used to work reliably now produces inconsistent formatting, the fix is rarely "write a longer prompt" — it is usually adding the explicit structure that was previously being carried by the model\'s prior default behaviour: state the role directly rather than implying it from context, specify the exact output format rather than assuming the model will infer your preferred structure, and constrain length or tone explicitly rather than trusting a "keep it concise" instruction the model may now weight differently.',
        ],
      ],
    },
    {
      heading: 'When ChatGPT prompting is part of a bigger automation need',
      body: [
        [
          "Individual prompts solve individual tasks. If ChatGPT (via Actions or the API) needs to become part of an actual internal workflow — a support bot, an internal tool, a repeatable business process — that's engineering work, ",
          {
            text: "the kind Scult's AI agents team builds",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through what that would look like.',
        ],
      ],
    },
  ],
  relatedTools: ['ai-visibility-checker', 'json-formatter'],
  relatedPrompts: [
    'chatgpt-custom-instructions-recurring-role-profile',
    'chatgpt-memory-audit-and-correction-pass',
  ],
  serviceTarget: 'ai-consulting',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
