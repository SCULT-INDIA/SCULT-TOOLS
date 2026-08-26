/**
 * The AI Visibility Checker's PDF report, as an actual `@react-pdf/renderer`
 * document tree rather than an HTML string handed to the browser's print
 * engine.
 *
 * Why this exists instead of the earlier HTML-in-a-new-tab approach: that
 * version required the visitor to manually Ctrl+P / "Save as PDF" from a
 * second tab, and the browser's own print-pagination heuristics produced
 * ugly orphaned section headings with a blank run of page underneath them.
 * `@react-pdf/renderer` renders directly to a real PDF document client-side
 * — `pdf(<AiVisibilityPdfDocument .../>).toBlob()` — so the download button
 * can save a finished .pdf file in one click, with pagination this file
 * controls explicitly (`wrap={false}` groups a heading with its first row
 * so nothing is ever orphaned) rather than inheriting from print CSS.
 *
 * Fonts are deliberately the 14 standard PDF fonts (Helvetica/Times/
 * Courier) rather than the site's own Fraunces/Cabin — react-pdf has to
 * fetch and embed any custom font file itself, which is one more network
 * dependency between "click" and "file saved"; the standard fonts always
 * embed instantly with zero risk of a failed fetch breaking the download.
 * Glyphs outside the standard WinAnsi encoding (checkmarks, arrows, emoji)
 * are avoided for the same reason — status is drawn as a small coloured
 * View (a real vector shape, not a font glyph), never a symbol character.
 */

import { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { parentLink } from '@/lib/site'
import {
  CHECK_WEIGHT,
  type CheckResult,
  type CheckStatus,
  formatBytes,
  REPORT_CATEGORIES,
  type VisibilityReport,
} from './logic'

// Through parentLink() so the report's booking link carries the same
// utm_source/campaign attribution as every other parent-site CTA — a PDF
// link is clicked outside the browser, so nothing tracks the click itself,
// but the UTMs still attribute the visit when they land on scult.in.
const SCULT_BOOKING_URL = parentLink('/#book-meeting', 'ai-visibility-checker-pdf')
const SCULT_PHONE = '7007288376'
const SCULT_EMAIL = 'connect@scult.in'
const SCULT_MARK_SRC = '/brand/scult-mark.png'

const COLOR = {
  violet900: '#16018e',
  violet700: '#4b20de',
  tileLavender: '#dcd9f5',
  cream: '#fcfbf3',
  white: '#ffffff',
  ink: '#161616',
  inkMuted: '#333333',
  inkSubtle: '#6b7280',
  lineGrey: '#e6e6e6',
  green: '#16a34a',
  amber: '#b45309',
  red: '#be123c',
} as const

function statusColor(status: CheckStatus): string {
  if (status === 'pass') return COLOR.green
  if (status === 'warn') return COLOR.amber
  return COLOR.red
}

function statusWord(status: CheckStatus): string {
  if (status === 'pass') return 'DONE'
  if (status === 'warn') return 'CHECK'
  return 'FIX'
}

function scoreColor(score: number): string {
  if (score >= 80) return COLOR.green
  if (score >= 50) return COLOR.amber
  return COLOR.violet900
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 46,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: COLOR.ink,
    backgroundColor: COLOR.cream,
  },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 30,
    right: 30,
    fontSize: 7.5,
    color: COLOR.inkSubtle,
    textAlign: 'center',
  },

  // Banner
  bannerWrap: {
    backgroundColor: COLOR.violet900,
    borderRadius: 10,
    marginBottom: 18,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
  },
  bannerLeft: { flexDirection: 'column', maxWidth: '68%' },
  bannerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  bannerMark: { width: 16, height: 16, borderRadius: 8 },
  bannerEyebrow: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#c4b5fd',
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontFamily: 'Times-Bold',
    color: COLOR.white,
    marginBottom: 10,
  },
  bannerIdentityRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bannerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  bannerHostname: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: COLOR.white },
  bannerUrl: { fontSize: 8, color: '#c4b5fd', fontFamily: 'Courier' },
  bannerDate: { fontSize: 8, color: '#c4b5fd', marginTop: 10 },
  scoreBadge: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLOR.white,
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
  },
  scoreNumber: { fontSize: 26, fontFamily: 'Times-Bold', color: COLOR.white },
  scoreOutOf: { fontSize: 8, color: '#e9d5ff', marginTop: -2 },
  scoreBand: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLOR.white,
    marginTop: 6,
  },

  // Sections
  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    color: COLOR.violet900,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: COLOR.tileLavender,
  },

  // Generic table primitives
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.75,
    borderBottomColor: COLOR.lineGrey,
  },
  cell: { padding: 6, justifyContent: 'center' },
  cellLabel: { backgroundColor: COLOR.tileLavender },
  cellLabelText: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: COLOR.violet700 },
  cellText: { fontSize: 8.5, color: COLOR.ink },
  headerRow: { flexDirection: 'row', backgroundColor: COLOR.violet700 },
  headerText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLOR.white },

  // Checklist rows
  categoryRow: {
    flexDirection: 'row',
    backgroundColor: COLOR.violet900,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  categoryLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLOR.white },
  categoryWeight: { fontSize: 8, color: '#c4b5fd', marginLeft: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusDotOutline: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.2,
    backgroundColor: 'transparent',
  },
  checkLabel: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: COLOR.ink,
    marginBottom: 2,
  },
  checkFinding: { fontSize: 8, color: COLOR.inkMuted, lineHeight: 1.35 },
  checkFix: { fontSize: 8, color: COLOR.ink, lineHeight: 1.35, marginTop: 2 },
  statusWordText: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', letterSpacing: 0.3 },

  // Bot matrix
  botName: { fontSize: 8, fontFamily: 'Courier-Bold', color: COLOR.ink },
  botCompany: { fontSize: 8, color: COLOR.ink },
  botRule: { fontSize: 7, fontFamily: 'Courier', color: COLOR.inkSubtle },

  // CTA page
  ctaBanner: {
    backgroundColor: COLOR.violet900,
    borderRadius: 10,
    padding: 26,
    alignItems: 'center',
  },
  ctaEyebrow: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#c4b5fd',
    letterSpacing: 1,
    marginBottom: 8,
  },
  ctaTitle: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    color: COLOR.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaBody: {
    fontSize: 9.5,
    color: '#e9d5ff',
    textAlign: 'center',
    lineHeight: 1.5,
    marginBottom: 16,
    maxWidth: 380,
  },
  ctaButton: {
    backgroundColor: COLOR.white,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  ctaButtonText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLOR.violet900 },
  ctaContactRow: { flexDirection: 'row', gap: 16, marginTop: 14 },
  ctaContactText: { fontSize: 9, color: COLOR.white },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, gap: 10 },
  serviceCard: {
    width: '48%',
    borderWidth: 0.75,
    borderColor: COLOR.lineGrey,
    borderRadius: 6,
    padding: 10,
  },
  serviceTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLOR.violet900,
    marginBottom: 4,
  },
  serviceBody: { fontSize: 8, color: COLOR.inkSubtle, lineHeight: 1.35 },
  footerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLOR.ink,
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
  },
  footerStripName: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#c4b5fd' },
  footerStripSub: { fontSize: 7.5, color: '#9ca3af' },
})

