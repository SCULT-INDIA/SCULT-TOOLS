import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'claude-code-team-setup-playbook'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Setting Up Claude Code for a New Engineering Team',
  h1: 'The setup that decides whether Claude Code is consistent or a coin flip per engineer',
  targetKeyword: 'claude code team setup',
  description:
    'A CLAUDE.md file, custom slash commands, permission allowlists and hooks — the real setup checklist for making Claude Code behave consistently across an entire engineering team.',
  dek: 'Without a real setup, Claude Code behaves differently depending on which engineer is using it — with one, every session inherits the same rules, permissions and guardrails.',
  sections: [
    {
      heading: 'Step 1: a CLAUDE.md that actually holds up',
      body: [
        [
          'Start with ',
          {
            text: 'a CLAUDE.md file written to hold up after fifty sessions',
            href: '/prompts/claude-code/claude-code-claude-md-authoring',
          },
          ' — specific, current rules with the reasoning behind them, not vague guidance that different sessions interpret differently.',
        ],
      ],
    },
    {
      heading: 'Step 2: slash commands for recurring team workflows',
      body: [
        [
          'Author ',
          {
            text: 'custom slash commands',
            href: '/prompts/claude-code/claude-code-custom-slash-command',
          },
          ' for the tasks the team runs repeatedly — the same command should behave identically for every engineer, every time, regardless of who invokes it.',
        ],
      ],
    },
    {
      heading: 'Step 3: a permission allowlist decided deliberately',
      body: [
        [
          'Get this wrong in either direction and you either interrupt every session with unnecessary confirmations or grant more autonomy than intended — the permissions allowlist prompt covers making this decision deliberately rather than accepting the defaults.',
        ],
      ],
    },
    {
      heading: 'Step 4: hooks as real guardrails, not documentation',
      body: [
        [
          'A pretooluse hook guardrail actually blocks or modifies a risky action before it happens, rather than just documenting a rule everyone is supposed to remember — the difference between a real guardrail and a policy nobody enforces.',
        ],
      ],
    },
    {
      heading: 'Step 5: plan mode for multi-file changes',
      body: [
        [
          'Force ',
          {
            text: 'a written plan before any multi-file feature lands',
            href: '/prompts/claude-code/claude-code-plan-mode-multi-file-feature',
          },
          ' — this catches a wrong approach before it becomes a half-finished, hard-to-unwind change spread across many files.',
        ],
      ],
    },
    {
      heading: 'Rolling this out across a real team',
      body: [
        [
          "Getting all five pieces configured consistently across a team, not just one engineer's local setup, is real engineering process work — ",
          {
            text: "the kind Scult's software team helps establish",
            href: SERVICE.href,
            external: true,
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Get help setting it up',
      body: [
        [
          'Rolling out Claude Code across your team and want a real setup, not an ad-hoc one? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: ['json-formatter'],
  relatedPrompts: [
    'claude-code-claude-md-authoring',
    'claude-code-plan-mode-multi-file-feature',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
