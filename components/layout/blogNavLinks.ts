/**
 * Shared data for the "Blogs" nav dropdown — the desktop menu
 * (`BlogsMenu.tsx`) and the mobile drawer (`MobileDrawer.tsx`) render the
 * same set from here, same reasoning as `resourceLinks.ts`.
 *
 * Case Studies has no equivalent on tools.scult.in (a free-tools product,
 * not an agency portfolio) — it lives on scult.in itself, linked out
 * honestly rather than faked as a local page.
 */
export interface BlogNavLink {
  readonly href: string
  readonly label: string
  readonly blurb: string
  readonly icon: string
  readonly external?: boolean
}

export const BLOG_NAV_LINKS: readonly BlogNavLink[] = [
  {
    href: '/blog',
    label: 'Blog',
    blurb: 'Long-form posts on tools, prompts & services',
    icon: 'NotebookPen',
  },
  {
    href: 'https://scult.in/case-studies',
    label: 'Case Studies',
    blurb: 'Selected work, brand to launch',
    icon: 'Briefcase',
    external: true,
  },
  {
    href: '/blog?pillar=playbook',
    label: 'Playbooks',
    blurb: 'Step-by-step plans, not just advice',
    icon: 'ClipboardCheck',
  },
]
