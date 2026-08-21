const fs = require('fs')

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const files = fs.readdirSync('content-engine/05-drafts').filter((f) => f.endsWith('.md')).sort()
const requiredSections = [
  'Table of contents', 'Practical examples', 'Data and evidence', 'Real-world use cases',
  'Common mistakes', 'Best practices', 'Frequently asked questions', 'Key takeaways', 'Sources',
]

const report = []
for (const f of files) {
  const num = parseInt(f.match(/\d+/)[0], 10)
  const content = fs.readFileSync('content-engine/05-drafts/' + f, 'utf8')
  const wordCount = content.split(/\s+/).filter(Boolean).length

  const missingSections = requiredSections.filter((s) => !content.includes('## ' + s))

  // Line-based FAQ extraction: walk lines between the FAQ H2 and the next H2.
  const lines = content.split('\n')
  let inFaq = false
  const faqLines = []
  for (const line of lines) {
    if (/^##\s+Frequently asked questions/i.test(line)) { inFaq = true; continue }
    if (inFaq && /^##\s+/.test(line)) break
    if (inFaq) faqLines.push(line)
  }
  const questions = []
  for (const line of faqLines) {
    const m = line.match(/^\**\s*(\d+)\.\s*\**\s*(.+?)\?/)
    if (m) questions.push(m[2].trim().toLowerCase())
  }
  const questionCount = questions.length
  const uniqueQuestions = new Set(questions)
  const dupCount = questionCount - uniqueQuestions.size

  const fmMatch = content.match(/primary_keyword:\s*"?([^"\n]+)"?/)
  const primaryKeyword = fmMatch ? fmMatch[1].trim().toLowerCase() : null
  let keywordDensity = null
  if (primaryKeyword) {
    const kwRegex = new RegExp(escapeRegExp(primaryKeyword), 'gi')
    const kwCount = (content.match(kwRegex) || []).length
    keywordDensity = Number(((kwCount / wordCount) * 100).toFixed(2))
  }

  const sourcesMatch = content.match(/## Sources([\s\S]*)$/)
  const sourceLines = sourcesMatch ? sourcesMatch[1].split('\n').filter((l) => /https?:\/\//.test(l)) : []

  report.push({ file: f, num, wordCount, missingSections, questionCount, dupCount, primaryKeyword, keywordDensity, sourceCount: sourceLines.length })
}

fs.writeFileSync('content-engine/06-verification/mechanical-check-report.json', JSON.stringify(report, null, 2))

const flagged = report.filter((r) => r.missingSections.length > 0 || r.questionCount < 45 || r.dupCount > 0 || r.wordCount < 3000 || (r.keywordDensity && r.keywordDensity > 2.5) || r.sourceCount < 3)
console.log('Total articles:', report.length)
console.log('Flagged for review:', flagged.length)
flagged.forEach((r) => console.log(` - ${r.file}: words=${r.wordCount} Q=${r.questionCount}(dup:${r.dupCount}) kwDensity=${r.keywordDensity}% sources=${r.sourceCount} missing=[${r.missingSections.join(',')}]`))

const qCounts = report.map((r) => r.questionCount)
console.log('question count distribution: min=' + Math.min(...qCounts), 'max=' + Math.max(...qCounts))