function StatusDot({ status }: { status: CheckStatus }) {
  const color = statusColor(status)
  if (status === 'pass')
    return <View style={[styles.statusDot, { backgroundColor: color }]} />
  return <View style={[styles.statusDotOutline, { borderColor: color }]} />
}

function CategoryHeaderRow({ label, weight }: { label: string; weight: number }) {
  return (
    <View style={styles.categoryRow}>
      <Text style={styles.categoryLabel}>{label}</Text>
      {weight > 0 ? <Text style={styles.categoryWeight}>({weight} pts)</Text> : null}
    </View>
  )
}

function CheckRow({ check }: { check: CheckResult }) {
  const color = statusColor(check.status)
  return (
    <View wrap={false} style={styles.row}>
      <View style={[styles.cell, { width: 26, alignItems: 'center' }]}>
        <StatusDot status={check.status} />
      </View>
      <View style={[styles.cell, { flex: 1 }]}>
        <Text style={styles.checkLabel}>{check.label}</Text>
        <Text style={styles.checkFinding}>{check.finding}</Text>
        {check.status !== 'pass' ? (
          <Text style={styles.checkFix}>Fix: {check.fix}</Text>
        ) : null}
      </View>
      <View style={[styles.cell, { width: 46, alignItems: 'flex-start' }]}>
        <Text style={[styles.statusWordText, { color }]}>{statusWord(check.status)}</Text>
      </View>
    </View>
  )
}

