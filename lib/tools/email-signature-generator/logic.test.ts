import { describe, expect, it } from 'vitest'
import {
  buildSignatureHtml,
  buildSignatureText,
  DEFAULT_ACCENT,
  escapeHtml,
  formatSignatureHtml,
  normalizeHexColor,
  type SignatureFields,
  type SignatureTemplate,
  telHref,
} from './logic'

const EMPTY: SignatureFields = {
  fullName: '',
  jobTitle: '',
  company: '',
  phone: '',
  email: '',
  website: '',
  linkedin: '',
  twitter: '',
  instagram: '',
  github: '',
  photoUrl: '',
}

const FULL: SignatureFields = {
  ...EMPTY,
  fullName: 'Priya Sharma',
  jobTitle: 'Marketing Lead',
  company: 'Scult Digital',
  phone: '+91 98765 43210',
  email: 'priya@scult.in',
  website: 'https://scult.in',
  linkedin: 'https://www.linkedin.com/in/priya-sharma',
  photoUrl: 'https://scult.in/priya.jpg',
}

const TEMPLATES: readonly SignatureTemplate[] = ['classic', 'stacked', 'corporate']

/** Count occurrences of the middot separator entity. */
function separatorCount(html: string): number {
  return html.split('&#183;').length - 1
}

describe('buildSignatureHtml — email-safe markup', () => {
  it('produces table-based markup with inline styles in all three templates', () => {
    for (const template of TEMPLATES) {
      const { html } = buildSignatureHtml(FULL, template, '#4B20DE')
      expect(html.startsWith('<table')).toBe(true)
      expect(html).toContain('cellpadding="0"')
      expect(html).toContain('style="')
      expect(html).toContain('Arial,Helvetica,sans-serif')
    }
  })

  it('never emits CSS classes, flexbox or grid in any template', () => {
    for (const template of TEMPLATES) {
      const { html } = buildSignatureHtml(FULL, template, '#4B20DE')
      expect(html).not.toContain('class=')
      expect(html).not.toContain('flex')
      expect(html).not.toContain('grid')
    }
  })

  it('renders the photo with fixed pixel width and height attributes', () => {
    const { html } = buildSignatureHtml(FULL, 'classic', '#4B20DE')
    expect(html).toContain('width="64"')
    expect(html).toContain('height="64"')
    expect(html).toContain('width:64px;height:64px;')
  })

  it('centres the stacked template and draws the corporate accent rule', () => {
    const stacked = buildSignatureHtml(FULL, 'stacked', '#4B20DE').html
    expect(stacked).toContain('align="center"')
    expect(stacked).toContain('text-align:center;')
    const corporate = buildSignatureHtml(FULL, 'corporate', '#4B20DE').html
    expect(corporate).toContain('width:3px;background-color:#4b20de;')
  })
})

describe('buildSignatureHtml — escaping', () => {
  it('escapes every HTML metacharacter in user values', () => {
    const hostile: SignatureFields = {
      ...EMPTY,
      fullName: `<script>alert("x")</script> & 'quotes'`,
      company: 'A & B > C',
    }
    const { html } = buildSignatureHtml(hostile, 'classic', '#4B20DE')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&quot;x&quot;')
    expect(html).toContain('&#39;quotes&#39;')
    expect(html).toContain('A &amp; B &gt; C')
  })

  it('never lets a javascript: URL reach an href', () => {
    const hostile: SignatureFields = {
      ...EMPTY,
      fullName: 'X',
      website: 'javascript:alert(1)',
    }
    const { html, warnings } = buildSignatureHtml(hostile, 'classic', '#4B20DE')
    expect(html).not.toContain('javascript:')
    expect(warnings.some((w) => w.includes('http'))).toBe(true)
  })
})

describe('buildSignatureHtml — row omission (no dangling separators)', () => {
  it('omits every optional row when only the name is given', () => {
    const fields: SignatureFields = { ...EMPTY, fullName: 'Priya Sharma' }
    for (const template of TEMPLATES) {
      const { html } = buildSignatureHtml(fields, template, '#4B20DE')
      expect(html).toContain('Priya Sharma')
      expect(html).not.toContain('tel:')
      expect(html).not.toContain('mailto:')
      expect(html).not.toContain('<img')
      expect(separatorCount(html)).toBe(0)
    }
  })

  it('joins three contact items with exactly two separators, one item with none', () => {
    const three = buildSignatureHtml(
      {
        ...EMPTY,
        fullName: 'X',
        phone: '+91 98765 43210',
        email: 'x@y.in',
        website: 'https://y.in',
      },
      'classic',
      '#4B20DE',
    )
    expect(separatorCount(three.html)).toBe(2)
    const one = buildSignatureHtml(
      { ...EMPTY, fullName: 'X', phone: '+91 98765 43210' },
      'classic',
      '#4B20DE',
    )
    expect(separatorCount(one.html)).toBe(0)
  })

  it('omits the corporate accent rule when the contact column is empty', () => {
    const { html } = buildSignatureHtml(
      { ...EMPTY, fullName: 'Priya Sharma', jobTitle: 'Lead' },
      'corporate',
      '#4B20DE',
    )
    expect(html).not.toContain('width:3px')
    expect(html).toContain('Priya Sharma')
  })

  it('returns an empty string when every field is empty', () => {
    for (const template of TEMPLATES) {
      const { html, warnings } = buildSignatureHtml(EMPTY, template, '#4B20DE')
      expect(html).toBe('')
      expect(warnings).toEqual([])
    }
  })
})

