// Generates lib/blog/<slug>/meta.ts for every parsed content-engine article,
// then appends the imports + BLOG_POSTS entries to lib/blog/registry.ts.
'use strict'
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname, '..')
const ARTICLES = JSON.parse(fs.readFileSync(path.join(__dirname, 'parsed-articles.json'), 'utf8'))

function pascalCase(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

function importName(slug) {
  return `ce${pascalCase(slug)}`
}

function inferPillar(fm) {
  const t = `${fm.title} ${fm.primary_keyword}`.toLowerCase()
  if (/\bvs\b|\balternatives?\b|\bcomparison\b|^best /.test(t)) return 'roundup'
  return 'playbook'
}

function tsString(s) {
  return JSON.stringify(s)
}

// Collects which named consts (SERVICE_<KEY>, and whether parentLink/root/book-meeting
// are used) an article actually needs, scanning every segment across sections + faq.
function collectNeeds(article) {
  const serviceKeys = new Set()
  let usesRoot = false
  let usesBookMeeting = false
  const visit = (segs) => {
    for (const seg of segs) {
      if (seg.kind === 'link-service') serviceKeys.add(seg.serviceKey)
      if (seg.kind === 'link-root') usesRoot = true
      if (seg.kind === 'link-book-meeting') usesBookMeeting = true
    }
  }
  for (const s of article.sections) for (const p of s.body) visit(p)
  for (const f of article.faq) visit(f.answer)
  return { serviceKeys, usesRoot, usesBookMeeting }
}

function serviceConstName(key) {
  return key ? `SERVICE_${key.toUpperCase().replace(/-/g, '_')}` : 'SERVICE_DEFAULT'
}

function renderSegment(seg) {
  switch (seg.kind) {
    case 'text':
      return tsString(seg.text)
    case 'bold':
      return `{ text: ${tsString(seg.text)}, bold: true }`
    case 'link-internal':
      return `{ text: ${tsString(seg.text)}, href: ${tsString(seg.href)} }`
    case 'link-external':
      return `{ text: ${tsString(seg.text)}, href: ${tsString(seg.href)}, external: true }`
    case 'link-service':
      return `{ text: ${tsString(seg.text)}, href: ${serviceConstName(seg.serviceKey)}.href, external: true }`
    case 'link-root':
      return `{ text: ${tsString(seg.text)}, href: parentLink('/', SLUG), external: true }`
    case 'link-book-meeting':
      return `{ text: ${tsString(seg.text)}, href: BOOK_MEETING, external: true }`
    default:
      throw new Error(`unknown segment kind ${seg.kind}`)
  }
}

function renderParagraph(segs) {
  return `[${segs.map(renderSegment).join(', ')}]`
}

function renderSection(section) {
  return `    {
      heading: ${tsString(section.heading)},
      body: [
${section.body.map((p) => `        ${renderParagraph(p)},`).join('\n')}
      ],
    }`
}

function renderFaqItem(item) {
  return `    {
      question: ${tsString(item.question)},
      answer: ${renderParagraph(item.answer)},
    }`
}

function generateFile(article) {
  const { fm, h1, dek, sections, faq } = article
  const slug = fm.slug
  const needs = collectNeeds(article)
  const importLines = []
  if (needs.usesRoot || needs.usesBookMeeting) importLines.push("import { parentLink } from '@/lib/site'")
  if (needs.serviceKeys.size > 0) importLines.push("import { resolveServiceLink } from '@/lib/tools/service-links'")
  importLines.push("import type { BlogPost } from '../types'")

  const constLines = [`const SLUG = ${tsString(slug)}`]
  for (const key of needs.serviceKeys) {
    constLines.push(`const ${serviceConstName(key)} = resolveServiceLink(${key ? tsString(key) : 'undefined'}, SLUG)`)
  }
  if (needs.usesBookMeeting) constLines.push("const BOOK_MEETING = parentLink('/#book-meeting', SLUG)")

  const pillar = inferPillar(fm)
  const serviceTargetLine = article.serviceTarget ? `\n  serviceTarget: ${tsString(article.serviceTarget)},` : ''

  const src = `${importLines.join('\n')}

${constLines.join('\n')}

/**
 * Generated from content-engine/05-drafts/${fm.id}.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: ${tsString(pillar)},
  title: ${tsString(fm.title)},
  h1: ${tsString(h1)},
  targetKeyword: ${tsString(fm.primary_keyword)},
  description: ${tsString(fm.description)},
  dek: ${tsString(dek)},
  sections: [
${sections.map((s) => `${renderSection(s)},`).join('\n')}
  ],
  faq: [
${faq.map((f) => `${renderFaqItem(f)},`).join('\n')}
  ],
  sources: [
${fm.sources.map((s) => `    ${tsString(s)},`).join('\n')}
  ],
  relatedTools: [${article.relatedTools.map(tsString).join(', ')}],
  relatedPrompts: [${article.relatedPrompts.map(tsString).join(', ')}],${serviceTargetLine}
  updatedAt: ${tsString(fm.last_verified)},
  readingMinutes: ${article.readingMinutes},
}
`
  return src
}

function main() {
  const registryPath = path.join(ROOT, 'lib/blog/registry.ts')
  const registryRaw = fs.readFileSync(registryPath, 'utf8')
  const usesCRLF = registryRaw.includes('\r\n')
  let registrySrc = registryRaw.replace(/\r\n/g, '\n')

  const importStatements = []
  const arrayEntries = []

  for (const article of ARTICLES) {
    const slug = article.fm.slug
    const dir = path.join(ROOT, 'lib/blog', slug)
    fs.mkdirSync(dir, { recursive: true })
    const src = generateFile(article)
    fs.writeFileSync(path.join(dir, 'meta.ts'), src)
    const name = importName(slug)
    importStatements.push(`import { meta as ${name} } from './${slug}/meta'`)
    arrayEntries.push(`  ${name},`)
  }

  // Insert new imports right before "export const BLOG_POSTS"
  const marker = 'export const BLOG_POSTS: readonly BlogPost[] = ['
  const markerIdx = registrySrc.indexOf(marker)
  if (markerIdx === -1) throw new Error('BLOG_POSTS marker not found in registry.ts')
  registrySrc =
    registrySrc.slice(0, markerIdx) +
    `${importStatements.join('\n')}\n\n` +
    registrySrc.slice(markerIdx)

  // Insert new entries right before the closing "]" of the BLOG_POSTS array.
  const arrEndMarker = '\n]\n\nexport const BLOG_POST_BY_SLUG'
  const arrEndIdx = registrySrc.indexOf(arrEndMarker)
  if (arrEndIdx === -1) throw new Error('BLOG_POSTS array end marker not found')
  registrySrc =
    registrySrc.slice(0, arrEndIdx) +
    `\n${arrayEntries.join('\n')}` +
    registrySrc.slice(arrEndIdx)

  fs.writeFileSync(registryPath, usesCRLF ? registrySrc.replace(/\n/g, '\r\n') : registrySrc)
  console.log(`Generated ${ARTICLES.length} meta.ts files and updated registry.ts`)
}

main()
