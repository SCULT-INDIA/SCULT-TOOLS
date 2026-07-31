/**
 * Email-safe signature HTML construction.
 *
 * Purpose
 *   Turn a handful of identity fields into signature markup that survives real
 *   email clients. Desktop Outlook renders mail with Microsoft Word's engine
 *   (no flexbox, no grid, unreliable margins) and Gmail strips `<style>`
 *   blocks, so the only markup that works everywhere is 1999-era HTML: nested
 *   tables, inline styles on every element, absolute pixel sizes, and a
 *   web-safe Arial/Helvetica font stack. This module writes exactly that.
 *
 * Inputs   free-text SignatureFields (any field may be empty or half-typed —
 *          the caller re-renders per keystroke), a template name, and an
 *          accent colour string.
 * Outputs  a SignatureResult: the HTML string plus advisory warnings. An
 *          optional field left empty omits its row entirely — no dangling
 *          separators, no empty table cells.
 * Failure  never throws. Garbage URLs are dropped with a warning; a garbage
 *          accent colour falls back to the site default with a warning.
 *
 * Security every user-supplied value passes through escapeHtml (& < > " ')
 *          before it is interpolated, and link hrefs are restricted to
 *          http/https (plus tel:/mailto: built here from validated parts).
 *          This is the invariant that makes the component's
 *          dangerouslySetInnerHTML preview safe.
 *
 * No React, no DOM, no I/O — pure functions, unit-tested in logic.test.ts.
 */

export type SignatureTemplate = 'classic' | 'stacked' | 'corporate'

export interface SignatureFields {
  readonly fullName: string
  readonly jobTitle: string
  readonly company: string
  readonly phone: string
  readonly email: string
  readonly website: string
  readonly linkedin: string
  readonly twitter: string
  readonly instagram: string
  readonly github: string
  readonly photoUrl: string
}

export interface SignatureResult {
  readonly html: string
  readonly warnings: readonly string[]
}

/** The site violet — the fallback when the accent colour input is invalid. */
export const DEFAULT_ACCENT = '#4B20DE'

/** Web-safe stack: the only fonts that render identically in every client. */
const FONT = 'Arial,Helvetica,sans-serif'

/**
 * The one separator used between inline items. A span, not a table cell, so
 * a line of three links wraps naturally on narrow phone clients. The middot
 * is the HTML entity `&#183;` — tests count it to prove no separator ever
 * dangles next to an omitted field.
 */
const SEPARATOR = '<span style="color:#8a8a8a;">&nbsp;&#183;&nbsp;</span>'

const NAME_STYLE = `font-family:${FONT};font-size:16px;line-height:22px;font-weight:bold;color:#111111;`
const TITLE_STYLE = `font-family:${FONT};font-size:13px;line-height:19px;color:#555555;`
const META_STYLE = `font-family:${FONT};font-size:12px;line-height:19px;color:#555555;`

/**
 * Escapes the five HTML metacharacters. Ampersand first, or the other
 * replacements would be double-escaped.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Validates an accent colour as hex. Accepts `#4B20DE`, `4B20DE` and the
 * 3-digit shorthand `#abc` (expanded to 6 digits, because `<input
 * type="color">` and older Outlook builds both want the long form).
 * Anything else returns undefined so the caller can fall back and warn.
 */
export function normalizeHexColor(raw: string): string | undefined {
  const match = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(raw.trim())
  const hex = match?.[1]
  if (hex === undefined) return undefined
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex
  return `#${full.toLowerCase()}`
}

/**
 * Builds the tel: href. The display text keeps the user's formatting; the
 * href strips everything except digits and `+`, because `tel:+91 98765` is
 * not a dialable URI while `tel:+9198765` is.
 */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/** Loose but honest: enough to refuse `not-an-email` without rejecting `+` tags. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ResolvedLink {
  readonly href: string
  /** What the user typed (trimmed) — shown as the link text where relevant. */
  readonly display: string
}

/**
 * Validates a link field. A URL without a protocol is auto-prefixed with
 * https:// and flagged; a URL that cannot be parsed, or whose scheme is not
 * http/https (so `javascript:` can never reach an href), is dropped with a
 * warning rather than emitted broken.
 */
