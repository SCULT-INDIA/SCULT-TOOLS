// Parses content-engine/05-drafts/article-NNN.md into an intermediate JSON
// representation matching lib/blog/types.ts's BlogPost shape, resolving every
// inline link against the real tool/prompt/guide/service registries.
'use strict'
const fs = require('node:fs')
const path = require('node:path')

const DRAFTS_DIR = path.join(__dirname, '05-drafts')
const REG = JSON.parse(fs.readFileSync(path.join(__dirname, 'registries-dump.json'), 'utf8'))

const TOOL_SET = new Set(REG.tools.map((t) => `${t.category}/${t.slug}`))
const TOOL_SLUGS = new Set(REG.tools.map((t) => t.slug))
const PROMPT_SET = new Set(REG.prompts.map((p) => `${p.category}/${p.slug}`))
const PROMPT_SLUGS = new Set(REG.prompts.map((p) => p.slug))
const GUIDE_SLUGS = new Set(REG.guides.map((g) => g.slug))
const EXISTING_BLOG_SLUGS = new Set(REG.blogSlugs)
const PROMPT_CATEGORIES = new Set(REG.prompts.map((p) => p.category))
const PROMPT_CATEGORY_FIX = {
  business: 'business-ops',
  marketing: 'email-marketing',
  development: 'ai-engineering',
}

// literal service slug (as written in drafts, absolute or relative) -> real SERVICE_PAGES key
const SERVICE_SLUG_FIX = {
  'ai-agents-automation': 'ai-consulting',
  'custom-software-development': 'custom-software',
  'custom-software': 'custom-software',
  'web-development': 'web-development',
  'local-seo-services': 'seo-companies-for-small-business',
  'local-seo': 'seo-companies-for-small-business',
  'ui-ux-design-branding': 'branding-agency',
  'seo-geo': 'seo-companies-for-small-business',
  'google-ads-management': 'google-ads-management',
  'branding-agency': 'branding-agency',
}

const SERVICE_KEYWORDS = [
  { key: 'ai-consulting', words: ['ai agent', 'ai visibility', 'geo', 'aeo', 'chatgpt', 'perplexity', 'llm', 'crawler', 'citation', 'ai search', 'automation', 'chatbot', 'ai-native', 'answer engine'] },
  { key: 'seo-companies-for-small-business', words: ['seo', 'ranking', 'backlink', 'keyword', 'organic search', 'search console'] },
  { key: 'web-development', words: ['website', 'web design', 'landing page', 'web performance', 'core web vitals', 'page speed', 'no-code', 'website builder'] },
  { key: 'custom-software', words: ['software', 'saas', 'internal tool', 'workflow automation', 'api integration', 'custom build', 'app development'] },
  { key: 'branding-agency', words: ['branding', 'logo', 'visual identity', 'brand identity', 'design system'] },
  { key: 'google-ads-management', words: ['google ads', 'ppc', 'paid ads', 'ad campaign', 'paid search'] },
]

function guessServiceKey(text) {
  const lower = text.toLowerCase()
  let best = null
  let bestScore = 0
  for (const { key, words } of SERVICE_KEYWORDS) {
    const score = words.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = key
    }
  }
  return best
}

const TOOL_KEYWORDS = [
  { slug: 'ai-visibility-checker', words: ['ai crawler', 'ai visibility', 'geo', 'aeo', 'chatgpt', 'perplexity', 'llms.txt', 'ai citation', 'answer engine', 'gptbot', 'claudebot'] },
  { slug: 'schema-markup-generator', words: ['structured data', 'schema markup', 'json-ld', 'rich result'] },
  { slug: 'faq-schema-generator', words: ['faq schema', 'faqpage', 'question and answer markup'] },
  { slug: 'website-speed-test', words: ['page speed', 'core web vitals', 'website speed', 'performance test', 'lighthouse'] },
  { slug: 'utm-builder', words: ['utm', 'campaign tracking', 'link tracking', 'attribution'] },
  { slug: 'marketing-roi-calculator', words: ['marketing roi', 'cac', 'ltv', 'return on ad spend', 'roas', 'unit economics'] },
  { slug: 'invoice-generator', words: ['invoice', 'invoicing', 'billing', 'freelancer paperwork', 'vat', 'sales tax'] },
  { slug: 'business-name-generator', words: ['business name', 'company name', 'brand name generator'] },
  { slug: 'slogan-generator', words: ['slogan', 'tagline'] },
  { slug: 'email-signature-generator', words: ['email signature'] },
  { slug: 'json-formatter', words: ['json formatter', 'json validator', 'api response'] },
  { slug: 'qr-code-generator', words: ['qr code'] },
  { slug: 'favicon-generator', words: ['favicon'] },
  { slug: 'word-counter', words: ['word count', 'character count', 'resume length', 'ats'] },
  { slug: 'color-palette-generator', words: ['color palette', 'colour palette', 'wcag color', 'accessible color'] },
]