function ChecklistSection({ report }: { report: VisibilityReport }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AI Visibility Checklist</Text>
      <View wrap={false} style={styles.headerRow}>
        <View style={[styles.cell, { width: 26 }]} />
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.headerText}>Check</Text>
        </View>
        <View style={[styles.cell, { width: 46 }]}>
          <Text style={styles.headerText}>Status</Text>
        </View>
      </View>
      {REPORT_CATEGORIES.map((category) => {
        const checks = category.checkIds
          .map((id) => report.checks.find((c) => c.id === id))
          .filter((c): c is CheckResult => c !== undefined)
        const weight = category.checkIds.reduce((sum, id) => sum + CHECK_WEIGHT[id], 0)
        const [first, ...rest] = checks
        return (
          <View key={category.id}>
            <View wrap={false}>
              <CategoryHeaderRow label={category.label} weight={weight} />
              {first ? <CheckRow check={first} /> : null}
            </View>
            {rest.map((check) => (
              <CheckRow key={check.id} check={check} />
            ))}
          </View>
        )
      })}
    </View>
  )
}

function BotMatrixSection({ report }: { report: VisibilityReport }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AI Crawler Access Matrix</Text>
      <View wrap={false}>
        <View wrap={false} style={styles.headerRow}>
          <View style={[styles.cell, { width: 92 }]}>
            <Text style={styles.headerText}>Crawler</Text>
          </View>
          <View style={[styles.cell, { width: 70 }]}>
            <Text style={styles.headerText}>Company</Text>
          </View>
          <View style={[styles.cell, { width: 58 }]}>
            <Text style={styles.headerText}>Verdict</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text style={styles.headerText}>Rule that decided</Text>
          </View>
        </View>
        {report.bots[0] ? <BotRow bot={report.bots[0]} /> : null}
      </View>
      {report.bots.slice(1).map((bot) => (
        <BotRow key={bot.name} bot={bot} />
      ))}
    </View>
  )
}

function BotRow({ bot }: { bot: VisibilityReport['bots'][number] }) {
  return (
    <View wrap={false} style={styles.row}>
      <View style={[styles.cell, { width: 92 }]}>
        <Text style={styles.botName}>{bot.name}</Text>
      </View>
      <View style={[styles.cell, { width: 70 }]}>
        <Text style={styles.botCompany}>{bot.company}</Text>
      </View>
      <View
        style={[
          styles.cell,
          { width: 58, flexDirection: 'row', alignItems: 'center', gap: 4 },
        ]}
      >
        <StatusDot status={bot.allowed ? 'pass' : 'fail'} />
        <Text
          style={{
            fontSize: 8,
            fontFamily: 'Helvetica-Bold',
            color: bot.allowed ? COLOR.green : COLOR.red,
          }}
        >
          {bot.allowed ? 'Allowed' : 'Blocked'}
        </Text>
      </View>
      <View style={[styles.cell, { flex: 1 }]}>
        <Text style={styles.botRule}>
          {bot.matchedRule !== undefined
            ? `${bot.matchedRule} (${bot.source === 'specific' ? 'bot-specific group' : 'User-agent: * group'})`
            : bot.source === 'default'
              ? 'No group — allowed by default'
              : 'No matching rule'}
        </Text>
      </View>
    </View>
  )
}

function ActionPlanSection({ report }: { report: VisibilityReport }) {
  const outstanding = report.checks
    .filter((c) => c.scored && c.status !== 'pass')
    .slice()
    .sort((a, b) => CHECK_WEIGHT[b.id] - CHECK_WEIGHT[a.id])

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Prioritised Action Plan</Text>
      {outstanding.length === 0 ? (
        <View
          style={[
            styles.cell,
            { borderWidth: 0.75, borderColor: COLOR.lineGrey, borderRadius: 4 },
          ]}
        >
          <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLOR.green }}>
            Nothing to fix — every scored check passes.
          </Text>
        </View>
      ) : (
        outstanding.map((check, i) => (
          <View key={check.id} wrap={false} style={styles.row}>
            <View style={[styles.cell, { width: 22, alignItems: 'center' }]}>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: 'Helvetica-Bold',
                  color: COLOR.violet700,
                }}
              >
                {i + 1}
              </Text>
            </View>
            <View style={[styles.cell, { flex: 1 }]}>
              <Text style={styles.checkLabel}>{check.label}</Text>
              <Text style={styles.checkFinding}>{check.fix}</Text>
            </View>
            <View style={[styles.cell, { width: 52, alignItems: 'flex-start' }]}>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: 'Helvetica-Bold',
                  color: COLOR.violet700,
                }}
              >
                +{CHECK_WEIGHT[check.id]} pts
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  )
}