describe('buildSignatureHtml — hrefs', () => {
  it('strips the tel: href to digits (and +) while displaying the formatted number', () => {
    const { html } = buildSignatureHtml(
      { ...EMPTY, fullName: 'X', phone: '+91 98765-43210' },
      'classic',
      '#4B20DE',
    )
    expect(html).toContain('href="tel:+919876543210"')
    expect(html).toContain('+91 98765-43210</a>')
  })

  it('forms a mailto: href for a valid address', () => {
    const { html } = buildSignatureHtml(
      { ...EMPTY, fullName: 'X', email: 'priya@scult.in' },
      'classic',
      '#4B20DE',
    )
    expect(html).toContain('href="mailto:priya@scult.in"')
  })

  it('shows an invalid email as plain text, with a warning and no mailto:', () => {
    const { html, warnings } = buildSignatureHtml(
      { ...EMPTY, fullName: 'X', email: 'not-an-email' },
      'classic',
      '#4B20DE',
    )
    expect(html).not.toContain('mailto:')
    expect(html).toContain('not-an-email')
    expect(warnings.some((w) => w.includes('mailto'))).toBe(true)
  })

  it('auto-prefixes a protocol-less website with https:// and flags it', () => {
    const { html, warnings } = buildSignatureHtml(
      { ...EMPTY, fullName: 'X', website: 'scult.in' },
      'classic',
      '#4B20DE',
    )
    expect(html).toContain('href="https://scult.in/"')
    expect(html).toContain('>scult.in</a>')
    expect(warnings.some((w) => w.includes('https:// was assumed'))).toBe(true)
  })

  it('drops an unparseable photo URL with a warning instead of a broken img', () => {
    const { html, warnings } = buildSignatureHtml(
      { ...EMPTY, fullName: 'X', photoUrl: 'http://' },
      'classic',
      '#4B20DE',
    )
    expect(html).not.toContain('<img')
    expect(warnings.some((w) => w.includes('photo'))).toBe(true)
  })
})

describe('buildSignatureHtml — accent colour', () => {
  it('rejects garbage and falls back to the default violet with a warning', () => {
    const { html, warnings } = buildSignatureHtml(
      { ...EMPTY, fullName: 'X', company: 'Y' },
      'classic',
      'not-a-color',
    )
    expect(html).toContain(DEFAULT_ACCENT)
    expect(warnings.some((w) => w.includes('not a valid hex colour'))).toBe(true)
  })

  it('accepts 3-digit shorthand and a missing # prefix', () => {
    expect(normalizeHexColor('#abc')).toBe('#aabbcc')
    expect(normalizeHexColor('4B20DE')).toBe('#4b20de')
    expect(normalizeHexColor('#ZZZZZZ')).toBeUndefined()
    expect(normalizeHexColor('')).toBeUndefined()
  })
})

/**
 * The component renders this markup with dangerouslySetInnerHTML, which is safe
 * only because of the escaping above. These tests close the loop by handing the
 * output to a real DOM parser — the same operation React performs — and asserting
 * that hostile input arrives as text nodes rather than elements. If escapeHtml
 * ever regresses, this fails rather than shipping an XSS.
 */