function guessToolSlug(text, exclude) {
  const lower = text.toLowerCase()
  let best = null
  let bestScore = 0
  for (const { slug, words } of TOOL_KEYWORDS) {
    if (exclude.has(slug)) continue
    const score = words.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = slug
    }
  }
  return best
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error('no frontmatter found')
  const [, fm, body] = match
  const data = {}
  const lines = fm.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const kv = line.match(/^([a-z_]+):\s*(.*)$/)
    if (!kv) continue
    const [, key, rawVal] = kv
    let val = rawVal.trim()
    if (val.startsWith('[') && !val.endsWith(']')) {
      // Multi-line array: keep consuming lines until one closes the bracket.
      let full = val
      while (i + 1 < lines.length && !full.trimEnd().endsWith(']')) {
        i++
        full += `\n${lines[i]}`
      }
      val = full.trim()
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim()
      data[key] = inner === ''
        ? []
        : inner
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((s) => s.replace(/^"|"$/g, ''))
    } else if (val.startsWith('"') && val.endsWith('"')) {
      data[key] = val.slice(1, -1)
    } else {
      data[key] = val
    }
  }
  return { data, body }
}

// Split inline markdown text into segment descriptors.
function parseInline(text, ctx) {
  const segs = []
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m
  while ((m = re.exec(text))) {
    if (m.index > last) segs.push({ kind: 'text', text: text.slice(last, m.index) })
    if (m[1] !== undefined) {
      segs.push({ kind: 'bold', text: m[1] })
    } else {
      segs.push(resolveLink(m[2], m[3], ctx))
    }
    last = re.lastIndex
  }
  if (last < text.length) segs.push({ kind: 'text', text: text.slice(last) })
  return segs
}