function resolveLink(
  raw: string,
  label: string,
  warnings: string[],
): ResolvedLink | undefined {
  const trimmed = raw.trim()
  if (trimmed === '') return undefined
  const hasScheme = /^[a-z][a-z\d+\-.]*:/i.test(trimmed)
  const candidate = hasScheme ? trimmed : `https://${trimmed}`
  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    warnings.push(`${label} does not look like a valid URL, so it was left out.`)
    return undefined
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    warnings.push(`${label} must start with http:// or https://, so it was left out.`)
    return undefined
  }
  if (!hasScheme) {
    warnings.push(`${label} had no protocol, so https:// was assumed.`)
  }
  return { href: parsed.toString(), display: trimmed }
}

/** An inline `<a>` with the accent colour. Caller passes pre-escaped text. */
function link(href: string, escapedText: string, accent: string): string {
  return `<a href="${escapeHtml(href)}" style="color:${accent};text-decoration:none;">${escapedText}</a>`
}

/** One `<tr><td>` text row. Rows for empty fields are simply never created. */
function row(content: string, style: string): string {
  return `<tr><td style="${style}">${content}</td></tr>`
}

/** Fixed-size img: width/height attributes AND px styles, per client quirks. */
function photoImg(href: string, escapedAlt: string, size: number): string {
  return (
    `<img src="${escapeHtml(href)}" width="${size}" height="${size}" alt="${escapedAlt}" ` +
    `style="display:block;width:${size}px;height:${size}px;border-radius:50%;border:0;">`
  )
}

const SOCIAL_LINKS: readonly {
  readonly key: 'linkedin' | 'twitter' | 'instagram' | 'github'
  readonly label: string
}[] = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'X' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'github', label: 'GitHub' },
]

/** Everything the template renderers need, computed once. */
interface SignatureContext {
  readonly name: string
  readonly title: string
  readonly company: string
  readonly contactItems: readonly string[]
  readonly socialItems: readonly string[]
  readonly photoHref: string | undefined
  readonly accent: string
}

function buildContext(
  fields: SignatureFields,
  accent: string,
  warnings: string[],
): SignatureContext {
  const contactItems: string[] = []

  const phone = fields.phone.trim()
  if (phone !== '') {
    contactItems.push(link(telHref(phone), escapeHtml(phone), accent))
  }

  const email = fields.email.trim()
  if (email !== '') {
    if (LOOKS_LIKE_EMAIL.test(email)) {
      contactItems.push(link(`mailto:${email}`, escapeHtml(email), accent))
    } else {
      contactItems.push(escapeHtml(email))
      warnings.push(
        'The email address does not look valid, so it is shown without a mailto: link.',
      )
    }
  }

  const website = resolveLink(fields.website, 'The website URL', warnings)
  if (website) {
    contactItems.push(link(website.href, escapeHtml(website.display), accent))
  }

  const socialItems: string[] = []
  for (const social of SOCIAL_LINKS) {
    const resolved = resolveLink(fields[social.key], `The ${social.label} URL`, warnings)
    if (resolved) socialItems.push(link(resolved.href, social.label, accent))
  }

  const photo = resolveLink(fields.photoUrl, 'The photo or logo URL', warnings)

  return {
    name: escapeHtml(fields.fullName.trim()),
    title: escapeHtml(fields.jobTitle.trim()),
    company: escapeHtml(fields.company.trim()),
    contactItems,
    socialItems,
    photoHref: photo?.href,
    accent,
  }
}

const TABLE_OPEN = '<table cellpadding="0" cellspacing="0" border="0" role="presentation"'

/** The shared identity rows (name, title, company) — omitted when empty. */
function identityRows(ctx: SignatureContext, extraStyle: string): string[] {
  const rows: string[] = []
  if (ctx.name !== '') rows.push(row(ctx.name, NAME_STYLE + extraStyle))
  if (ctx.title !== '') rows.push(row(ctx.title, TITLE_STYLE + extraStyle))
  if (ctx.company !== '') {
    rows.push(
      row(
        ctx.company,
        `font-family:${FONT};font-size:13px;line-height:19px;font-weight:bold;color:${ctx.accent};${extraStyle}`,
      ),
    )
  }
  return rows
}

