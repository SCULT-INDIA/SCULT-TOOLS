import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'claude-code-claude-md-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Prompt titles/slugs verified against lib/prompts/claude-code/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'How to Write a CLAUDE.md That Still Works After 50 Sessions',
  h1: 'Your CLAUDE.md file is a living rules document, not a one-time prompt',
  targetKeyword: 'claude code claude.md',
  description:
    'Claude Code prompting has shifted from one-off prompts to reusable rules and skills files. Free templates for CLAUDE.md, slash commands, hooks and permission allowlists.',
  dek: 'Practitioners working with Claude Code have moved past treating it as a chat interface you type prompts into — the real unit of reuse is a CLAUDE.md file, a slash command, or a hook. A library still framed around one-off prompts is already behind.',
  sections: [
    {
      heading: 'Why Claude Code needs a different mental model than a chat prompt',
      body: [
        [
          'A single prompt gets used once. A CLAUDE.md file gets read at the start of every session, indefinitely, which changes what "good" looks like: a rule vague enough to sound reasonable on first read but ambiguous on session fifty is worse than no rule at all, because it creates false confidence rather than genuine guidance. The ',
          { text: 'Claude Code prompt library', href: '/prompts/claude-code' },
          ' is framed around reusable rules and skills templates specifically, not flat one-off prompts.',
        ],
      ],
    },
    {
      heading: 'The core document: writing a CLAUDE.md that holds up',
      body: [
        [
          "The library's foundational entry, ",
          {
            text: 'writing a CLAUDE.md file that still holds up after fifty sessions',
            href: '/prompts/claude-code/claude-code-claude-md-authoring',
          },
          ', is built around the actual failure mode of these files: rules that were true and useful in session one silently becoming stale, contradicted by later decisions, or vague enough that different sessions interpret them differently. A good CLAUDE.md is specific, current, and revised as the project itself changes — closer to living documentation than a static prompt.',
        ],
      ],
    },
    {
      heading: 'Slash commands: consistency across every future invocation',
      body: [
        [
          'A custom slash command needs to behave identically every time it runs, months apart, regardless of what else has changed in the project. The prompt for ',
          {
            text: 'authoring a custom slash command Claude Code will run the same way every time',
            href: '/prompts/claude-code/claude-code-custom-slash-command',
          },
          ' is built around that consistency requirement specifically — a command that behaves differently depending on unstated context defeats the entire point of automating it.',
        ],
      ],
    },
    {
      heading: 'Subagents and hooks: delegation and guardrails',
      body: [
        [
          'A well-defined subagent needs a scoped, specific purpose rather than a vague "helper" role — the library covers exactly that in its subagent definition prompt. Hooks are the mechanism for enforcing a guardrail automatically rather than hoping every session remembers a rule; the pretooluse-hook-guardrail prompt is built around defining one that actually blocks or modifies a risky action before it happens, rather than just logging it after the fact.',
        ],
      ],
    },
    {
      heading: 'Permissions and plan mode: safety before automation',
      body: [
        [
          'A settings permissions allowlist decides what Claude Code can do without asking — get this wrong in either direction and you either interrupt every session with unnecessary confirmations or grant more autonomy than intended. And forcing a written plan before any multi-file change lands — ',
          {
            text: 'forcing a written plan before Claude Code touches a multi-file feature',
            href: '/prompts/claude-code/claude-code-plan-mode-multi-file-feature',
          },
          ' — catches a wrong approach before it becomes a half-finished, hard-to-unwind change across many files.',
        ],
      ],
    },
    {
      heading: 'Worked example: turning a repeated correction into a permanent rule',
      body: [
        [
          'If you find yourself correcting the same mistake across multiple sessions — a naming convention, a testing pattern, an architectural boundary — that repeated correction is the signal to add a specific, concrete rule to CLAUDE.md rather than repeating the correction indefinitely by hand. State the rule with the reason behind it (why, not just what), so a future session can judge edge cases the rule did not explicitly anticipate.',
        ],
      ],
    },
    {
      heading: 'When the setup itself needs expert configuration',
      body: [
        [
          "Getting Claude Code, its hooks, and its permission model configured correctly for a real team's actual workflow is genuinely engineering work, not a documentation-writing exercise. If that's where you're stuck, ",
          {
            text: "that's exactly what Scult's software team helps set up",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' to talk through your specific setup.',
        ],
      ],
    },
  ],
  relatedTools: ['json-formatter', 'ai-visibility-checker'],
  relatedPrompts: [
    'claude-code-claude-md-authoring',
    'claude-code-plan-mode-multi-file-feature',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