function resolveLink(linkText, href, ctx) {
  let m
  if ((m = href.match(/^https:\/\/scult\.in\/services\/([a-z0-9-]+)\/?$/)) || (m = href.match(/^\/services\/([a-z0-9-]+)\/?$/))) {
    const rawSlug = m[1]
    const key = SERVICE_SLUG_FIX[rawSlug]
    if (key) {
      ctx.serviceVotes[key] = (ctx.serviceVotes[key] || 0) + 1
      return { kind: 'link-service', text: linkText, serviceKey: key }
    }
    ctx.warnings.push(`unresolved service slug "${rawSlug}" in ${ctx.slug}`)
    return { kind: 'link-external', text: linkText, href: `https://scult.in/services/${rawSlug}` }
  }
  if (href.match(/^https:\/\/scult\.in\/?$/)) {
    return { kind: 'link-root', text: linkText }
  }
  if ((m = href.match(/^https:\/\/scult\.in\/#([a-z-]+)$/)) || (m = href.match(/^\/#([a-z-]+)$/))) {
    return { kind: 'link-book-meeting', text: linkText, anchor: m[1] }
  }
  if ((m = href.match(/^\/(seo|business|dev|productivity|design|geo)\/([a-z0-9-]+)\/?$/))) {
    const [, category, slug] = m
    if (TOOL_SET.has(`${category}/${slug}`)) {
      ctx.relatedTools.add(slug)
      return { kind: 'link-internal', text: linkText, href: `/${category}/${slug}` }
    }
    ctx.warnings.push(`unresolved tool link "${href}" in ${ctx.slug}`)
    return { kind: 'link-internal', text: linkText, href }
  }
  if ((m = href.match(/^\/prompts\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/))) {
    const [, category, slug] = m
    if (PROMPT_SET.has(`${category}/${slug}`) || PROMPT_SLUGS.has(slug)) {
      ctx.relatedPrompts.add(slug)
      return { kind: 'link-internal', text: linkText, href: `/prompts/${category}/${slug}` }
    }
    ctx.warnings.push(`unresolved prompt link "${href}" in ${ctx.slug}`)
    return { kind: 'link-internal', text: linkText, href }
  }
  if ((m = href.match(/^\/prompts\/([a-z0-9-]+)\/?$/))) {
    const rawCategory = m[1]
    const category = PROMPT_CATEGORIES.has(rawCategory) ? rawCategory : PROMPT_CATEGORY_FIX[rawCategory]
    if (category) return { kind: 'link-internal', text: linkText, href: `/prompts/${category}` }
    ctx.warnings.push(`unresolved prompt category link "${href}" in ${ctx.slug}`)
    return { kind: 'link-internal', text: linkText, href }
  }
  if ((m = href.match(/^\/guides\/([a-z0-9-]+)\/?$/))) {
    if (!GUIDE_SLUGS.has(m[1])) ctx.warnings.push(`unresolved guide link "${href}" in ${ctx.slug}`)
    return { kind: 'link-internal', text: linkText, href }
  }
  if ((m = href.match(/^\/blog\/([a-z0-9-]+)\/?$/))) {
    if (!EXISTING_BLOG_SLUGS.has(m[1]) && !ctx.allDraftSlugs.has(m[1])) {
      ctx.warnings.push(`unresolved blog link "${href}" in ${ctx.slug}`)
    }
    return { kind: 'link-internal', text: linkText, href }
  }
  if (href.match(/^https?:\/\//)) {
    return { kind: 'link-external', text: linkText, href }
  }
  ctx.warnings.push(`unrecognized link "${href}" in ${ctx.slug}`)
  return { kind: 'link-internal', text: linkText, href }
}

function parseTable(lines) {
  const rows = lines
    .filter((l) => l.trim().startsWith('|'))
    .map((l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim()))
  if (rows.length < 2) return []
  const header = rows[0]
  const dataRows = rows.slice(2) // skip header + separator
  return dataRows.map((row) => row.map((cell, i) => `${header[i]}: ${cell}`).join(' · '))
}

const MIN_PARAGRAPH_LEN = 41

// Merges thin paragraphs (a lone label line, a short bullet, a fenced
// code-block line split one-per-line) forward into their neighbor so every
// resulting paragraph clears the registry test's >40-char minimum, without
// losing any of the original words.
function mergeThinParagraphs(paragraphs) {
  const merged = []
  let pending = null
  for (const p of paragraphs) {
    const current = pending ? [...pending, { kind: 'text', text: ' ' }, ...p] : p
    const len = textLength(current)
    if (len <= MIN_PARAGRAPH_LEN) {
      pending = current
    } else {
      merged.push(current)
      pending = null
    }
  }
  if (pending) {
    if (merged.length > 0) {
      merged[merged.length - 1] = [...merged[merged.length - 1], { kind: 'text', text: ' ' }, ...pending]
    } else {
      merged.push(pending)
    }
  }
  return merged
}

function parseSectionBlock(raw, ctx) {
  const lines = raw.split('\n').filter((l) => !l.trim().startsWith('```'))
  const paragraphs = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') {
      i++
      continue
    }
    if (line.trim().startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      for (const rowText of parseTable(tableLines)) {
        paragraphs.push(parseInline(rowText, ctx))
      }
      continue
    }
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)$/)
    const numberedMatch = line.match(/^\s*(\d+)\.\s+(.*)$/)
    if (bulletMatch) {
      paragraphs.push(parseInline(`– ${bulletMatch[1]}`, ctx))
      i++
      continue
    }
    if (numberedMatch) {
      paragraphs.push(parseInline(`${numberedMatch[1]}. ${numberedMatch[2]}`, ctx))
      i++
      continue
    }
    paragraphs.push(parseInline(line.trim(), ctx))
    i++
  }
  return mergeThinParagraphs(paragraphs)
}

