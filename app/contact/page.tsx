import type { Metadata } from 'next'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { parentLink, SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'How to reach Scult Tools — report a bug or a wrong calculation, ask about client work, or find us on LinkedIn, Instagram and X.',
  alternates: { canonical: '/contact' },
}

const CONTACT_EMAIL = 'connect@scult.in'

/**
 * The real social profiles, matching `components/layout/Footer.tsx`'s
 * `SOCIALS` array exactly. That constant is not exported, so this is a
 * deliberate duplicate rather than a shared import — keep the two in sync by
 * hand if a handle ever changes.
 */
const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/scult-india/' },
  { label: 'Instagram', href: 'https://www.instagram.com/scult.in/' },
  { label: 'X', href: 'https://x.com/scult_india' },
] as const

const LINK_CLASS =
  'text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600'

/**
 * A contact page with no contact form.
 *
 * This site has no backend to receive an arbitrary form submission, and a
 * form that goes nowhere is worse than no form — so every path here is a
 * real mailto: link or a real outbound link, not a text box that quietly
 * does nothing.
 */
export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          Get in touch
        </h1>
        <p className="mt-6 text-[18px] text-ink-muted leading-8 md:text-lead">
          There is no contact form on this page. This site has nowhere to send a form
          submission, so instead of one that goes nowhere, here is exactly where each kind
          of message actually needs to go.
        </p>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Found a bug, or a wrong calculation?
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Every tool on this site states its own limitations on its own page, because a
            tool that pretends to be more certain than it is will eventually mislead
            someone. If you have still found a calculation we got wrong, a broken tool, or
            a correction of any kind, we would genuinely rather hear it than not. Email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Looking for client work?
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            These tools are free and this page is not where {SITE.parentName} pitches paid
            work. If you need a website, an app, custom software or an AI agent built,
            book a meeting on{' '}
            <a href={parentLink('/#book-meeting', 'contact-page')} className={LINK_CLASS}>
              scult.in
            </a>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Elsewhere online
          </h2>
          <ul className="mt-4 space-y-3 text-[16px] text-ink-muted leading-7">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={LINK_CLASS}
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  )
}
