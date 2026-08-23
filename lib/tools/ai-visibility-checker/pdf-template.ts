/**
 * PDF report generator for the AI Visibility Checker.
 *
 * Purpose
 *   Generates a self-contained HTML document that renders as a professional
 *   multi-page audit report when printed (File → Print → Save as PDF).
 *   The document is explicitly NOT a screenshot of the web tool UI — it is a
 *   purpose-built document with its own layout: cover page, score visualization,
 *   bot access matrix, detailed check cards, action plan, and a Scult India
 *   consultation CTA.
 *
 * Outputs  A complete HTML string (<!DOCTYPE html>…</html>) ready to be opened
 *          in a new browser window for printing. All styles are inlined; there
 *          are no external dependencies.
 * Failure  none — every value comes from the typed VisibilityReport contract.
 *
 * Design intent
 *   - A4 pages, 20mm margins, strict @page rules.
 *   - Professional typography (system-ui stack, no web fonts needed).
 *   - Violet (#5b21b6) brand accent matching the tools site.
 *   - Each logical section has explicit page-break control so the document
 *     never splits a check card mid-way through a page.
 *   - The CTA page is always the final page, with a booking link.
 */

import type { BotAccess, CheckResult, VisibilityReport } from './logic'

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function scoreColor(score: number): string {
  if (score >= 80) return '#16a34a' // green-600
  if (score >= 50) return '#d97706' // amber-600
  return '#7c3aed' // violet-600
}

function statusColor(status: string): string {
  if (status === 'pass') return '#16a34a'
  if (status === 'warn') return '#d97706'
  return '#dc2626'
}

function statusLabel(status: string): string {
  if (status === 'pass') return 'PASS'
  if (status === 'warn') return 'CHECK'
  return 'FIX'
}

function statusIcon(status: string): string {
  if (status === 'pass') return '✓'
  if (status === 'warn') return '⚠'
  return '✗'
}

function scoreSvg(score: number): string {
  const radius = 70
  const cx = 90
  const cy = 90
  const circumference = 2 * Math.PI * radius
  const filled = (score / 100) * circumference
  const gap = circumference - filled
  const color = scoreColor(score)

  return `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="12"/>
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="12"
      stroke-dasharray="${filled} ${gap}"
      stroke-dashoffset="${circumference / 4}"
      stroke-linecap="round"
      transform="rotate(-90 ${cx} ${cy})"/>
    <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-family="system-ui,sans-serif"
      font-size="36" font-weight="800" fill="${color}">${score}</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="system-ui,sans-serif"
      font-size="13" fill="#6b7280">/100</text>
  </svg>`
}

function botRows(bots: readonly BotAccess[]): string {
  return bots
    .map(
      (bot) => `
    <tr>
      <td style="padding:8px 10px;font-family:monospace;font-size:12px;color:#111827;border-bottom:1px solid #f3f4f6">${esc(bot.name)}</td>
      <td style="padding:8px 10px;font-size:12px;color:#374151;border-bottom:1px solid #f3f4f6">${esc(bot.company)}</td>
      <td style="padding:8px 10px;font-size:12px;border-bottom:1px solid #f3f4f6">
        <span style="display:inline-flex;align-items:center;gap:5px;font-weight:600;color:${bot.allowed ? '#16a34a' : '#dc2626'}">
          ${bot.allowed ? '✓ Allowed' : '✗ Blocked'}
        </span>
      </td>
      <td style="padding:8px 10px;font-size:11px;color:#6b7280;font-family:monospace;border-bottom:1px solid #f3f4f6">${esc(
        bot.matchedRule !== undefined
          ? `${bot.matchedRule} (${bot.source === 'specific' ? 'bot-specific group' : bot.source === 'wildcard' ? 'User-agent: * group' : 'default'})`
          : bot.source === 'default'
            ? 'No group — allowed by default'
            : 'No matching rule',
      )}</td>
    </tr>`,
    )
    .join('')
}