// Handles the two FAQ conventions seen across the batch:
//   Format A: "**N. Question?**" alone on a line, answer on the line(s) after.
//   Format B: "N. **Question?** Answer text..." all on one line, optionally
//             continuing onto further plain lines before the next numbered item.
// Bold-only category labels ("**Beginner**", "**Core understanding**") are
// skipped rather than treated as a question.
function parseFaqBlock(raw, ctx) {
  const items = []
  const lines = raw.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (line === '') {
      i++
      continue
    }
    const formatB = line.match(/^\d+\.\s*\*\*(.+?)\*\*\s*(.*)$/)
    if (formatB) {
      const question = formatB[1].trim()
      const answerParts = [formatB[2].trim()]
      i++
      while (i < lines.length && lines[i].trim() !== '' && !/^\d+\.\s*\*\*/.test(lines[i].trim()) && !/^\*\*[^*]+\*\*$/.test(lines[i].trim())) {
        answerParts.push(lines[i].trim())
        i++
      }
      const answerText = answerParts.filter(Boolean).join(' ')
      if (answerText) items.push({ question, answer: parseInline(answerText, ctx) })
      else ctx.warnings.push(`empty FAQ answer for "${question}" in ${ctx.slug}`)
      continue
    }
    const formatA = line.match(/^\*\*(\d+)\.\s*(.+?)\*\*$/)
    if (formatA) {
      const question = formatA[2].trim()
      i++
      const answerLines = []
      while (i < lines.length && lines[i].trim() !== '' && !/^\*\*\d+\./.test(lines[i].trim())) {
        answerLines.push(lines[i].trim())
        i++
      }
      const answerText = answerLines.join(' ')
      if (answerText) items.push({ question, answer: parseInline(answerText, ctx) })
      else ctx.warnings.push(`empty FAQ answer for "${question}" in ${ctx.slug}`)
      continue
    }
    // Bold-only category label or anything unrecognized — skip, not a Q&A pair.
    i++
  }
  return items
}

function textLength(paragraph) {
  return paragraph.reduce((acc, seg) => acc + seg.text.length, 0)
}

function wordCount(segs) {
  return segs.reduce((acc, seg) => acc + seg.text.split(/\s+/).filter(Boolean).length, 0)
}