/** Classic: photo left, text right — the LinkedIn-era default. */
function renderClassic(ctx: SignatureContext): string {
  const rows = identityRows(ctx, '')
  if (ctx.contactItems.length > 0) {
    rows.push(row(ctx.contactItems.join(SEPARATOR), `${META_STYLE}padding-top:6px;`))
  }
  if (ctx.socialItems.length > 0) {
    rows.push(row(ctx.socialItems.join(SEPARATOR), `${META_STYLE}padding-top:4px;`))
  }
  if (rows.length === 0 && ctx.photoHref === undefined) return ''

  const photoCell = ctx.photoHref
    ? `<td width="64" style="vertical-align:top;padding-right:14px;">${photoImg(ctx.photoHref, ctx.name, 64)}</td>`
    : ''
  return (
    `${TABLE_OPEN} style="font-family:${FONT};"><tr>${photoCell}` +
    `<td style="vertical-align:top;">${TABLE_OPEN}>${rows.join('')}</table></td></tr></table>`
  )
}

/** Stacked: centred, minimal — photo on top, a short accent rule below the name block. */
function renderStacked(ctx: SignatureContext): string {
  const center = 'text-align:center;'
  const rows: string[] = []
  if (ctx.photoHref !== undefined) {
    rows.push(
      `<tr><td align="center" style="padding-bottom:8px;">${photoImg(ctx.photoHref, ctx.name, 72)}</td></tr>`,
    )
  }
  rows.push(...identityRows(ctx, center))

  const hasIdentity = rows.length > 0
  const hasContact = ctx.contactItems.length > 0 || ctx.socialItems.length > 0
  if (hasIdentity && hasContact) {
    rows.push(
      `<tr><td align="center" style="padding:8px 0 2px 0;">${TABLE_OPEN}>` +
        `<tr><td width="36" height="3" style="width:36px;height:3px;font-size:1px;line-height:1px;background-color:${ctx.accent};">&nbsp;</td></tr>` +
        '</table></td></tr>',
    )
  }
  if (ctx.contactItems.length > 0) {
    rows.push(
      row(ctx.contactItems.join(SEPARATOR), `${META_STYLE}${center}padding-top:4px;`),
    )
  }
  if (ctx.socialItems.length > 0) {
    rows.push(
      row(ctx.socialItems.join(SEPARATOR), `${META_STYLE}${center}padding-top:4px;`),
    )
  }
  if (rows.length === 0) return ''
  return `${TABLE_OPEN} align="center" style="font-family:${FONT};">${rows.join('')}</table>`
}

/** Corporate: identity column, vertical accent rule, contact column. */
function renderCorporate(ctx: SignatureContext): string {
  const leftRows: string[] = []
  if (ctx.photoHref !== undefined) {
    leftRows.push(
      `<tr><td style="padding-bottom:8px;">${photoImg(ctx.photoHref, ctx.name, 64)}</td></tr>`,
    )
  }
  leftRows.push(...identityRows(ctx, ''))

  const rightRows: string[] = ctx.contactItems.map((item) =>
    row(item, `font-family:${FONT};font-size:12px;line-height:20px;color:#555555;`),
  )
  if (ctx.socialItems.length > 0) {
    rightRows.push(row(ctx.socialItems.join(SEPARATOR), `${META_STYLE}padding-top:6px;`))
  }

  if (leftRows.length === 0 && rightRows.length === 0) return ''
  // A one-sided signature renders as a single column — the accent rule only
  // exists when there is a second column for it to separate.
  if (rightRows.length === 0) {
    return `${TABLE_OPEN} style="font-family:${FONT};">${leftRows.join('')}</table>`
  }
  if (leftRows.length === 0) {
    return `${TABLE_OPEN} style="font-family:${FONT};">${rightRows.join('')}</table>`
  }
  return (
    `${TABLE_OPEN} style="font-family:${FONT};"><tr>` +
    `<td style="vertical-align:top;padding-right:14px;">${TABLE_OPEN}>${leftRows.join('')}</table></td>` +
    `<td width="3" style="width:3px;background-color:${ctx.accent};font-size:1px;line-height:1px;">&nbsp;</td>` +
    `<td style="vertical-align:top;padding-left:14px;">${TABLE_OPEN}>${rightRows.join('')}</table></td>` +
    '</tr></table>'
  )
}

/**
 * Builds the signature. Pure: same inputs, same string. Empty or invalid
 * input never throws — half-typed fields are the normal case, not an error.
 */
