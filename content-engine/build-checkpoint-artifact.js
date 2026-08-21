const fs = require('fs')

const candidates = JSON.parse(fs.readFileSync('content-engine/01-research/candidates.json', 'utf8'))
const clusterById = {}
candidates.forEach((c) => { clusterById[c.candidate_id] = c.cluster })

const results = JSON.parse(fs.readFileSync('content-engine/01-research/research-results-full.json', 'utf8'))
const accepted = results.filter((r) => r.status === 'accepted').sort((a, b) => (b.scores?.total || 0) - (a.scores?.total || 0))
const top100 = accepted.slice(0, 100)
const dropped = accepted.slice(100)
const rejected = results.filter((r) => r.status === 'rejected')

const evidenceCounts = { strong: 0, moderate: 0, weak: 0 }
top100.forEach((r) => { evidenceCounts[r.evidence_strength] = (evidenceCounts[r.evidence_strength] || 0) + 1 })

const totalQuestions = top100.reduce((a, r) => a + (r.questions?.length || 0), 0)
const totalSources = top100.reduce((a, r) => a + (r.sources?.length || 0), 0)

const byPillar = {}
for (const r of top100) {
  const p = clusterById[r.candidate_id] || 'Uncategorized'
  ;(byPillar[p] = byPillar[p] || []).push(r)
}
const pillars = Object.keys(byPillar).sort((a, b) => byPillar[b].length - byPillar[a].length)

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function evidenceChip(level) {
  return `<span class="chip chip-${level}">${level}</span>`
}

const pillarBars = pillars.map((p) => {
  const items = byPillar[p]
  const pct = Math.round((items.length / 100) * 100)
  return `<div class="pillar-row">
    <span class="pillar-name">${esc(p)}</span>
    <div class="pillar-track"><div class="pillar-fill" style="width:${pct}%"></div></div>
    <span class="pillar-count">${items.length}</span>
  </div>`
}).join('\n')

const tableRows = top100.map((r, i) => {
  const pillar = clusterById[r.candidate_id] || ''
  return `<tr>
    <td class="num">${i + 1}</td>
    <td class="mono id">${esc(r.candidate_id)}</td>
    <td class="topic">${esc(r.topic)}</td>
    <td class="pillar-cell">${esc(pillar)}</td>
    <td class="mono num score">${r.scores?.total ?? ''}</td>
    <td>${evidenceChip(r.evidence_strength)}</td>
    <td class="mono num">${(r.sources || []).length}</td>
    <td class="mono num">${(r.questions || []).length}</td>
  </tr>`
}).join('\n')

const droppedList = dropped.map((r) => `<li><span class="mono">${esc(r.candidate_id)}</span> — ${esc(r.topic)} <span class="mono dim">(${r.scores.total})</span></li>`).join('\n')

const rej = rejected[0]
const rejQuestionsHtml = (rej.questions || []).map((q) => `<div class="rej-q"><p class="rej-q-text">${esc(q.question)}</p><p class="rej-q-answer">${esc(q.answer_summary)}</p></div>`).join('\n')

