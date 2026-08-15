import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'rebrand-without-losing-customers-playbook'
const SERVICE = resolveServiceLink('branding-agency', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Rebranding an Established Business Without Losing Customers',
  h1: 'The rebrand risk nobody mentions: confusing customers who already trust you',
  targetKeyword: 'rebrand established business checklist',
  description:
    'A positioning audit, brand-consistency check, and a genuine SEO redirect plan — a rebrand playbook for an established business that protects existing customers and rankings.',
  dek: 'A new business can rebrand freely. An established one risks confusing customers and losing SEO rankings built over years — this is the sequence that protects both.',
  sections: [
    {
      heading: "Step 1: audit what's actually inconsistent today",
      body: [
        [
          'Run a real ',
          {
            text: 'brand consistency audit across touchpoints',
            href: '/prompts/branding/brand-consistency-audit-across-touchpoints',
          },
          ' before deciding what to change — a rebrand should fix a genuine, identified inconsistency or positioning gap, not change things that were already working.',
        ],
      ],
    },
    {
      heading: 'Step 2: re-confirm positioning against real competitors',
      body: [
        [
          'Build a ',
          {
            text: 'competitor positioning map',
            href: '/prompts/branding/competitor-positioning-map',
          },
          " — an established business's competitive landscape has usually shifted since the original brand was set, and the rebrand should respond to the current landscape, not the one from years ago.",
        ],
      ],
    },
    {
      heading: 'Step 3: the SEO redirect plan, if the domain or URLs change',
      body: [
        [
          'If a rebrand includes a new domain or restructured URLs, plan a ',
          {
            text: 'migration redirect map',
            href: '/prompts/seo-geo/seo-geo-migration-redirect-map',
          },
          ' before launch — this is the single most common way an established business loses years of accumulated SEO rankings during a rebrand, and it is entirely avoidable with proper planning.',
        ],
      ],
    },
    {
      heading: 'Step 4: tell existing customers what changed, and why',
      body: [
        [
          'Write a genuine ',
          {
            text: 'brand story for an About page update',
            href: '/prompts/branding/brand-story-for-about-page',
          },
          ' explaining the rebrand honestly — existing customers who already trust the business deserve a real explanation, not a silent visual swap that leaves them wondering if they are still dealing with the same company.',
        ],
      ],
    },
    {
      heading: 'Step 5: the new visual identity, checked for accessibility',
      body: [
        [
          'Update the ',
          { text: 'colour palette', href: '/design/color-palette-generator' },
          ' with WCAG contrast checked automatically and refresh the ',
          { text: 'favicon', href: '/dev/favicon-generator' },
          ' to match — small, easy-to-miss details that make the new identity feel finished rather than half-updated.',
        ],
      ],
    },
    {
      heading: 'What this playbook cannot fully de-risk',
      body: [
        [
          'Even a well-planned rebrand carries real risk with an established customer base — some customer confusion during transition is close to unavoidable, and this playbook minimises rather than eliminates it. A rebrand of this scale genuinely benefits from experienced strategic guidance, not just a checklist.',
        ],
      ],
    },
    {
      heading: 'Get real guidance before a high-stakes rebrand',
      body: [
        [
          'Planning a rebrand for an established business with real customers at stake? ',
          {
            text: "That's exactly the kind of high-stakes work Scult's branding team specialises in",
            href: SERVICE.href,
            external: true,
          },
          ', or ',
          { text: 'book a meeting', href: BOOK_MEETING, external: true },
          ' before you commit.',
        ],
      ],
    },
  ],
  relatedTools: ['color-palette-generator', 'favicon-generator'],
  relatedPrompts: [
    'brand-consistency-audit-across-touchpoints',
    'competitor-positioning-map',
  ],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-15',
  readingMinutes: 12,
}