function checkCard(check: CheckResult, index: number): string {
  const color = statusColor(check.status)
  const icon = statusIcon(check.status)
  const label = statusLabel(check.status)
  return `
  <div style="break-inside:avoid;margin-bottom:16px;border:1.5px solid ${color}20;border-left:4px solid ${color};border-radius:8px;overflow:hidden;background:#fff">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:${color}08;border-bottom:1px solid ${color}15">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:${color};font-family:system-ui,sans-serif">${index + 1}</span>
        <span style="font-size:14px;font-weight:600;color:#111827;font-family:system-ui,sans-serif">${esc(check.label)}</span>
        ${check.scored ? '<span style="font-size:10px;font-weight:600;color:#7c3aed;background:#ede9fe;border-radius:4px;padding:2px 6px;font-family:system-ui,sans-serif">SCORED</span>' : '<span style="font-size:10px;color:#6b7280;background:#f3f4f6;border-radius:4px;padding:2px 6px;font-family:system-ui,sans-serif">INFORMATIONAL</span>'}
      </div>
      <span style="font-size:12px;font-weight:700;color:${color};display:flex;align-items:center;gap:4px;font-family:system-ui,sans-serif">
        ${icon} ${label}
      </span>
    </div>
    <div style="padding:12px 16px">
      <p style="font-size:12px;color:#374151;line-height:1.6;margin:0 0 8px;font-family:system-ui,sans-serif"><strong style="color:#111827">Finding:</strong> ${esc(check.finding)}</p>
      ${
        check.status !== 'pass'
          ? `<p style="font-size:12px;color:#374151;line-height:1.6;margin:0;font-family:system-ui,sans-serif"><strong style="color:#111827">Fix:</strong> ${esc(check.fix)}</p>`
          : ''
      }
    </div>
  </div>`
}

function actionPlanItems(checks: readonly CheckResult[]): string {
  const weights: Record<string, number> = {
    crawlers: 40,
    'structured-data': 20,
    basics: 20,
    'llms-txt': 10,
    sitemap: 10,
  }
  const outstanding = checks
    .filter((c) => c.scored && c.status !== 'pass')
    .slice()
    .sort((a, b) => (weights[b.id] ?? 0) - (weights[a.id] ?? 0))

  if (outstanding.length === 0) {
    return `<div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center">
      <p style="color:#16a34a;font-size:14px;font-weight:600;margin:0;font-family:system-ui,sans-serif">✓ Nothing to fix — all scored checks pass!</p>
    </div>`
  }

  return outstanding
    .map(
      (check, i) => `
    <div style="break-inside:avoid;display:flex;gap:14px;margin-bottom:14px;padding:14px;background:#fafafa;border:1px solid #e5e7eb;border-radius:8px">
      <div style="flex-shrink:0;width:32px;height:32px;background:#7c3aed;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:700;font-family:system-ui,sans-serif">${i + 1}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">
          <span style="font-size:13px;font-weight:600;color:#111827;font-family:system-ui,sans-serif">${esc(check.label)}</span>
          ${weights[check.id] !== undefined ? `<span style="font-size:11px;font-weight:600;color:#7c3aed;background:#ede9fe;border-radius:4px;padding:1px 5px;font-family:system-ui,sans-serif">+${weights[check.id]} pts potential</span>` : ''}
        </div>
        <p style="font-size:12px;color:#6b7280;line-height:1.5;margin:0;font-family:system-ui,sans-serif">${esc(check.fix)}</p>
      </div>
    </div>`,
    )
    .join('')
}

