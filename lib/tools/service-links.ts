import { parentLink } from '@/lib/site'

/**
 * Maps a `Tool.serviceTarget` value to the real scult.in service page it
 * should point at, plus the label a "how it works" page's closing CTA shows.
 *
 * `serviceTarget` strings were written independently of scult.in's actual
 * URL slugs (e.g. 'branding-agency' vs. the live '/services/ui-ux-design-
 * branding'), so this is a deliberate translation table, not a 1:1 slug
 * reuse — checked against the live site rather than guessed.
 */
export const SERVICE_PAGES: Record<string, { path: string; label: string }> = {
  'web-development': { path: '/services/web-development', label: 'web development' },
  'custom-software': {
    path: '/services/custom-software-development',
    label: 'custom software',
  },
  'branding-agency': {
    path: '/services/ui-ux-design-branding',
    label: 'branding & design',
  },
  'seo-companies-for-small-business': {
    path: '/services/local-seo-services',
    label: 'SEO',
  },
  'google-ads-management': {
    path: '/services/google-ads-management',
    label: 'Google Ads management',
  },
  'ai-consulting': {
    path: '/services/ai-agents-automation',
    label: 'AI agents & automation',
  },
}

/**
 * Resolves a tool's `serviceTarget` to a real, tagged scult.in URL and a
 * short label for a CTA ("Explore {label}"). Falls back to the services
 * overview anchor for tools with no `serviceTarget` (mostly the pure
 * developer utilities — JSON Formatter, QR Code Generator, Favicon
 * Generator, Word Counter — where no single service is the obvious match).
 */
export function resolveServiceLink(
  serviceTarget: string | undefined,
  toolSlug: string,
): { href: string; label: string } {
  const entry = serviceTarget ? SERVICE_PAGES[serviceTarget] : undefined
  if (entry) {
    return { href: parentLink(entry.path, toolSlug), label: entry.label }
  }
  return { href: parentLink('/#services', toolSlug), label: 'what Scult builds' }
}
