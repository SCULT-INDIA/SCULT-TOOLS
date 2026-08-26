import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd, JsonLd } from '@/lib/seo/jsonld'
import { absoluteUrl, SITE } from '@/lib/site'
import { TOOLS } from '@/lib/tools/registry'

const TITLE = 'Compliance'
const DESCRIPTION =
  "How Scult Tools maps to India's DPDP Act, the IT Rules, GDPR and CCPA — grounded in what the site actually collects, not a boilerplate compliance template."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/compliance' },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/compliance'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const CONTACT_EMAIL = 'connect@scult.in'

const LINK_CLASS =
  'text-[var(--color-violet-accent-text,var(--color-violet-700))] underline decoration-1 underline-offset-4 hover:text-violet-600'

const EXTERNAL_LINK_CLASS = `${LINK_CLASS} break-words`

/**
 * Every claim on this page maps to something checkable elsewhere on the
 * site — the `/privacy` and `/security` pages, or `next.config.ts` — or is
 * qualified with the specific legal test that would decide it (DPDP's
 * phased effective dates, GDPR's targeting criterion, CCPA's revenue/volume
 * thresholds). It deliberately does NOT say "fully compliant with every law
 * in the world": that specific phrase is unverifiable, and a false or
 * overbroad compliance claim is treated by regulators as worse than making
 * no claim at all. This is a mapping of real practice to real law, not a
 * certificate — see "What this page is not" at the bottom.
 *
 * Last reviewed: 8 August 2026. The DPDP Act's remaining provisions are
 * being phased in through 13 May 2027 (see the India section) — this page
 * needs a re-read against whatever is newly in force well before that date.
 */
