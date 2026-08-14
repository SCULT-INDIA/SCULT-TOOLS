import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { PROMPTS } from '@/lib/prompts/registry'
import { breadcrumbJsonLd, genericFaqJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl, parentLink, SITE } from '@/lib/site'
import { TOOLS } from '@/lib/tools/registry'

const TITLE = 'Frequently Asked Questions'
const DESCRIPTION =
  'Straight answers about Scult Tools: whether it is really free, which tools run in your browser, how AI assistants may use this site, and where to send requests.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/faq' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/faq'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const LINK_CLASS =
  'text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600'

/** One clickable substring inside an FAQ answer. `text` must appear verbatim in `a`. */
interface FaqLink {
  readonly text: string
  readonly href: string
  /** Internal app route → next/link. Anything else (mailto:, scult.in) → plain anchor. */
  readonly internal: boolean
}

interface Faq {
  readonly q: string
  readonly a: string
  readonly links?: readonly FaqLink[]
}

const clientSideCount = TOOLS.filter((t) => t.runsInBrowser).length

/**
 * Site-wide FAQ — not the per-tool FAQs, which already exist on each tool's own
 * page (the `faq` field on `Tool`). These are the questions about the site
 * itself: the business model, data handling, and how AI assistants may use it.
 *
 * This exact array is what renders on the page AND what `genericFaqJsonLd`
 * serializes into schema — `renderAnswer` below only wraps clickable substrings
 * of `a` in a `Link`/`a`, it never changes the text itself, so the visible copy
 * and the structured data can never drift apart.
 */
const FAQS: readonly Faq[] = [
  {
    q: 'Is Scult Tools really free?',
    a: 'Yes. Every tool and every prompt in the library is free to use, with no paywall anywhere on the site. There is no premium tier, no usage cap that suddenly asks for a card, and no result hidden behind a locked feature.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. Nothing on this site requires a sign-up, a login, or an email address. Open a tool, use it, and leave — there is no account system to skip.',
  },
  {
    q: 'Which tools run in my browser, and which use a server?',
    a: `${clientSideCount} of the ${TOOLS.length} tools on the site run entirely in your browser tab — your files and text never leave your device. The rest use a server only where the task genuinely needs one, such as measuring a live page's speed. The exact breakdown, tool by tool, is on the privacy page.`,
    links: [{ text: 'privacy page', href: '/privacy', internal: true }],
  },
  {
    q: 'How is Scult Tools related to Scult?',
    a: `${SITE.name} is built and maintained by Scult, an AI-first digital agency based in Noida, Delhi NCR. The tools started as internal utilities the delivery team needed and were published once they were built properly.`,
    links: [{ text: 'Scult', href: parentLink('/', 'faq'), internal: false }],
  },
  {
    q: 'How often are the tools updated?',
    a: 'Each tool carries a real last-reviewed date on its own page, so you can judge how current it is rather than take freshness on faith. Tools are revisited when the underlying standard, API, or formula they rely on changes.',
  },
  {
    q: 'Can I request a new tool or report a bug?',
    a: 'Yes. Email connect@scult.in with what you need or what looks wrong. Every tool also states its own limitations on its page, so if you spot a calculation that is off, that is the fastest way to get it fixed.',
    links: [
      { text: 'connect@scult.in', href: 'mailto:connect@scult.in', internal: false },
    ],
  },
  {
    q: 'Can AI assistants and answer engines use content from this site?',
    a: 'Yes, deliberately so. robots.txt explicitly allows the major AI crawlers — including GPTBot, ClaudeBot, PerplexityBot, and Google-Extended — rather than relying on the default wildcard allow. An llms.txt file is also published at /llms.txt specifically to help AI assistants and answer engines like ChatGPT, Claude, Perplexity, and Gemini understand what is on the site and cite it accurately.',
    links: [{ text: '/llms.txt', href: '/llms.txt', internal: true }],
  },
  {
    q: 'Is my data safe when I use a tool?',
    a: 'The tools that run in your browser never send your data anywhere — there is nothing to secure, because nothing leaves your device. For the small number of tools that do use a server, the privacy page states exactly what gets sent and why, tool by tool.',
    links: [{ text: 'privacy page', href: '/privacy', internal: true }],
  },
  {
    q: 'What is the difference between the tools and the prompt library?',
    a: `The tools are single-purpose utilities that produce a result — an invoice, a QR code, a schema snippet. The prompt library is a separate collection of ${PROMPTS.length} copy-paste prompts for ChatGPT, Claude, Cursor, Midjourney and other AI tools, each with an explanation of why it works and the tool version it was verified against.`,
    links: [{ text: 'prompt library', href: '/prompts', internal: true }],
  },
  {
    q: 'Where are the terms of service and the privacy policy?',
    a: 'The privacy page covers exactly what data each tool touches, and the terms page covers the legal terms of using the site. Both are linked in the footer of every page.',
    links: [
      { text: 'privacy page', href: '/privacy', internal: true },
      { text: 'terms page', href: '/terms', internal: true },
    ],
  },
]

/**
 * Splits `a` on each `links[].text` occurrence, in order, and wraps that
 * substring in a `Link`/`a`. Everything else passes through unchanged, so the
 * rendered text content is always exactly `a` — which is also what
 * `genericFaqJsonLd` puts in the FAQPage schema below.
 */
function renderAnswer(a: string, links?: readonly FaqLink[]): ReactNode {
  if (!links || links.length === 0) return a

  const nodes: ReactNode[] = []
  let rest = a
  let key = 0

  for (const link of links) {
    const idx = rest.indexOf(link.text)
    if (idx === -1) {
      // Should never happen — link text must be a literal substring of `a`.
      continue
    }
    if (idx > 0) nodes.push(rest.slice(0, idx))
    nodes.push(
      link.internal ? (
        <Link key={key++} href={link.href} className={LINK_CLASS}>
          {link.text}
        </Link>
      ) : (
        <a key={key++} href={link.href} className={LINK_CLASS}>
          {link.text}
        </a>
      ),
    )
    rest = rest.slice(idx + link.text.length)
  }

  nodes.push(rest)
  return nodes
}

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ])}
      />
      <JsonLd data={genericFaqJsonLd(FAQS)} />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">FAQ</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          Frequently asked questions
        </h1>
        <p className="mt-6 text-[18px] text-ink-muted leading-8 md:text-lead">
          Straight answers about how {SITE.name} works, what it costs, and what happens to
          your data. Tool-specific questions live on each tool&apos;s own page — these are
          the questions about the site itself.
        </p>

        {FAQS.map((item) => (
          <section key={item.q} className="mt-12">
            <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">{item.q}</h2>
            <p className="mt-3 text-[16px] text-ink-muted leading-7">
              {renderAnswer(item.a, item.links)}
            </p>
          </section>
        ))}
      </article>
    </>
  )
}