function OverviewSection({
  report,
  generatedAt,
}: {
  report: VisibilityReport
  generatedAt: string
}) {
  const bandColor = scoreColor(report.score)
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Report Overview</Text>
      <View
        wrap={false}
        style={{
          borderWidth: 0.75,
          borderColor: COLOR.lineGrey,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <View style={styles.row}>
          <View style={[styles.cell, styles.cellLabel, { width: 90 }]}>
            <Text style={styles.cellLabelText}>Website</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text style={[styles.cellText, { fontFamily: 'Courier' }]}>{report.url}</Text>
          </View>
          <View style={[styles.cell, styles.cellLabel, { width: 60 }]}>
            <Text style={styles.cellLabelText}>Score</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text
              style={[
                styles.cellText,
                { fontFamily: 'Helvetica-Bold', color: bandColor },
              ]}
            >
              {report.score}/100 — {report.band}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.cell, styles.cellLabel, { width: 90 }]}>
            <Text style={styles.cellLabelText}>Checked on</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text style={styles.cellText}>{generatedAt}</Text>
          </View>
          <View style={[styles.cell, styles.cellLabel, { width: 60 }]}>
            <Text style={styles.cellLabelText}>Crawlers</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text style={styles.cellText}>
              {report.allowedBotCount} of {report.bots.length} allowed
            </Text>
          </View>
        </View>
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={[styles.cell, styles.cellLabel, { width: 90 }]}>
            <Text style={styles.cellLabelText}>Contact{'\n'}Scult India</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text style={styles.cellText}>
              {SCULT_PHONE} · {SCULT_EMAIL}
            </Text>
            <Link src={SCULT_BOOKING_URL} style={{ marginTop: 3 }}>
              <Text
                style={{
                  fontSize: 8.5,
                  fontFamily: 'Helvetica-Bold',
                  color: COLOR.violet700,
                }}
              >
                Book a free AI readiness call
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  )
}

