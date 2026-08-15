import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'hardening-a-no-code-prototype-playbook'
const SERVICE = resolveServiceLink('custom-software', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'Turning a Lovable or Bolt.new Prototype Into a Real Product',
  h1: 'It works in the demo. Here is the checklist before real users touch it.',
  targetKeyword: 'harden no-code prototype for production',
  description:
    'A real checklist for hardening a Lovable, Bolt.new or Replit Agent prototype before production — data model review, auth, load testing, deployment — before real users depend on it.',
  dek: 'A generated prototype that works in a demo and a prototype ready for real users are different bars. This is the specific checklist for closing that gap.',
  sections: [
    {
      heading: 'Step 1: review the data model against real requirements',
      body: [
        [
          'Whatever generator produced the prototype — ',
          {
            text: 'a multi-tenant SaaS build',
            href: '/prompts/no-code-apps/lovable-multitenant-saas-rls-billing',
          },
          ' or an internal ops dashboard against an existing schema — review the actual data model against production requirements: does row-level security genuinely isolate tenants, does the schema handle the real scale of data expected, and does it match how the business actually needs to query it later.',
        ],
      ],
    },
    {
      heading: 'Step 2: a genuine security review of auth',
      body: [
        [
          'If auth was generated quickly, treat it as a hypothesis, not a fact — ',
          {
            text: 'adding auth to an existing app',
            href: '/prompts/no-code-apps/replit-agent-add-auth-to-existing-app',
          },
          ' is a real security surface, and it deserves a real review before any actual customer data touches it, not an assumption that it works because nobody has tried to break it.',
        ],
      ],
    },
    {
      heading: 'Step 3: real load, not one person clicking through it',
      body: [
        [
          'A prototype tested by its own builder clicking through it once tells you nothing about concurrent real usage. Genuine load testing — even a basic one — surfaces problems a demo never would.',
        ],
      ],
    },
    {
      heading: 'Step 4: a real deployment and backup process',
      body: [
        [
          "Does the app exist only inside the generator's own hosting, or is there a real, independent deployment and backup process? ",
          {
            text: 'A clean GitHub export handoff',
            href: '/prompts/no-code-apps/bolt-new-github-export-handoff',
          },
          ' is the first step toward genuine independence from any single tool.',
        ],
      ],
    },
    {
      heading: 'Step 5: someone who can actually debug it',
      body: [
        [
          "Can anyone on the team read and debug the generated code when something breaks in production, or does the app only exist as a black box that worked until it didn't? This is often the single most overlooked gap.",
        ],
      ],
    },
    {
      heading: 'What to do with the checklist results',
      body: [
        [
          'Most of these come back uncertain rather than clearly wrong — that uncertainty is the actual signal that a real review is worth doing before more users depend on the prototype, not necessarily a rebuild from scratch.',
        ],
      ],
    },
    {
      heading: 'Get a real review before you scale',
      body: [
        [
          'This exact review is what ',
          { text: "Scult's software team does", href: SERVICE.href, external: true },
          ' — reviewing what already works and fixing specific gaps, not starting over. ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          ' and bring the prototype.',
        ],
      ],
    },
  ],
  relatedTools: ['json-formatter', 'ai-visibility-checker'],
  relatedPrompts: [
    'lovable-multitenant-saas-rls-billing',
    'replit-agent-add-auth-to-existing-app',
  ],
  serviceTarget: 'custom-software',
  updatedAt: '2026-08-15',
  readingMinutes: 11,
}
