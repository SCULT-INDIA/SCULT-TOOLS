import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'cursor-rules-agent-mode-guide'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Prompt titles/slugs verified against lib/prompts/cursor/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title:
    "Cursor Agent Mode: Briefs That Stop It Wandering Into Files You Didn't Ask About",
  h1: "Why does Cursor's Agent mode keep editing files you never mentioned?",
  targetKeyword: 'cursor agent mode prompts',
  description:
    'A vague Agent-mode brief in Cursor leads to changes spreading into files you never scoped. Free, constraint-heavy prompt templates that keep an agentic editor on task.',
  dek: "Cursor's Agent mode can genuinely build a multi-file feature — but only if the brief actually constrains scope. Left vague, it wanders, and reviewing a diff that touched twice as many files as expected is a worse outcome than writing the constraint upfront.",
  sections: [
    {
      heading: 'Why Agent mode specifically needs tighter briefs than chat',
      body: [
        [
          'Asking a chat assistant a question and asking an agentic editor to build a feature are different categories of request — Agent mode can actually touch your filesystem, and a loosely scoped brief gives it room to wander into files you never intended to change. The ',
          { text: 'Cursor prompt library', href: '/prompts/cursor' },
          ' is written specifically with the constraint blocks that stop that from happening, not generic feature descriptions.',
        ],
        [
          'The foundational entry, ',
          {
            text: "briefing Cursor's Agent mode to build a multi-file feature without wandering into untouched files",
            href: '/prompts/cursor/cursor-agent-mode-multifile-feature-brief',
          },
          ', is built around explicitly naming which files are in scope and, just as importantly, which are explicitly out of scope — the second half is what most hand-written briefs skip.',
        ],
      ],
    },
    {
      heading: 'Cmd+K: keeping an inline edit actually inline',
      body: [
        [
          'A related, smaller-scale version of the same problem: Cmd+K inline edits sometimes rewrite more of a block than intended, when the instruction was meant to change only the highlighted lines. ',
          {
            text: 'Forcing Cmd+K to change only the highlighted lines, not the whole block around them',
            href: '/prompts/cursor/cursor-cmdk-scoped-inline-edit-brief',
          },
          ' addresses this directly with an explicit scope constraint in the instruction itself.',
        ],
      ],
    },
    {
      heading: 'BugBot and checkpoints: review and rollback, not just generation',
      body: [
        [
          'Cursor BugBot reviewing a PR benefits from being pointed at the actual risk rather than a generic full-diff pass — ',
          {
            text: 'pointing BugBot at the real risk in a PR instead of a generic scan',
            href: '/prompts/cursor/cursor-bugbot-focused-pr-review-brief',
          },
          " does exactly that. And Agent mode's checkpoints — snapshots taken during a session — become a genuine safety net for a risky refactor only if you actually plan to use them as one; ",
          {
            text: 'turning Agent-mode checkpoints into a real rollback plan',
            href: '/prompts/cursor/cursor-agent-checkpoint-rollback-brief',
          },
          ' treats them as a deliberate strategy rather than an incidental feature.',
        ],
      ],
    },
    {
      heading: 'Monorepos, design mocks, and spec-driven tests',
      body: [
        [
          'In a multi-root monorepo workspace, telling Cursor which package actually owns a given change avoids edits leaking across package boundaries that were never meant to be touched together — the specific problem ',
          {
            text: 'that prompt',
            href: '/prompts/cursor/cursor-multiroot-workspace-package-boundary-brief',
          },
          ' addresses. For design work, ',
          {
            text: 'turning a pasted design screenshot into a component built from your existing design system',
            href: '/prompts/cursor/cursor-design-mock-component-brief',
          },
          ' keeps a generated component consistent with what already exists rather than inventing new patterns. And for testing, ',
          {
            text: 'having Agent mode write tests against the actual spec rather than against whatever the code already does',
            href: '/prompts/cursor/cursor-agent-spec-driven-test-brief',
          },
          ' avoids the circular trap of tests that just confirm existing (possibly buggy) behaviour.',
        ],
      ],
    },
    {
      heading: 'Dependency upgrades and self-auditing scope creep',
      body: [
        [
          'A major dependency upgrade benefits from explicit staging — triage what needs to change, migrate it, then verify — rather than one enormous, hard-to-review commit; ',
          {
            text: 'running a major dependency upgrade through Agent mode in triage-migrate-verify stages',
            href: '/prompts/cursor/cursor-staged-dependency-upgrade-brief',
          },
          ' is built around that staged structure. And one prompt turns the scope-creep problem back on the agent itself: ',
          {
            text: 'making Agent mode audit its own diff for scope creep before you review it',
            href: '/prompts/cursor/cursor-composer-scope-creep-self-audit-brief',
          },
          ' catches wandering changes before a human reviewer has to.',
        ],
      ],
    },
    {
      heading: 'Notepads: writing the brief once for a task that recurs',
      body: [
        [
          'For a task that comes up repeatedly with the same shape, a Cursor Notepad written once removes the need to re-explain the brief every time — ',
          {
            text: 'building a Notepad once with reusable context so a recurring task stops needing a re-explained brief',
            href: '/prompts/cursor/cursor-notepad-reusable-context-brief',
          },
          ' is the template for setting that up properly the first time.',
        ],
      ],
    },
    {
      heading: 'When Cursor is one part of a bigger engineering setup',
      body: [
        [
          "Good briefs make Agent mode reliable for individual tasks. Configuring a whole team's Cursor workflow — shared rules, consistent conventions across a codebase — is a bigger setup question. ",
          {
            text: "That's the kind of engineering process work Scult's software team helps with",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          " to talk through your team's setup.",
        ],
      ],
    },
  ],
  relatedTools: ['json-formatter', 'ai-visibility-checker'],
  relatedPrompts: [
    'cursor-agent-mode-multifile-feature-brief',
    'cursor-composer-scope-creep-self-audit-brief',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