function InsightsSection({ report }: { report: VisibilityReport }) {
  const insights = report.pageInsights
  const titleTone =
    insights.title === undefined
      ? COLOR.red
      : insights.titleLength <= 60
        ? COLOR.green
        : COLOR.amber
  const descTone =
    insights.metaDescription === undefined
      ? COLOR.red
      : insights.metaDescriptionLength <= 160
        ? COLOR.green
        : COLOR.amber

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Website Insights</Text>
      <View
        wrap={false}
        style={{
          borderWidth: 0.75,
          borderColor: COLOR.lineGrey,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <View style={styles.row}>
          <View style={[styles.cell, styles.cellLabel, { width: 90 }]}>
            <Text style={styles.cellLabelText}>Title tag</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text style={[styles.cellText, { color: titleTone }]}>
              {insights.title ?? 'No <title> tag found.'}
            </Text>
            <Text style={{ fontSize: 7.5, color: COLOR.inkSubtle, marginTop: 2 }}>
              {insights.titleLength} chars, ideal 30-60
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.cell, styles.cellLabel, { width: 90 }]}>
            <Text style={styles.cellLabelText}>Meta description</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text style={[styles.cellText, { color: descTone }]}>
              {insights.metaDescription ?? 'No meta description found.'}
            </Text>
            <Text style={{ fontSize: 7.5, color: COLOR.inkSubtle, marginTop: 2 }}>
              {insights.metaDescriptionLength} chars, ideal 70-160
            </Text>
          </View>
        </View>
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={[styles.cell, styles.cellLabel, { width: 90 }]}>
            <Text style={styles.cellLabelText}>Content</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text style={styles.cellText}>
              {insights.wordCount} words - {insights.h1Count} h1 - {insights.h2Count} h2 -{' '}
              {insights.altTextCoveragePct}% alt-text
            </Text>
          </View>
          <View style={[styles.cell, styles.cellLabel, { width: 90 }]}>
            <Text style={styles.cellLabelText}>Performance</Text>
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text style={styles.cellText}>
              {insights.homepageResponseMs !== undefined
                ? `${insights.homepageResponseMs} ms`
                : '—'}
              {'  ·  '}
              {insights.homepageSizeBytes !== undefined
                ? formatBytes(insights.homepageSizeBytes)
                : '—'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const SERVICES: readonly { title: string; body: string }[] = [
  {
    title: 'AI/GEO Optimisation',
    body: 'Structured data, llms.txt, robots.txt audits and AI crawler access — every fix in this report, done properly.',
  },
  {
    title: 'SEO & Technical Audit',
    body: 'Technical SEO, Core Web Vitals and schema markup — ranking in traditional search and AI answer engines alike.',
  },
  {
    title: 'Performance & Speed',
    body: 'Core Web Vitals and page-speed work — faster sites get cited more by AI engines.',
  },
  {
    title: 'Content for AI Citation',
    body: 'Author authority and structured Q&A content designed to be cited in ChatGPT, Perplexity, Claude and Gemini.',
  },
]

function ClosingCtaPage({ report }: { report: VisibilityReport }) {
  return (
    <View style={styles.ctaBanner}>
      <Text style={styles.ctaEyebrow}>SCULT INDIA — AI-FIRST DIGITAL AGENCY</Text>
      <Text style={styles.ctaTitle}>Want us to implement this report for you?</Text>
      <Text style={styles.ctaBody}>
        Your AI visibility score is {report.score}/100.{' '}
        {report.score < 80
          ? 'We implement every fix above — structured data, robots.txt, llms.txt, and content strategy — typically in one sprint.'
          : 'A strong result. We help teams like yours maintain and build on it as AI search keeps changing.'}
      </Text>
      <Link src={SCULT_BOOKING_URL} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Book a free AI readiness call</Text>
      </Link>
      <View style={styles.ctaContactRow}>
        <Link src={`tel:${SCULT_PHONE}`}>
          <Text style={styles.ctaContactText}>{SCULT_PHONE}</Text>
        </Link>
        <Link src={`mailto:${SCULT_EMAIL}`}>
          <Text style={styles.ctaContactText}>{SCULT_EMAIL}</Text>
        </Link>
      </View>
    </View>
  )
}

function ServicesGrid() {
  return (
    <View style={styles.serviceGrid}>
      {SERVICES.map((service) => (
        <View key={service.title} style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.serviceBody}>{service.body}</Text>
        </View>
      ))}
    </View>
  )
}

function FooterStrip() {
  return (
    <View style={styles.footerStrip}>
      <View>
        <Text style={styles.footerStripName}>Scult India</Text>
        <Text style={styles.footerStripSub}>
          AI-first digital agency - Noida, Delhi NCR
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text
          style={[
            styles.footerStripSub,
            { color: '#e9d5ff', fontFamily: 'Helvetica-Bold' },
          ]}
        >
          scult.in
        </Text>
        <Text style={styles.footerStripSub}>Report generated by tools.scult.in</Text>
      </View>
    </View>
  )
}

function Banner({
  report,
  generatedAt,
}: {
  report: VisibilityReport
  generatedAt: string
}) {
  const heroImage = report.pageInsights.heroImageUrl
  let hostname = report.url
  try {
    hostname = new URL(report.url).hostname
  } catch {
    // Keep the full URL as the fallback "hostname".
  }
  return (
    <View style={styles.bannerWrap}>
      <View style={styles.bannerContent}>
        <View style={styles.bannerLeft}>
          <View style={styles.bannerBrandRow}>
            <Image src={SCULT_MARK_SRC} style={styles.bannerMark} />
            <Text style={styles.bannerEyebrow}>
              SCULT INDIA · AI-FIRST DIGITAL AGENCY
            </Text>
          </View>
          <Text style={styles.bannerTitle}>AI Visibility Report</Text>
          {/* Identity row — a small, contained circular avatar (never
              stretched across the whole banner; a site whose og:image is
              just its own logo blown up read as a smeared watermark) plus
              hostname and full URL. */}
          <View style={styles.bannerIdentityRow}>
            {heroImage !== undefined ? (
              <Image src={heroImage} style={styles.bannerAvatar} />
            ) : null}
            <View>
              <Text style={styles.bannerHostname}>{hostname}</Text>
              <Text style={styles.bannerUrl}>{report.url}</Text>
            </View>
          </View>
          <Text style={styles.bannerDate}>Generated {generatedAt}</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreNumber}>{report.score}</Text>
          <Text style={styles.scoreOutOf}>/ 100</Text>
          <Text style={styles.scoreBand}>{report.band}</Text>
        </View>
      </View>
    </View>
  )
}

/**
 * The full report as one auto-paginating `<Page>` — react-pdf flows content
 * onto additional same-size pages automatically when it overflows, so
 * nothing here manually decides where a page break falls except the
 * `wrap={false}` groupings above (which only ever keep a small unit
 * together, never force a break).
 */
export function AiVisibilityPdfDocument({
  report,
  generatedAt,
}: {
  report: VisibilityReport
  generatedAt: string
}) {
  return (
    <Document
      title={`AI Visibility Report — ${report.url}`}
      author="Scult India"
      creator="Scult Tools"
    >
      <Page size="A4" style={styles.page}>
        <Banner report={report} generatedAt={generatedAt} />
        <OverviewSection report={report} generatedAt={generatedAt} />
        <InsightsSection report={report} />
        <ChecklistSection report={report} />
        <BotMatrixSection report={report} />
        <ActionPlanSection report={report} />
        <View style={styles.section} break>
          <ClosingCtaPage report={report} />
          <ServicesGrid />
          <FooterStrip />
        </View>
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Scult Tools AI Visibility Report · tools.scult.in · Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  )
}