const html = `<title>Research Checkpoint</title>
<style>
:root {
  --paper: #faf8f4;
  --paper-raised: #ffffff;
  --ink: #1c1730;
  --ink-muted: #5c5570;
  --ink-subtle: #8b84a0;
  --line: #e3dfea;
  --line-strong: #cbc4dd;
  --violet-50: #f4effe;
  --violet-100: #ebe6fe;
  --violet-600: #631aff;
  --violet-700: #4b20de;
  --violet-900: #16018e;
  --good: #1a8f5c;
  --good-bg: #e6f5ee;
  --warn: #a5720a;
  --warn-bg: #fbf0dc;
  --bad: #b3341f;
  --bad-bg: #fbe9e4;
  --shadow: 0 1px 3px 0 rgb(28 23 48 / 0.06), 0 1px 2px -1px rgb(28 23 48 / 0.06);
  --shadow-md: 0 4px 12px -2px rgb(28 23 48 / 0.08), 0 2px 6px -2px rgb(28 23 48 / 0.05);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper: #14101f;
    --paper-raised: #1c1730;
    --ink: #f1eef8;
    --ink-muted: #b5aecb;
    --ink-subtle: #837c99;
    --line: #322a48;
    --line-strong: #443a5e;
    --violet-50: #241a42;
    --violet-100: #2d2050;
    --violet-600: #9b7bff;
    --violet-700: #b39bff;
    --violet-900: #e6ddff;
    --good: #4fd39a;
    --good-bg: #163829;
    --warn: #e0b03e;
    --warn-bg: #3a2e10;
    --bad: #ff8b74;
    --bad-bg: #3a1d16;
    --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3);
    --shadow-md: 0 4px 12px -2px rgb(0 0 0 / 0.4);
  }
}
:root[data-theme="dark"] {
  --paper: #14101f;
  --paper-raised: #1c1730;
  --ink: #f1eef8;
  --ink-muted: #b5aecb;
  --ink-subtle: #837c99;
  --line: #322a48;
  --line-strong: #443a5e;
  --violet-50: #241a42;
  --violet-100: #2d2050;
  --violet-600: #9b7bff;
  --violet-700: #b39bff;
  --violet-900: #e6ddff;
  --good: #4fd39a;
  --good-bg: #163829;
  --warn: #e0b03e;
  --warn-bg: #3a2e10;
  --bad: #ff8b74;
  --bad-bg: #3a1d16;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: 'Cabin', -apple-system, sans-serif;
  font-size: 15px;
  line-height: 1.6;
}
.wrap { max-width: 1180px; margin: 0 auto; padding: 3rem 1.5rem 5rem; }
h1, h2, h3 { font-family: 'Fraunces', Georgia, serif; text-wrap: balance; margin: 0; }
.eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--violet-700);
  font-weight: 600;
}
header.top { margin-bottom: 2.5rem; }
header.top h1 { font-size: 34px; font-weight: 600; letter-spacing: -0.5px; margin-top: 0.5rem; color: var(--ink); }
header.top p.dek { color: var(--ink-muted); max-width: 62ch; margin-top: 0.75rem; font-size: 15.5px; }

.stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; margin-bottom: 2.5rem; }
.stat { background: var(--paper-raised); padding: 1.1rem 1.3rem; }
.stat .n { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; font-size: 26px; font-weight: 600; color: var(--ink); display: block; }
.stat .l { color: var(--ink-subtle); font-size: 12.5px; margin-top: 0.2rem; }

section { margin-bottom: 3rem; }
section > h2 { font-size: 20px; font-weight: 600; margin-bottom: 0.3rem; }
section > p.section-note { color: var(--ink-muted); font-size: 13.5px; margin: 0 0 1.25rem; max-width: 68ch; }

.pillar-row { display: grid; grid-template-columns: 220px 1fr 32px; align-items: center; gap: 0.9rem; padding: 0.4rem 0; }
.pillar-name { font-size: 13.5px; color: var(--ink-muted); }
.pillar-track { height: 8px; background: var(--violet-50); border-radius: 5px; overflow: hidden; }
.pillar-fill { height: 100%; background: var(--violet-600); border-radius: 5px; }
.pillar-count { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; font-size: 13px; color: var(--ink-subtle); text-align: right; }

.table-shell { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--paper-raised); box-shadow: var(--shadow); }
.table-scroll { overflow-x: auto; max-height: 640px; overflow-y: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
thead th {
  position: sticky; top: 0; background: var(--paper-raised);
  text-align: left; padding: 0.65rem 0.8rem; font-size: 11px; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--ink-subtle); border-bottom: 1px solid var(--line-strong);
  font-weight: 600; z-index: 1;
}
tbody td { padding: 0.55rem 0.8rem; border-bottom: 1px solid var(--line); vertical-align: top; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: var(--violet-50); }
td.num { text-align: right; font-variant-numeric: tabular-nums; }
td.mono { font-family: 'JetBrains Mono', monospace; }
td.id { color: var(--ink-subtle); font-size: 12px; }
td.topic { color: var(--ink); max-width: 420px; }
td.pillar-cell { color: var(--ink-muted); font-size: 12.5px; white-space: nowrap; }
td.score { font-weight: 600; }

.chip { display: inline-block; padding: 0.15rem 0.55rem; border-radius: 99px; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.chip-strong { background: var(--good-bg); color: var(--good); }
.chip-moderate { background: var(--warn-bg); color: var(--warn); }
.chip-weak { background: var(--bad-bg); color: var(--bad); }

.callout {
  border: 1px solid var(--line-strong); border-left: 4px solid var(--bad);
  background: var(--paper-raised); border-radius: 0 10px 10px 0; padding: 1.4rem 1.6rem; box-shadow: var(--shadow);
}
.callout h3 { font-size: 17px; margin-bottom: 0.5rem; }
.callout .rej-topic { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--ink-subtle); margin-bottom: 0.9rem; }
.callout .rej-reason { color: var(--ink-muted); font-size: 14px; line-height: 1.65; margin-bottom: 1.1rem; }
.rej-q { padding: 0.7rem 0; border-top: 1px solid var(--line); }
.rej-q-text { font-weight: 600; font-size: 13.5px; margin: 0 0 0.25rem; }
.rej-q-answer { color: var(--ink-muted); font-size: 13px; margin: 0; }

.dropped-box { border: 1px solid var(--line); border-radius: 10px; padding: 1.1rem 1.4rem; background: var(--paper-raised); }
.dropped-box ul { margin: 0; padding-left: 1.1rem; columns: 2; column-gap: 2rem; }
.dropped-box li { font-size: 13px; color: var(--ink-muted); margin-bottom: 0.4rem; break-inside: avoid; }
.dim { color: var(--ink-subtle); }

.next-steps { background: var(--violet-900); color: white; border-radius: 14px; padding: 1.8rem 2rem; }
:root:not([data-theme="dark"]) .next-steps { background: var(--violet-900); color: #fff; }
.next-steps h2 { color: #fff; }
.next-steps p { color: rgba(255,255,255,0.82); max-width: 62ch; }
.next-steps ol { color: rgba(255,255,255,0.92); padding-left: 1.3rem; }
.next-steps li { margin-bottom: 0.4rem; }

footer.meta { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--line); color: var(--ink-subtle); font-size: 12px; font-family: 'JetBrains Mono', monospace; }
</style>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Cabin:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap">

<div class="wrap">
  <header class="top">
    <span class="eyebrow">Content Engine — Phase 1 Checkpoint</span>
    <h1>100 topics, researched and scored</h1>
    <p class="dek">20 agents independently researched 111 candidate topics for tools.scult.in's new blog batch — real web evidence only, no invented statistics or sentiment. One topic was rejected outright for insufficient evidence; the strongest 100 by score are below, ready for the article-writing phase.</p>
  </header>

  <div class="stat-row">
    <div class="stat"><span class="n">100</span><span class="l">topics selected</span></div>
    <div class="stat"><span class="n">${evidenceCounts.strong}</span><span class="l">strong evidence</span></div>
    <div class="stat"><span class="n">${evidenceCounts.moderate}</span><span class="l">moderate evidence</span></div>
    <div class="stat"><span class="n">${evidenceCounts.weak}</span><span class="l">weak evidence</span></div>
    <div class="stat"><span class="n">${totalSources}</span><span class="l">sources cited</span></div>
    <div class="stat"><span class="n">${totalQuestions}</span><span class="l">seed questions found</span></div>
  </div>

  <section>
    <h2>Coverage by pillar</h2>
    <p class="section-note">Grounded in the site's real tool/prompt/service inventory — every pillar links back to something that actually exists on tools.scult.in.</p>
    ${pillarBars}
  </section>

  <section>
    <h2>The one rejection</h2>
    <p class="section-note">Exactly what the research standard is for: an agent found real, adjacent evidence but refused to stretch it into the topic as framed.</p>
    <div class="callout">
      <h3>${esc(rej.topic)}</h3>
      <p class="rej-topic">[${esc(rej.candidate_id)}] — score ${rej.scores.total}/100, evidence: ${rej.evidence_strength}</p>
      <p class="rej-reason">${esc(rej.rejection_reason)}</p>
      ${rejQuestionsHtml}
    </div>
  </section>

  <section>
    <h2>All 100 topics, ranked</h2>
    <p class="section-note">Sorted by total score (demand + intent + relevance + question density + search opportunity + AI-answer opportunity + tool-discovery opportunity + competitive gap + conversion potential + evidence quality, each 1-10).</p>
    <div class="table-shell">
      <div class="table-scroll">
        <table>
          <thead><tr><th>#</th><th>ID</th><th>Topic</th><th>Pillar</th><th>Score</th><th>Evidence</th><th>Sources</th><th>Questions</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </div>
  </section>

  <section>
    <h2>10 candidates dropped (below the top 100)</h2>
    <p class="section-note">Accepted by their research agent, but scored lowest of the 110 — buffer capacity, not failures.</p>
    <div class="dropped-box"><ul>${droppedList}</ul></div>
  </section>

  <div class="next-steps">
    <h2>What's next</h2>
    <p>This is the checkpoint before the much larger phase: writing and independently verifying ~100 &times; 4,500-word articles (roughly 450,000 words, plus 50 sourced questions each).</p>
    <ol>
      <li>Review the topic list and pillar balance above — swap or drop anything before it's locked in.</li>
      <li>If it looks right: proceed to article briefs, then 10 production agents (10 articles each) and 5 verification agents (20 articles each).</li>
      <li>Everything here is saved under <code>/content-engine/</code> in the repo for reference at every later phase.</li>
    </ol>
  </div>

  <footer class="meta">content-engine/01-research/research-master.csv · content-engine/02-topic-map/topical-authority-map.md · content-engine/01-research/topics/*.json</footer>
</div>
`

fs.writeFileSync('content-engine/checkpoint-artifact.html', html)
console.log('wrote checkpoint-artifact.html,', html.length, 'bytes')