export function generatePdfHtml(report: VisibilityReport, generatedAt: string): string {
  const scoredPassed = report.checks.filter((c) => c.scored && c.status === 'pass').length
  const scoredTotal = report.checks.filter((c) => c.scored).length
  const informationalPassed = report.checks.filter((c) => !c.scored && c.status === 'pass').length
  const informationalTotal = report.checks.filter((c) => !c.scored).length
  const bandColor = scoreColor(report.score)
  const blockedCount = report.bots.length - report.allowedBotCount

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Visibility Report — ${esc(report.url)}</title>
<style>
  @page {
    size: A4;
    margin: 20mm 18mm 20mm 18mm;
    @bottom-center {
      content: "Scult Tools AI Visibility Report  ·  tools.scult.in  ·  Page " counter(page);
      font-size: 9px;
      color: #9ca3af;
      font-family: system-ui, sans-serif;
    }
    @top-right {
      content: "${esc(generatedAt)}";
      font-size: 9px;
      color: #9ca3af;
      font-family: system-ui, sans-serif;
    }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 13px;
    color: #111827;
    background: #fff;
    line-height: 1.5;
  }
  .page { page-break-after: always; min-height: 247mm; }
  .page:last-child { page-break-after: auto; }
  .no-break { break-inside: avoid; }
  h1 { font-size: 28px; font-weight: 800; line-height: 1.2; }
  h2 { font-size: 18px; font-weight: 700; line-height: 1.3; margin-bottom: 16px; color: #111827; border-bottom: 2px solid #ede9fe; padding-bottom: 8px; }
  h3 { font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #374151; }
  p { line-height: 1.6; color: #374151; }
  table { width: 100%; border-collapse: collapse; }
  th {
    background: #5b21b6;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 10px 10px;
    text-align: left;
  }
  th:first-child { border-radius: 6px 0 0 0; }
  th:last-child { border-radius: 0 6px 0 0; }
  tr:nth-child(even) td { background: #fafafa; }
  .chip {
    display: inline-block;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  @media print {
    .no-print { display: none !important; }
    .page { min-height: auto; }
  }
</style>
</head>
<body>

<!-- ═══════════════════════════════ PAGE 1 — COVER ═══════════════════════════════ -->
<div class="page" style="display:flex;flex-direction:column;justify-content:space-between">

  <!-- Header strip -->
  <div style="background:#5b21b6;border-radius:10px;padding:22px 28px;color:#fff;margin-bottom:32px">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div>
        <p style="font-size:11px;font-weight:600;letter-spacing:0.12em;color:#c4b5fd;text-transform:uppercase;margin-bottom:4px">Scult Tools</p>
        <p style="font-size:16px;font-weight:700;color:#fff">AI Visibility Checker</p>
      </div>
      <div style="text-align:right">
        <p style="font-size:10px;color:#c4b5fd">tools.scult.in</p>
        <p style="font-size:10px;color:#c4b5fd">${esc(generatedAt)}</p>
      </div>
    </div>
  </div>

  <!-- Title block -->
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px 0">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:#7c3aed;text-transform:uppercase;margin-bottom:16px">Audit Report</p>
    <h1 style="font-size:24px;color:#111827;word-break:break-all;margin-bottom:8px">AI Visibility Report</h1>
    <p style="font-size:14px;color:#6b7280;margin-bottom:32px;word-break:break-all">${esc(report.url)}</p>

    <!-- Score gauge -->
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
      ${scoreSvg(report.score)}
      <span style="display:inline-block;padding:6px 18px;border-radius:20px;font-size:13px;font-weight:700;color:${bandColor};background:${bandColor}18;border:1.5px solid ${bandColor}40">
        ${esc(report.band)}
      </span>
    </div>

    <!-- Key stats row -->
    <div style="display:flex;gap:20px;margin-top:32px">
      <div style="text-align:center;padding:14px 20px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;min-width:100px">
        <p style="font-size:26px;font-weight:800;color:#16a34a">${report.allowedBotCount}</p>
        <p style="font-size:11px;color:#6b7280">crawlers allowed</p>
      </div>
      <div style="text-align:center;padding:14px 20px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;min-width:100px">
        <p style="font-size:26px;font-weight:800;color:${blockedCount > 0 ? '#dc2626' : '#16a34a'}">${blockedCount}</p>
        <p style="font-size:11px;color:#6b7280">crawlers blocked</p>
      </div>
      <div style="text-align:center;padding:14px 20px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;min-width:100px">
        <p style="font-size:26px;font-weight:800;color:#7c3aed">${report.jsonLdTypes.length}</p>
        <p style="font-size:11px;color:#6b7280">schema types</p>
      </div>
      <div style="text-align:center;padding:14px 20px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;min-width:100px">
        <p style="font-size:26px;font-weight:800;color:#374151">${scoredPassed}/${scoredTotal}</p>
        <p style="font-size:11px;color:#6b7280">checks passed</p>
      </div>
    </div>
  </div>

  <!-- Footer strip -->
  <div style="border-top:2px solid #ede9fe;padding-top:16px;display:flex;justify-content:space-between;align-items:center">
    <p style="font-size:11px;color:#9ca3af">Generated by Scult Tools — tools.scult.in/geo/ai-visibility-checker</p>
    <p style="font-size:11px;color:#9ca3af">© Scult India — scult.in</p>
  </div>
</div>

<!-- ═══════════════════════════════ PAGE 2 — SUMMARY ═══════════════════════════════ -->
<div class="page">
  <h2>Executive Summary</h2>

  <!-- Score interpretation bar -->
  <div style="margin-bottom:24px;padding:16px;background:#fafafa;border:1px solid #e5e7eb;border-radius:8px" class="no-break">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
      <span style="font-size:13px;font-weight:600;color:#374151">Overall AI Visibility Score</span>
      <span style="font-size:22px;font-weight:800;color:${bandColor}">${report.score}/100</span>
    </div>
    <div style="background:#e5e7eb;border-radius:6px;height:12px;overflow:hidden">
      <div style="background:${bandColor};width:${report.score}%;height:100%;border-radius:6px;transition:width 0.3s"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:6px">
      <span style="font-size:10px;color:#9ca3af">0 — Mostly invisible</span>
      <span style="font-size:10px;color:#d97706">50 — Partially visible</span>
      <span style="font-size:10px;color:#16a34a">80+ — AI-visible</span>
    </div>
  </div>

  <!-- Check summary table -->
  <div class="no-break" style="margin-bottom:24px">
    <h3>Check Results Overview</h3>
    <table>
      <thead>
        <tr>
          <th>Check</th>
          <th>Status</th>
          <th>Type</th>
          <th>Key Finding</th>
        </tr>
      </thead>
      <tbody>
        ${report.checks
          .map(
            (check) => `
        <tr>
          <td style="padding:8px 10px;font-size:12px;font-weight:500;color:#111827;border-bottom:1px solid #f3f4f6">${esc(check.label)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #f3f4f6">
            <span style="font-size:11px;font-weight:700;color:${statusColor(check.status)}">${statusIcon(check.status)} ${statusLabel(check.status)}</span>
          </td>
          <td style="padding:8px 10px;border-bottom:1px solid #f3f4f6">
            <span style="font-size:10px;color:${check.scored ? '#7c3aed' : '#6b7280'};background:${check.scored ? '#ede9fe' : '#f3f4f6'};border-radius:4px;padding:2px 6px">${check.scored ? 'Scored' : 'Info'}</span>
          </td>
          <td style="padding:8px 10px;font-size:11px;color:#6b7280;border-bottom:1px solid #f3f4f6;max-width:200px">${esc(check.finding.slice(0, 120))}${check.finding.length > 120 ? '…' : ''}</td>
        </tr>`,
          )
          .join('')}
      </tbody>
    </table>
  </div>

  <!-- Structured data summary -->
  ${
    report.jsonLdTypes.length > 0
      ? `<div class="no-break" style="padding:14px;background:#f5f3ff;border:1px solid #ede9fe;border-radius:8px">
    <h3>Structured Data Types Found</h3>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${report.jsonLdTypes.map((t) => `<span style="display:inline-block;background:#ede9fe;color:#5b21b6;border-radius:4px;padding:3px 8px;font-size:11px;font-weight:600">${esc(t)}</span>`).join('')}
    </div>
  </div>`
      : `<div class="no-break" style="padding:14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px">
    <p style="color:#dc2626;font-size:12px;font-weight:600">No JSON-LD structured data found on the homepage.</p>
    <p style="color:#374151;font-size:12px;margin-top:4px">Add at least Organization or WebSite schema so AI engines know what your site is. Use the <a href="https://tools.scult.in/seo/schema-markup-generator" style="color:#7c3aed">Schema Markup Generator</a> to build it.</p>
  </div>`
  }
</div>

<!-- ═══════════════════════════════ PAGE 3 — BOT ACCESS MATRIX ═══════════════════════════════ -->
<div class="page">
  <h2>AI Crawler Access Matrix</h2>
  <p style="font-size:12px;color:#6b7280;margin-bottom:16px">
    Showing robots.txt verdicts for all ${report.bots.length} AI crawlers checked. Each row shows the exact rule that decided the outcome — the most important detail for debugging access issues.
  </p>

  <table style="margin-bottom:24px">
    <thead>
      <tr>
        <th style="width:22%">Crawler</th>
        <th style="width:15%">Company</th>
        <th style="width:13%">Verdict</th>
        <th>Rule that decided</th>
      </tr>
    </thead>
    <tbody>
      ${botRows(report.bots)}
    </tbody>
  </table>

  <!-- Bot access summary callout -->
  <div class="no-break" style="padding:14px;background:${report.allowedBotCount === report.bots.length ? '#f0fdf4' : blockedCount === report.bots.length ? '#fef2f2' : '#fffbeb'};border:1px solid ${report.allowedBotCount === report.bots.length ? '#bbf7d0' : blockedCount === report.bots.length ? '#fecaca' : '#fde68a'};border-radius:8px">
    <p style="font-size:12px;font-weight:600;color:${report.allowedBotCount === report.bots.length ? '#16a34a' : blockedCount === report.bots.length ? '#dc2626' : '#d97706'}">
      ${report.allowedBotCount === report.bots.length
        ? `✓ All ${report.bots.length} AI crawlers are allowed — full AI discoverability.`
        : blockedCount === report.bots.length
          ? `✗ All ${report.bots.length} AI crawlers are blocked — no AI engine can index this site.`
          : `⚠ ${report.allowedBotCount} of ${report.bots.length} AI crawlers allowed. ${blockedCount} blocked crawler(s) cannot index this site.`}
    </p>
    ${
      blockedCount > 0
        ? `<p style="font-size:11px;color:#374151;margin-top:6px">Review your robots.txt file for Disallow rules under User-agent: * or bot-specific groups. Blocking AI crawlers prevents your content from appearing in AI-powered search answers.</p>`
        : ''
    }
  </div>
</div>

<!-- ═══════════════════════════════ PAGE 4+ — DETAILED CHECKS ═══════════════════════════════ -->
<div class="page">
  <h2>Detailed Check Results</h2>
  <p style="font-size:12px;color:#6b7280;margin-bottom:20px">
    ${report.checks.filter((c) => c.scored).length} scored checks (${report.score}/100 pts) and ${informationalTotal} informational checks. Scored checks directly affect your AI visibility score; informational checks highlight improvement opportunities.
  </p>

  <h3 style="color:#5b21b6;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px">Scored Checks</h3>
  ${report.checks
    .filter((c) => c.scored)
    .map((c, i) => checkCard(c, i))
    .join('')}

  <h3 style="color:#374151;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:24px 0 12px">Informational Checks (${informationalPassed}/${informationalTotal} pass)</h3>
  ${report.checks
    .filter((c) => !c.scored)
    .map((c, i) => checkCard(c, i))
    .join('')}
</div>

<!-- ═══════════════════════════════ PAGE 5 — ACTION PLAN ═══════════════════════════════ -->
<div class="page">
  <h2>Prioritised Action Plan</h2>
  <p style="font-size:12px;color:#6b7280;margin-bottom:20px">
    Items ranked by score impact — fixing the top items first maximises your AI visibility score gain. Each fix is estimated to take under 1 hour for a developer with site access.
  </p>

  ${actionPlanItems(report.checks)}

  <!-- Quick wins summary -->
  <div class="no-break" style="margin-top:24px;padding:16px;background:#f5f3ff;border:1px solid #ede9fe;border-radius:8px">
    <h3 style="color:#5b21b6;margin-bottom:10px">Quick Wins (30 minutes or less)</h3>
    <ul style="list-style:none;display:flex;flex-direction:column;gap:6px">
      ${[
        { check: report.checks.find((c) => c.id === 'llms-txt'), label: 'Publish /llms.txt', time: '10 min' },
        { check: report.checks.find((c) => c.id === 'sitemap'), label: 'Declare sitemap in robots.txt', time: '5 min' },
        { check: report.checks.find((c) => c.id === 'mobile-viewport'), label: 'Add mobile viewport meta tag', time: '2 min' },
        { check: report.checks.find((c) => c.id === 'twitter-card'), label: 'Add Twitter Card meta tags', time: '10 min' },
        { check: report.checks.find((c) => c.id === 'author-signals'), label: 'Add author meta tag and og:site_name', time: '5 min' },
      ]
        .filter(({ check }) => check?.status !== 'pass')
        .map(
          ({ label, time }) => `
      <li style="display:flex;align-items:center;gap:8px;font-size:12px">
        <span style="background:#7c3aed;color:#fff;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700">${time}</span>
        <span style="color:#374151">${label}</span>
      </li>`,
        )
        .join('') || '<li style="font-size:12px;color:#16a34a">✓ All quick wins are complete!</li>'}
    </ul>
  </div>
</div>

<!-- ═══════════════════════════════ FINAL PAGE — CTA ═══════════════════════════════ -->
<div class="page" style="display:flex;flex-direction:column;justify-content:center">
  <!-- CTA header -->
  <div style="background:linear-gradient(135deg,#5b21b6 0%,#7c3aed 50%,#a78bfa 100%);border-radius:12px;padding:32px;color:#fff;margin-bottom:24px;text-align:center">
    <p style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:#c4b5fd;text-transform:uppercase;margin-bottom:10px">Scult India — AI-First Digital Agency</p>
    <h2 style="font-size:22px;font-weight:800;color:#fff;border:none;padding:0;margin-bottom:12px">
      Want to make your site AI-ready?
    </h2>
    <p style="font-size:14px;color:#e9d5ff;line-height:1.6;max-width:480px;margin:0 auto 20px">
      Your AI visibility score is ${report.score}/100. ${report.score < 80 ? `There ${report.score >= 50 ? 'are improvements' : 'are significant opportunities'} — our team can implement every fix in this report, typically in one sprint.` : `Strong result! We can help you maintain and build on this as AI search evolves.`}
    </p>
    <div style="display:inline-block;background:#fff;color:#5b21b6;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:0.02em">
      Book a Free AI Readiness Call → scult.in
    </div>
  </div>

  <!-- What Scult does -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
    <div style="padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px" class="no-break">
      <p style="font-size:13px;font-weight:700;color:#5b21b6;margin-bottom:8px">🤖 AI/GEO Optimisation</p>
      <p style="font-size:12px;color:#374151;line-height:1.5">Structured data implementation, llms.txt setup, robots.txt audits, and AI crawler access configuration — all the technical fixes from this report, done properly.</p>
    </div>
    <div style="padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px" class="no-break">
      <p style="font-size:13px;font-weight:700;color:#5b21b6;margin-bottom:8px">🔍 SEO & Technical Audit</p>
      <p style="font-size:12px;color:#374151;line-height:1.5">Full technical SEO, Core Web Vitals, site architecture, and schema markup — so you rank in both traditional search and AI-powered answer engines.</p>
    </div>
    <div style="padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px" class="no-break">
      <p style="font-size:13px;font-weight:700;color:#5b21b6;margin-bottom:8px">⚡ Performance & Speed</p>
      <p style="font-size:12px;color:#374151;line-height:1.5">Core Web Vitals, page speed optimisation, and mobile-first improvements — fast sites get cited more by AI engines.</p>
    </div>
    <div style="padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px" class="no-break">
      <p style="font-size:13px;font-weight:700;color:#5b21b6;margin-bottom:8px">✍️ Content for AI Citation</p>
      <p style="font-size:12px;color:#374151;line-height:1.5">Content strategy, author authority building, and structured Q&A content designed to be cited in ChatGPT, Perplexity, Claude, and Gemini answers.</p>
    </div>
  </div>

  <!-- Contact strip -->
  <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:#111827;border-radius:8px;color:#fff">
    <div>
      <p style="font-size:13px;font-weight:700;color:#a78bfa">Scult India</p>
      <p style="font-size:11px;color:#9ca3af">AI-first digital agency · Noida, Delhi NCR</p>
    </div>
    <div style="text-align:right">
      <p style="font-size:12px;color:#c4b5fd;font-weight:600">scult.in</p>
      <p style="font-size:11px;color:#9ca3af">tools.scult.in</p>
    </div>
  </div>
</div>

<!-- Print button (hidden when printed) -->
<div class="no-print" style="position:fixed;bottom:24px;right:24px;z-index:9999">
  <button onclick="window.print()" style="background:#5b21b6;color:#fff;border:none;border-radius:8px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(91,33,182,0.4);font-family:system-ui,sans-serif">
    Save as PDF →
  </button>
</div>

<script>
  // Auto-open print dialog after a short delay so the page can render
  window.addEventListener('load', function() {
    setTimeout(function() {
      document.querySelector('.no-print button').style.display = 'block';
    }, 300);
  });
</script>

</body>
</html>`
}
