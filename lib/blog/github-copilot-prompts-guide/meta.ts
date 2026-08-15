import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'github-copilot-prompts-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Slugs verified against lib/prompts/github-copilot/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: 'GitHub Copilot: Repo Instructions vs. Chat Prompts (Free Library)',
  h1: 'Copilot autocompleting your habits, or Copilot following your standards?',
  targetKeyword: 'github copilot prompts',
  description:
    'A repository custom-instructions file changes what Copilot suggests by default, project-wide. A free library covering that, plus chat modes, agent tasks and code review prompts.',
  dek: "The difference between Copilot quietly autocompleting whatever pattern it has seen most and Copilot actually following your team's standards comes down to one file most repos never write.",
  sections: [
    {
      heading: 'Repository instructions: the file that changes every suggestion',
      body: [
        [
          "GitHub Copilot reads a repository-level instructions file and applies it to every suggestion across the codebase, not just the current file — which means writing it once changes Copilot's default behaviour project-wide rather than requiring every developer to repeat the same correction in every chat. The ",
          { text: 'GitHub Copilot prompt library', href: '/prompts/github-copilot' },
          "'s foundational entry, ",
          {
            text: 'authoring a repo instructions file',
            href: '/prompts/github-copilot/github-copilot-repo-instructions-md',
          },
          ', is built around exactly this leverage — a small amount of writing, applied everywhere.',
        ],
        [
          'For a monorepo or a project with genuinely different conventions in different directories, ',
          {
            text: 'path-scoped instructions',
            href: '/prompts/github-copilot/github-copilot-path-scoped-instructions',
          },
          ' apply different rules to different parts of the codebase, rather than forcing one global instruction set to fit every directory equally badly.',
        ],
      ],
    },
    {
      heading: 'Chat modes and reusable prompt files',
      body: [
        [
          'A custom chat mode configures Copilot Chat for a specific recurring context — ',
          {
            text: 'building one',
            href: '/prompts/github-copilot/github-copilot-custom-chat-mode',
          },
          ' means not re-explaining that context every session. A ',
          {
            text: 'reusable prompt file',
            href: '/prompts/github-copilot/github-copilot-reusable-prompt-file',
          },
          ' does the same for a specific recurring task, and ',
          {
            text: 'task-specific generation instructions',
            href: '/prompts/github-copilot/github-copilot-task-specific-generation-instructions',
          },
          ' narrow default suggestions for one well-defined kind of task rather than leaving Copilot to infer intent from context alone.',
        ],
      ],
    },
    {
      heading: 'From issue to plan to scoped agent task',
      body: [
        [
          'Copilot Workspace turning a raw GitHub issue into an actual implementation plan — ',
          {
            text: 'that specific workflow',
            href: '/prompts/github-copilot/github-copilot-workspace-issue-to-plan',
          },
          ' — and a properly scoped issue for the Coding Agent — ',
          {
            text: 'writing one',
            href: '/prompts/github-copilot/github-copilot-coding-agent-scoped-issue',
          },
          ' — both address the same underlying problem: an agent given a vague issue produces a vague, hard-to-review result. A tight brief for Agent mode specifically — ',
          {
            text: 'a task brief template',
            href: '/prompts/github-copilot/github-copilot-agent-mode-task-brief',
          },
          ' — and a migration plan for Copilot Edits — ',
          {
            text: 'that template',
            href: '/prompts/github-copilot/github-copilot-edits-migration-plan',
          },
          ' — cover the same principle applied to two more specific workflows.',
        ],
      ],
    },
    {
      heading: 'Debugging, testing and code review, done with Copilot Chat',
      body: [
        [
          'Pasting a raw stack trace into Copilot Chat often works better with a structured framing — ',
          {
            text: 'debugging from a stack trace',
            href: '/prompts/github-copilot/github-copilot-chat-debug-stack-trace',
          },
          ' — and chaining explain, fix and test generation together as one flow rather than three separate disconnected asks is what ',
          {
            text: 'the slash-command chain prompt',
            href: '/prompts/github-copilot/github-copilot-slash-explain-fix-tests-chain',
          },
          " covers. For review specifically, focusing Copilot's attention on genuine risk in a diff rather than a generic pass over every line is what ",
          {
            text: 'the code-review risk-focus prompt',
            href: '/prompts/github-copilot/github-copilot-code-review-risk-focus',
          },
          ' does, alongside a dedicated ',
          {
            text: 'accessibility review prompt',
            href: '/prompts/github-copilot/github-copilot-accessibility-review',
          },
          ' and an ',
          {
            text: 'edge-case test suite generator',
            href: '/prompts/github-copilot/github-copilot-edge-case-test-suite',
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Terminal, screenshots, and picking the right model',
      body: [
        [
          'Copilot in the terminal explaining a command before you run it — ',
          {
            text: 'that workflow',
            href: '/prompts/github-copilot/github-copilot-terminal-chat-explainer',
          },
          ' — and turning a screenshot directly into code — ',
          {
            text: 'the vision-to-code prompt',
            href: '/prompts/github-copilot/github-copilot-vision-screenshot-to-code',
          },
          ' — both lean on Copilot capabilities many developers never try. And since Copilot now supports picking between different underlying models, ',
          {
            text: 'a model-picker task-fit guide',
            href: '/prompts/github-copilot/github-copilot-model-picker-task-fit',
          },
          ' helps match the model choice to the actual task rather than defaulting to whichever one is currently selected.',
        ],
      ],
    },
    {
      heading: "When Copilot's setup needs to be a real team standard",
      body: [
        [
          'Individual prompts help one developer. Getting repo instructions, chat modes and Agent conventions set up consistently across a whole team is a bigger process decision. ',
          {
            text: "That's exactly what Scult's software team helps establish",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          " to talk through your team's current setup.",
        ],
      ],
    },
  ],
  relatedTools: ['json-formatter', 'ai-visibility-checker'],
  relatedPrompts: [
    'github-copilot-repo-instructions-md',
    'github-copilot-code-review-risk-focus',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