function parseArticle(filePath, allDraftSlugs) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data: fm, body } = parseFrontmatter(raw)
  const ctx = {
    slug: fm.slug,
    relatedTools: new Set(),
    relatedPrompts: new Set(),
    serviceVotes: {},
    warnings: [],
    allDraftSlugs,
  }

  const h1Match = body.match(/^# (.+)$/m)
  const h1 = h1Match ? h1Match[1].trim() : fm.title

  // Split body into H2 blocks.
  const h2Re = /^## (.+)$/gm
  const headings = []
  let m
  while ((m = h2Re.exec(body))) {
    headings.push({ heading: m[1].trim(), start: m.index, contentStart: h2Re.lastIndex })
  }

  // Dek = text between H1 line and first H2.
  const firstH2Start = headings.length > 0 ? headings[0].start : body.length
  const afterH1 = h1Match ? body.slice(h1Match.index + h1Match[0].length, firstH2Start) : body.slice(0, firstH2Start)
  const dek = afterH1
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .join(' ')

  const sections = []
  let faq = []

  for (let idx = 0; idx < headings.length; idx++) {
    const h = headings[idx]
    const end = idx + 1 < headings.length ? headings[idx + 1].start : body.length
    const blockRaw = body.slice(h.contentStart, end).trim()
    const headingLower = h.heading.toLowerCase()
    if (headingLower === 'table of contents' || headingLower === 'sources') continue
    if (headingLower === 'frequently asked questions') {
      faq = parseFaqBlock(blockRaw, ctx)
      continue
    }
    const paragraphs = parseSectionBlock(blockRaw, ctx)
    if (paragraphs.length > 0) {
      sections.push({ heading: h.heading, body: paragraphs })
    }
  }

  const totalWords =
    sections.reduce((acc, s) => acc + s.body.reduce((a, p) => a + wordCount(p), 0), 0) +
    faq.reduce((acc, f) => acc + wordCount(f.answer), 0)
  const readingMinutes = Math.max(1, Math.min(30, Math.ceil(totalWords / 220)))

  // Gate check: internal/external links counted from SECTIONS only (matches registry.test.ts's flatten()).
  function countLinks(kindPred) {
    let count = 0
    for (const s of sections) {
      for (const p of s.body) {
        for (const seg of p) {
          if (kindPred(seg.kind)) count++
        }
      }
    }
    return count
  }
  let internalCount = countLinks((k) => k === 'link-internal')
  let externalCount = countLinks((k) => k === 'link-external' || k === 'link-service' || k === 'link-root' || k === 'link-book-meeting')

  const combinedText = [fm.title, fm.primary_keyword, fm.topic_cluster, fm.description].filter(Boolean).join(' ')

  // Fixup: ensure >=1 external (service) link.
  if (externalCount < 1) {
    const key = guessServiceKey(combinedText) || null
    const cta = key
      ? { kind: 'link-service', text: 'that is exactly the kind of work our team handles', serviceKey: key }
      : { kind: 'link-service', text: 'get in touch about what Scult builds', serviceKey: null }
    if (key) ctx.serviceVotes[key] = (ctx.serviceVotes[key] || 0) + 1
    const sentence = [
      { kind: 'text', text: 'If this is a gap worth closing properly rather than patching once, ' },
      cta,
      { kind: 'text', text: '.' },
    ]
    appendToResourcesSection(sections, sentence)
    externalCount++
  }

  // Fixup: ensure >=2 internal links.
  while (internalCount < 2) {
    const already = new Set(ctx.relatedTools)
    const pick = guessToolSlug(combinedText, already) || pickFallbackTool(already)
    if (!pick) break
    ctx.relatedTools.add(pick)
    const sentence = [
      { kind: 'text', text: 'For a related, free starting point, try the ' },
      { kind: 'link-internal', text: toolLabel(pick), href: `/${TOOL_CATEGORY[pick]}/${pick}` },
      { kind: 'text', text: '.' },
    ]
    appendToResourcesSection(sections, sentence)
    internalCount++
  }

  const serviceTarget = pickTopService(ctx.serviceVotes)

  return {
    fm,
    h1,
    dek,
    sections,
    faq,
    relatedTools: [...ctx.relatedTools],
    relatedPrompts: [...ctx.relatedPrompts],
    serviceTarget,
    readingMinutes,
    warnings: ctx.warnings,
    gateCheck: { internalCount, externalCount },
  }
}

const TOOL_CATEGORY = Object.fromEntries(REG.tools.map((t) => [t.slug, t.category]))
const TOOL_LABELS = {
  'ai-visibility-checker': 'AI Visibility Checker',
  'schema-markup-generator': 'Schema Markup Generator',
  'faq-schema-generator': 'FAQ Schema Generator',
  'website-speed-test': 'Website Speed Test',
  'utm-builder': 'UTM Builder',
  'marketing-roi-calculator': 'Marketing ROI Calculator',
  'invoice-generator': 'Invoice Generator',
  'business-name-generator': 'Business Name Generator',
  'slogan-generator': 'Slogan Generator',
  'email-signature-generator': 'Email Signature Generator',
  'json-formatter': 'JSON Formatter',
  'qr-code-generator': 'QR Code Generator',
  'favicon-generator': 'Favicon Generator',
  'word-counter': 'Word Counter',
  'color-palette-generator': 'Color Palette Generator',
}
function toolLabel(slug) {
  return TOOL_LABELS[slug] || slug
}
const FALLBACK_TOOL_ORDER = ['ai-visibility-checker', 'schema-markup-generator', 'utm-builder', 'word-counter']
function pickFallbackTool(exclude) {
  return FALLBACK_TOOL_ORDER.find((s) => !exclude.has(s)) || null
}

