const fs = require('fs')
const candidates = JSON.parse(fs.readFileSync('content-engine/01-research/candidates.json', 'utf8'))
const clusterById = {}
candidates.forEach((c) => { clusterById[c.candidate_id] = c.cluster })

const results = JSON.parse(fs.readFileSync('content-engine/01-research/research-results-full.json', 'utf8'))
const accepted = results
  .filter((r) => r.status === 'accepted')
  .sort((a, b) => (b.scores?.total || 0) - (a.scores?.total || 0))
  .slice(0, 100)

const byPillar = {}
for (const r of accepted) {
  const pillar = clusterById[r.candidate_id] || 'Uncategorized'
  ;(byPillar[pillar] = byPillar[pillar] || []).push(r)
}

let md = '# Topical Authority Map — 100 New Blog Topics (Content Engine)\n\n'
md += 'Pillar -> supporting articles -> the tools.scult.in tools/prompts/service each links to.\n\n'
for (const pillar of Object.keys(byPillar).sort()) {
  const items = byPillar[pillar]
  md += `## ${pillar} (${items.length} articles)\n\n`
  for (const r of items) {
    const links = [...(r.connects_to_tools || []), ...(r.connects_to_prompts || [])].join(', ') || '(none)'
    md += `- **[${r.candidate_id}]** ${r.topic}\n`
    md += `  - Target keyword: \`${r.target_keyword}\`\n`
    md += `  - Links to: ${links}${r.connects_to_service ? `, service: ${r.connects_to_service}` : ''}\n`
    md += `  - Score: ${r.scores?.total} (${r.evidence_strength} evidence)\n`
  }
  md += '\n'
}
fs.writeFileSync('content-engine/02-topic-map/topical-authority-map.md', md)
console.log('Pillars:', Object.keys(byPillar).length, '- wrote topical-authority-map.md')