describe('preview safety — parsed by a real DOM', () => {
  it('renders hostile field values as literal text, never as markup', () => {
    const hostile: SignatureFields = {
      ...EMPTY,
      fullName: '<script>alert(1)</script>',
      jobTitle: `"><b>x`,
      company: '<img src=x onerror="alert(2)">',
    }
    const { html } = buildSignatureHtml(hostile, 'classic', '#4B20DE')

    const host = document.createElement('div')
    host.innerHTML = html

    expect(host.querySelector('script')).toBeNull()
    expect(host.querySelector('b')).toBeNull()
    expect(host.querySelector('img')).toBeNull()
    expect(host.querySelector('[onerror]')).toBeNull()

    const text = host.textContent ?? ''
    expect(text).toContain('<script>alert(1)</script>')
    expect(text).toContain(`"><b>x`)
    expect(text).toContain('<img src=x onerror="alert(2)">')
  })

  it('never produces an href outside http(s), mailto: and tel:', () => {
    const hostile: SignatureFields = {
      ...EMPTY,
      fullName: 'X',
      phone: '+91 98765 43210',
      email: 'x@y.in',
      website: 'javascript:alert(1)',
      linkedin: 'data:text/html,<script>alert(1)</script>',
      twitter: 'vbscript:msgbox(1)',
      github: 'https://github.com/you',
    }
    const { html } = buildSignatureHtml(hostile, 'corporate', '#4B20DE')

    const host = document.createElement('div')
    host.innerHTML = html

    const anchors = Array.from(host.querySelectorAll('a'))
    expect(anchors.length).toBe(3) // phone, email, GitHub — the other three dropped
    for (const anchor of anchors) {
      expect(['http:', 'https:', 'mailto:', 'tel:']).toContain(anchor.protocol)
    }
  })
})

describe('formatSignatureHtml — the source view', () => {
  /** Undo the only thing the formatter is allowed to add: newline + indent. */
  function unindent(pretty: string): string {
    return pretty.replace(/\n\s*/g, '')
  }

  it('only ever adds whitespace — every template round-trips exactly', () => {
    for (const template of TEMPLATES) {
      const { html } = buildSignatureHtml(FULL, template, '#4B20DE')
      const pretty = formatSignatureHtml(html)
      expect(pretty).not.toBe(html)
      expect(unindent(pretty)).toBe(html)
    }
  })

  it('gives every table, row and cell its own line, indented by nesting depth', () => {
    const pretty = formatSignatureHtml(
      buildSignatureHtml({ ...EMPTY, fullName: 'Priya Sharma' }, 'classic', '#4B20DE')
        .html,
    )
    const lines = pretty.split('\n')
    expect(lines[0]?.startsWith('<table')).toBe(true)
    expect(lines[1]).toBe('  <tr>')
    // The outer cell wraps a nested table, so that table is one level deeper.
    expect(lines.some((l) => l.startsWith('      <table'))).toBe(true)
    expect(lines.at(-1)).toBe('</table>')
    // No line carries two structural tags — that is the whole point of the view.
    for (const line of lines) {
      expect(line.split('<tr').length - 1).toBeLessThanOrEqual(1)
    }
  })

  it('keeps inline content on its cell line rather than exploding every tag', () => {
    const pretty = formatSignatureHtml(
      buildSignatureHtml(
        { ...EMPTY, fullName: 'X', phone: '+91 98765 43210', email: 'x@y.in' },
        'classic',
        '#4B20DE',
      ).html,
    )
    const contactLine = pretty.split('\n').find((l) => l.includes('mailto:'))
    expect(contactLine).toBeDefined()
    expect(contactLine).toContain('tel:')
    expect(contactLine).toContain('&#183;')
    expect(contactLine?.trimStart().startsWith('<a ')).toBe(true)
  })

  it('leaves escaped entities untouched, so the preview stays safe to render', () => {
    const hostile: SignatureFields = {
      ...EMPTY,
      fullName: '<script>alert(1)</script>',
      company: `"><b>x`,
    }
    const { html } = buildSignatureHtml(hostile, 'stacked', '#4B20DE')
    const pretty = formatSignatureHtml(html)
    expect(pretty).not.toContain('<script>')
    expect(pretty).not.toContain('<b>')
    expect(pretty).toContain('&lt;script&gt;')
    expect(pretty).toContain('&quot;&gt;&lt;b&gt;x')
    expect(unindent(pretty)).toBe(html)
  })

  it('returns an empty string for empty markup', () => {
    expect(formatSignatureHtml('')).toBe('')
  })
})

describe('helpers', () => {
  it('escapeHtml handles all five metacharacters without double-escaping', () => {
    expect(escapeHtml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&#39;')
    expect(escapeHtml('&amp;')).toBe('&amp;amp;')
  })

  it('telHref keeps only digits and the plus sign', () => {
    expect(telHref('+91 (98765) 43-210')).toBe('tel:+919876543210')
  })

  it('buildSignatureText mirrors the filled fields line by line', () => {
    const text = buildSignatureText(FULL)
    expect(text).toContain('Priya Sharma')
    expect(text).toContain('Marketing Lead')
    expect(text).toContain('+91 98765 43210')
    expect(text).toContain('LinkedIn: https://www.linkedin.com/in/priya-sharma')
    expect(text).not.toContain('Instagram')
    expect(buildSignatureText(EMPTY)).toBe('')
  })
})