function pickTopService(votes) {
  const entries = Object.entries(votes)
  if (entries.length === 0) return undefined
  entries.sort((a, b) => b[1] - a[1])
  return entries[0][0]
}

function appendToResourcesSection(sections, sentenceSegs) {
  let resources = sections.find((s) => s.heading.toLowerCase().includes('relevant tools.scult.in resources'))
  if (!resources) {
    resources = { heading: 'Relevant tools.scult.in resources', body: [] }
    sections.push(resources)
  }
  resources.body.push(sentenceSegs)
}

function main() {
  const files = fs
    .readdirSync(DRAFTS_DIR)
    .filter((f) => /^article-\d+\.md$/.test(f))
    .sort()
  const allDraftSlugs = new Set()
  const raws = []
  for (const f of files) {
    const raw = fs.readFileSync(path.join(DRAFTS_DIR, f), 'utf8')
    const slugMatch = raw.match(/^slug:\s*(.+)$/m)
    if (slugMatch) allDraftSlugs.add(slugMatch[1].trim())
  }

  const articles = []
  const allWarnings = []
  for (const f of files) {
    const parsed = parseArticle(path.join(DRAFTS_DIR, f), allDraftSlugs)
    articles.push(parsed)
    allWarnings.push(...parsed.warnings)
  }

  // Cross-article + cross-catalogue uniqueness checks.
  const titles = new Map()
  const descs = new Map()
  const keywords = new Map()
  const slugs = new Map()
  for (const a of articles) {
    for (const [map, val, label] of [
      [titles, a.fm.title, 'title'],
      [descs, a.fm.description, 'description'],
      [keywords, a.fm.primary_keyword, 'primary_keyword'],
      [slugs, a.fm.slug, 'slug'],
    ]) {
      if (map.has(val)) allWarnings.push(`duplicate ${label} "${val}": ${map.get(val)} vs ${a.fm.slug}`)
      map.set(val, a.fm.slug)
    }
  }
  for (const a of articles) {
    if (REG.blogTitles.includes(a.fm.title)) allWarnings.push(`title collides with existing blog post: "${a.fm.title}" (${a.fm.slug})`)
    if (REG.blogDescriptions.includes(a.fm.description)) allWarnings.push(`description collides with existing blog post: (${a.fm.slug})`)
    if (REG.blogKeywords.includes(a.fm.primary_keyword)) allWarnings.push(`targetKeyword collides with existing blog post: "${a.fm.primary_keyword}" (${a.fm.slug})`)
    if (REG.blogSlugs.includes(a.fm.slug)) allWarnings.push(`slug collides with existing blog post: "${a.fm.slug}"`)
    if (a.fm.description.length <= 70 || a.fm.description.length > 200) {
      allWarnings.push(`description length ${a.fm.description.length} out of bounds (${a.fm.slug})`)
    }
  }

  // Paragraph-length + section-count gate checks.
  for (const a of articles) {
    if (a.sections.length < 5) allWarnings.push(`only ${a.sections.length} sections (${a.fm.slug})`)
    for (const s of a.sections) {
      for (const p of s.body) {
        const len = textLength(p)
        if (len <= 40) allWarnings.push(`thin paragraph (${len} chars) in "${s.heading}" (${a.fm.slug})`)
      }
    }
    if (a.gateCheck.internalCount < 2) allWarnings.push(`only ${a.gateCheck.internalCount} internal links after fixup (${a.fm.slug})`)
    if (a.gateCheck.externalCount < 1) allWarnings.push(`only ${a.gateCheck.externalCount} external links after fixup (${a.fm.slug})`)
  }

  fs.writeFileSync(path.join(__dirname, 'parsed-articles.json'), JSON.stringify(articles, null, 1))
  fs.writeFileSync(path.join(__dirname, 'parse-warnings.txt'), allWarnings.join('\n'))
  console.log(`Parsed ${articles.length} articles. ${allWarnings.length} warnings written to parse-warnings.txt`)
}

main()