export function buildSignatureHtml(
  fields: SignatureFields,
  template: SignatureTemplate,
  accentColor: string,
): SignatureResult {
  const warnings: string[] = []

  const normalized = normalizeHexColor(accentColor)
  let accent: string
  if (normalized === undefined) {
    accent = DEFAULT_ACCENT
    if (accentColor.trim() !== '') {
      warnings.push(
        `"${accentColor.trim()}" is not a valid hex colour, so the default violet ${DEFAULT_ACCENT} was used.`,
      )
    }
  } else {
    accent = normalized
  }

  const ctx = buildContext(fields, accent, warnings)

  let html: string
  switch (template) {
    case 'classic':
      html = renderClassic(ctx)
      break
    case 'stacked':
      html = renderStacked(ctx)
      break
    case 'corporate':
      html = renderCorporate(ctx)
      break
  }

  return { html, warnings }
}

/**
 * Structural tags that earn their own line when the markup is pretty-printed.
 * Everything else (`a`, `span`, `img`) is inline content and stays on the line
 * of the cell that contains it, which is how a human reads table markup.
 */
const STRUCTURAL_TAGS: ReadonlySet<string> = new Set(['table', 'tr', 'td'])

/**
 * Indents the generated markup for the on-screen source view.
 *
 * Purpose
 *   buildSignatureHtml emits one long line, which is correct for a clipboard
 *   payload and unreadable in a code pane. This adds newlines and two-space
 *   indentation so the nested-table structure — the thing that makes the
 *   signature Outlook-safe — is visible rather than merely claimed.
 *
 * Inputs   the exact string returned by buildSignatureHtml. Nothing else: the
 *          tag scanner below relies on that markup's guarantee that no `<` or
 *          `>` survives inside a text node or an attribute value, because
 *          escapeHtml converts both. Feeding it arbitrary HTML is out of
 *          contract.
 * Outputs  the same markup with whitespace inserted between tags. It adds
 *          characters and never removes, reorders or rewrites any — in
 *          particular it never touches an escaped entity, so the escaping
 *          guarantee that makes the preview safe is untouched.
 * Failure  cannot throw. Unrecognised input is passed through token by token.
 *
 * DISPLAY ONLY. Both copy paths hand over the unformatted string from
 * buildSignatureHtml, so what lands in the clipboard is byte-for-byte what the
 * builder produced — the indentation is never part of the payload.
 */
export function formatSignatureHtml(html: string): string {
  if (html === '') return ''

  const tokens = html.match(/<[^>]*>|[^<]+/g)
  if (tokens === null) return html

  const lines: string[] = []
  let depth = 0
  let current = ''

  function flush(): void {
    if (current === '') return
    lines.push(current)
    current = ''
  }

  for (const token of tokens) {
    const match = /^<(\/?)([a-z]+)/i.exec(token)
    const name = match?.[2]?.toLowerCase()

    if (name !== undefined && STRUCTURAL_TAGS.has(name)) {
      flush()
      // A closing tag lines up with its opener, so unwind before indenting.
      if (match?.[1] === '/') depth = Math.max(0, depth - 1)
      lines.push('  '.repeat(depth) + token)
      if (match?.[1] !== '/') depth += 1
      continue
    }

    if (current === '') current = '  '.repeat(depth)
    current += token
  }

  flush()
  return lines.join('\n')
}

/**
 * The plain-text mirror of the signature, used as the text/plain half of the
 * clipboard payload so pasting into a plain-text context degrades gracefully.
 * Validation warnings are already reported by buildSignatureHtml, so this
 * discards them rather than double-reporting.
 */
export function buildSignatureText(fields: SignatureFields): string {
  const discard: string[] = []
  const lines: string[] = []
  const name = fields.fullName.trim()
  if (name !== '') lines.push(name)
  const title = fields.jobTitle.trim()
  if (title !== '') lines.push(title)
  const company = fields.company.trim()
  if (company !== '') lines.push(company)
  const phone = fields.phone.trim()
  if (phone !== '') lines.push(phone)
  const email = fields.email.trim()
  if (email !== '') lines.push(email)
  const website = resolveLink(fields.website, '', discard)
  if (website) lines.push(website.href)
  for (const social of SOCIAL_LINKS) {
    const resolved = resolveLink(fields[social.key], '', discard)
    if (resolved) lines.push(`${social.label}: ${resolved.href}`)
  }
  return lines.join('\n')
}