export default function CompliancePage() {
  const clientSideCount = TOOLS.filter((t) => t.runtime === 'client').length

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Compliance', path: '/compliance' },
        ])}
      />

      <article className="container-site max-w-[52rem] pt-10 pb-16">
        <p className="eyebrow">Compliance</p>
        <h1 className="mt-3 text-[36px] leading-[1.05] tracking-[-1px] md:text-[48px]">
          How this site maps to data protection law
        </h1>
        <p className="mt-6 text-[18px] text-ink-muted leading-8 md:text-lead">
          Most "we are compliant" pages are a list of law names with a green tick next to
          each one. This page is the opposite: it names the specific law, what it actually
          requires, and the specific thing {SITE.parentName} does that answers that
          requirement — for India's DPDP Act, the older IT Rules it is replacing, the EU's
          GDPR, and California's CCPA. Where a law simply does not apply to a free tools
          site of this size, it says that plainly instead of claiming coverage anyway.
        </p>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            The short version: there is very little data to protect
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Every privacy and data-protection law in every section below is a set of rules
            about what an organisation may do with personal data it collects. The single
            biggest thing this site does about all of them at once is architectural, not
            legal: {clientSideCount} of {TOOLS.length} tools process your files, text and
            numbers entirely inside your own browser tab. That data is never transmitted
            to us, so there is nothing for a data-protection law to regulate on our end —
            we simply never receive it. The full, tool-by-tool breakdown of what does and
            does not touch a network is on the{' '}
            <Link href="/privacy" className={LINK_CLASS}>
              privacy page
            </Link>
            . There are no accounts, no passwords and no payment details collected
            anywhere on the site, which removes an entire category of obligation (breach
            notification for stored credentials, for example) that most of these laws
            spend significant text on.
          </p>
          <p className="mt-4 text-[16px] text-ink-muted leading-7">
            What is left, after that: anonymous analytics (Google Analytics 4) and masked
            session replay (Microsoft Clarity), both of which load only after you interact
            with the page and are described in full — including Clarity's strict masking
            mode, which replaces on-page text and anything you type with placeholder
            blocks before it is ever sent — on the privacy page. Every section below is
            about that remaining, genuinely small surface.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            India — the Digital Personal Data Protection Act, 2023
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            {SITE.parentName} is based in Noida, Delhi NCR, so India's data protection law
            is the one that actually governs this site, not a foreign law borrowed for
            appearances.
          </p>
          <p className="mt-4 text-[16px] text-ink-muted leading-7">
            The Digital Personal Data Protection Act, 2023 ("DPDP Act") and its
            implementing{' '}
            <a
              href="https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf"
              className={EXTERNAL_LINK_CLASS}
            >
              Digital Personal Data Protection Rules, 2025
            </a>{' '}
            were notified by India's Ministry of Electronics and Information Technology on
            13–14 November 2025 (see the{' '}
            <a
              href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190655"
              className={EXTERNAL_LINK_CLASS}
            >
              official PIB notification
            </a>
            ). It is being brought into force in phases rather than all at once: the
            procedural provisions took effect immediately in November 2025, and the
            substantive obligations on data fiduciaries — consent, notice, and the data
            principal rights described below — are scheduled to be fully in force by{' '}
            <strong className="text-ink">13 May 2027</strong>. We are stating that
            timeline plainly rather than implying the Act is already fully in force,
            because it is not — but the practices below are ones we already follow, ahead
            of that deadline rather than because of it.
          </p>

          <h3 className="mt-6 text-[19px] font-semibold text-ink">
            What the Act requires, and what we do about it
          </h3>
          <ul className="mt-4 space-y-3 text-[16px] text-ink-muted leading-7">
            <li>
              <strong className="text-ink">
                Clear notice of what is collected and why.
              </strong>{' '}
              The{' '}
              <Link href="/privacy" className={LINK_CLASS}>
                privacy page
              </Link>{' '}
              lists exactly what is collected — analytics, masked session replay, one
              localStorage flag — and why, in plain language rather than legal
              boilerplate.
            </li>
            <li>
              <strong className="text-ink">Data minimisation.</strong> We do not ask for
              data we do not need to operate a tool. No tool on this site requires an
              account, an email address, or any personal identifier to produce a result.
            </li>
            <li>
              <strong className="text-ink">A published grievance contact.</strong> The Act
              requires every data fiduciary to publish contact details for a grievance
              officer and resolve a complaint within a reasonable window. Ours is{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
                {CONTACT_EMAIL}
              </a>
              , the same address used for security and accessibility reports on this site
              — see "Contact for a data protection concern" below for our specific
              commitment on response time.
            </li>
            <li>
              <strong className="text-ink">No sale of personal data.</strong> We do not
              sell, rent or trade any data collected through this site to any third party,
              under any circumstance.
            </li>
            <li>
              <strong className="text-ink">Reasonable security safeguards.</strong>{' '}
              Detailed on the{' '}
              <Link href="/security" className={LINK_CLASS}>
                security page
              </Link>{' '}
              — SSRF protection on the two tools that call a server, rate limiting on
              every API route, and the response headers set on every page.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            India — the older IT Rules, still partly in force
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Before the DPDP Act, India's main data-protection framework was Section 43A of
            the{' '}
            <a
              href="https://www.meity.gov.in/content/information-technology-act-2000"
              className={EXTERNAL_LINK_CLASS}
            >
              Information Technology Act, 2000
            </a>{' '}
            and the Reasonable Security Practices and Sensitive Personal Data or
            Information Rules, 2011 ("SPDI Rules") made under it. Those SPDI Rules remain
            technically in force today and are due to be repealed and folded into the DPDP
            Act on the same 13 May 2027 date above — so, for now, both frameworks apply in
            parallel. The SPDI Rules' definition of "sensitive personal data" — passwords,
            financial information, health records, biometrics — is a useful checklist in
            its own right: this site collects none of it. There are no passwords because
            there are no accounts, no financial information is collected (the invoice
            generator computes entirely in your browser and nothing you type in it is ever
            sent to us), and no health or biometric data is requested by any tool.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            The EU &amp; UK — GDPR
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            The{' '}
            <a href="https://gdpr-info.eu/art-3-gdpr/" className={EXTERNAL_LINK_CLASS}>
              GDPR's territorial-scope rule (Article 3)
            </a>{' '}
            applies to an organisation outside the EU only if it specifically targets EU
            users — offering goods or services to them, or monitoring their behaviour —
            not merely because a website happens to be reachable from Europe. We do not
            price in euros, do not run EU-specific marketing, and do not operate any
            feature aimed at EU visitors in particular, so we are not asserting GDPR
            controller status here.
          </p>
          <p className="mt-4 text-[16px] text-ink-muted leading-7">
            That said, an EU visitor can and does use this site, and the practices that
            matter to GDPR are the same ones described above regardless of who is asking:
            data minimisation by default, masked session replay, no sale of personal data,
            and a clear, working contact point for a data concern. If you are visiting
            from the EU or UK and have a specific concern, the same{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
              {CONTACT_EMAIL}
            </a>{' '}
            address reaches us.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            California — CCPA / CPRA
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            The California Consumer Privacy Act, as amended by the CPRA, applies to a
            for-profit business only above specific thresholds: roughly $26.6 million in
            annual gross revenue, or deriving over half of annual revenue from selling
            personal information, or processing 100,000 or more California residents'
            records a year — see the{' '}
            <a href="https://oag.ca.gov/privacy/ccpa" className={EXTERNAL_LINK_CLASS}>
              California Attorney General's CCPA page
            </a>{' '}
            for the current figures. Stated plainly: a free tools site of this size and
            reach is very unlikely to meet any of those thresholds, and we are not
            claiming to be a "business" as CCPA specifically defines the term.
          </p>
          <p className="mt-4 text-[16px] text-ink-muted leading-7">
            Threshold aside, the one commitment CCPA visitors most often look for is easy
            to make honestly, because it is already true: we do not sell or share personal
            information with any third party, so there is nothing to opt out of.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Accessibility — WCAG 2.2 AA
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Digital accessibility is a legal requirement in a growing number of
            jurisdictions — the EU's{' '}
            <a
              href="https://ec.europa.eu/social/main.jsp?catId=1202"
              className={EXTERNAL_LINK_CLASS}
            >
              European Accessibility Act
            </a>{' '}
            and the ADA in the United States both point to the same underlying standard,
            the Web Content Accessibility Guidelines. We build every page and every tool
            against WCAG 2.2 Level AA, and unlike most of this page, that one is not a
            legal test with an exemption threshold — it is a specific, checkable
            engineering target, detailed in full on the{' '}
            <Link href="/accessibility" className={LINK_CLASS}>
              accessibility page
            </Link>
            , including the one thing we are explicit about not having done: a third-party
            audit.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Security practices behind all of the above
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Every framework above eventually asks the same underlying question — are
            "reasonable security safeguards" in place. The specific, checkable answer is
            on the{' '}
            <Link href="/security" className={LINK_CLASS}>
              security page
            </Link>
            : SSRF protection on the two tools that call a server, rate limiting on every
            API route, and the four response headers set site-wide in{' '}
            <code>next.config.ts</code>. It also states clearly what we do not have — no
            SOC 2 or ISO 27001 certification, no penetration testing, no bug bounty — for
            the same reason this page does: an unverified certification claim is worse
            than an honest gap.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            Contact for a data protection concern
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            Email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
              {CONTACT_EMAIL}
            </a>{' '}
            with what data you are asking about and what you would like done — accessed,
            corrected, or deleted from wherever it might be held (in practice: an
            analytics record, since there is rarely anything else to find). We aim to
            acknowledge and resolve a genuine data protection request within 7 days of
            receiving it.
          </p>
          <div className="mt-6">
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn-brutal btn-brutal-sm">
              EMAIL A DATA PROTECTION REQUEST
            </a>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-[26px] tracking-[-0.5px] md:text-[30px]">
            What this page is not
          </h2>
          <p className="mt-3 text-[16px] text-ink-muted leading-7">
            This is a plain-language mapping of real practice to real law, written and
            maintained by the team that builds this site — not a legal opinion, not a
            certification issued by any regulator or auditor, and not a substitute for a
            qualified lawyer's advice if you are relying on this page to make your own
            compliance decision. Laws named here — especially the DPDP Act's phased
            timeline — will keep changing between now and 2027; this page will be updated
            as they do, and the date at the top of its source reflects when it was last
            reviewed. If anything above reads as broader than what is actually true of the
            site, tell us at {CONTACT_EMAIL} and we will correct it.
          </p>
        </section>

        <p className="mt-12 text-[15px] text-ink-subtle leading-7">
          See also:{' '}
          <Link href="/privacy" className={LINK_CLASS}>
            Privacy
          </Link>
          ,{' '}
          <Link href="/security" className={LINK_CLASS}>
            Security
          </Link>
          ,{' '}
          <Link href="/accessibility" className={LINK_CLASS}>
            Accessibility
          </Link>{' '}
          and{' '}
          <Link href="/terms" className={LINK_CLASS}>
            Terms
          </Link>
          .
        </p>
      </article>
    </>
  )
}
