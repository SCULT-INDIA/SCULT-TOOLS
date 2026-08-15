import { parentLink } from '@/lib/site'
import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'restaurant-digital-toolkit-playbook'
const SERVICE = resolveServiceLink('web-development', SLUG)
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: "A Small Restaurant's Digital Toolkit: QR Menu, UPI, Google Business",
  h1: 'The digital basics a small restaurant actually needs, free',
  targetKeyword: 'restaurant digital tools free india',
  description:
    'A QR code menu, UPI payment codes, a Google Business Profile prompt, and menu photography — the specific free tools a small restaurant needs, in one place.',
  dek: 'A small restaurant does not need a full digital transformation — it needs four specific things done well, all free, and this is exactly what they are.',
  sections: [
    {
      heading: 'The table menu: one QR code, update it anytime',
      body: [
        [
          'Generate a ',
          { text: 'static QR code', href: '/dev/qr-code-generator' },
          ' linking to a digital menu page — update the linked page any time the menu changes, without ever reprinting a single physical card.',
        ],
      ],
    },
    {
      heading: 'Payment: a UPI code that never expires',
      body: [
        [
          'A second ',
          {
            text: 'QR code encoding your UPI payment address',
            href: '/dev/qr-code-generator',
          },
          ' directly follows the real NPCI deep-link format — it opens correctly in any UPI-compliant payment app, with no dependency on a third-party redirect service that could stop working later.',
        ],
      ],
    },
    {
      heading: 'Local search: the Google Business Profile',
      body: [
        [
          'Optimize your ',
          {
            text: 'Google Business Profile',
            href: '/prompts/seo-geo/seo-geo-google-business-profile-optimization',
          },
          " to win the local 3-pack — this matters more for a restaurant's actual foot traffic than almost any other single marketing action.",
        ],
      ],
    },
    {
      heading: 'Menu photography, without a photo shoot',
      body: [
        [
          'Generate real ',
          {
            text: 'food and menu photography',
            href: '/prompts/nano-banana/nano-banana-food-menu-photography',
          },
          ' with Nano Banana rather than paying for a full photo shoot for every seasonal update.',
        ],
      ],
    },
    {
      heading: 'Guest WiFi, without shouting a password',
      body: [
        [
          'A ',
          { text: 'WiFi QR code', href: '/dev/qr-code-generator' },
          ' lets guests join your network by scanning, never seeing or typing the actual password.',
        ],
      ],
    },
    {
      heading: 'What this toolkit does not cover',
      body: [
        [
          'This is a genuinely complete starting toolkit for a single-location restaurant. A multi-location chain, an online ordering system, or a real booking platform needs actual custom development — ',
          {
            text: "the kind Scult's web development team builds",
            href: SERVICE.href,
            external: true,
          },
          '.',
        ],
      ],
    },
    {
      heading: 'Growing past a single location',
      body: [
        [
          'Expanding to a second location and need a real system behind it? ',
          { text: 'Book a meeting', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: ['qr-code-generator'],
  relatedPrompts: [
    'seo-geo-google-business-profile-optimization',
    'nano-banana-food-menu-photography',
  ],
  serviceTarget: 'web-development',
  updatedAt: '2026-08-15',
  readingMinutes: 10,
}
