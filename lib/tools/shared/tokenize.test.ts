import { describe, expect, it } from 'vitest'
import { tokenizeHtml, tokenizeJson } from './tokenize'

/** Same property as the JSON roundtrip below — see the note there. */
function roundtripHtml(line: string): string {
  return tokenizeHtml(line)
    .map((t) => t.text)
    .join('')
}

function kindsOf(line: string): string[] {
  return tokenizeHtml(line).map((t) => t.kind)
}

describe('tokenizeHtml — lossless', () => {
  it('reproduces the input exactly across realistic email-signature markup', () => {
    const lines = [
      '<table role="presentation" cellpadding="0" cellspacing="0">',
      '  <tr>',
      '    <td style="padding:0 12px 0 0;vertical-align:top">',
      '      <img src="https://example.com/a.png" width="64" alt="" />',
      '    </td>',
      '  </tr>',
      '</table>',
      '<!-- a comment -->',
      'bare text with no tags at all',
      '<a href="mailto:x@y.z">x@y.z</a>',
      '',
      '   ',
      '<td',
      'value > 5 outside a tag',
      "<div class='single quoted'>",
      '<br/>',
    ]
    for (const line of lines) {
      expect(roundtripHtml(line)).toBe(line)
    }
  })

  it('never loses characters on unbalanced fragments', () => {
    // Formatted email HTML routinely breaks a tag across lines.
    for (const frag of ['<td style="a:b"', 'href="x">text', '-->', '<!--', '<', '>']) {
      expect(roundtripHtml(frag)).toBe(frag)
    }
  })

  it('terminates on pathological input instead of spinning', () => {
    for (const s of ['<<<<', '>>>>', '<=>', '< >', '<""">', "<'''>"]) {
      expect(roundtripHtml(s)).toBe(s)
    }
  })
})

describe('tokenizeHtml — classification', () => {
  it('marks the tag name, attribute names and quoted values distinctly', () => {
    const tokens = tokenizeHtml('<td style="color:red">')
    expect(tokens.find((t) => t.text === 'td')?.kind).toBe('tag')
    expect(tokens.find((t) => t.text === 'style')?.kind).toBe('attr')
    expect(tokens.find((t) => t.text === '"color:red"')?.kind).toBe('string')
  })

  it('treats a closing tag name as a tag', () => {
    expect(tokenizeHtml('</table>').find((t) => t.text === 'table')?.kind).toBe('tag')
  })

  it('classifies a whole comment as one comment token', () => {
    const tokens = tokenizeHtml('<!-- hi -->')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]?.kind).toBe('comment')
  })

  it('runs an unterminated comment to end of line rather than dropping it', () => {
    const tokens = tokenizeHtml('<!-- unterminated')
    expect(tokens).toHaveLength(1)
    expect(tokens[0]?.kind).toBe('comment')
    expect(tokens[0]?.text).toBe('<!-- unterminated')
  })

  it('does not treat a bare > in text content as a tag', () => {
    expect(kindsOf('5 > 3')).toEqual(['plain'])
  })

  it('handles single-quoted attribute values', () => {
    expect(tokenizeHtml("<div id='a'>").find((t) => t.text === "'a'")?.kind).toBe(
      'string',
    )
  })

  it('returns nothing for an empty line', () => {
    expect(tokenizeHtml('')).toEqual([])
  })
})

/**
 * The lossless-roundtrip property is the important one: CodePane renders these
 * tokens in sequence in place of the raw line, so if concatenating them did not
 * reproduce the input exactly, the pane would silently corrupt what it displays.
 */
function roundtrip(line: string): string {
  return tokenizeJson(line)
    .map((t) => t.text)
    .join('')
}

describe('tokenizeJson — lossless', () => {
  it('reproduces the input exactly for typical lines', () => {
    const lines = [
      '{',
      '  "name": "Scult",',
      '  "count": 15,',
      '  "nested": { "a": [1, 2, 3] }',
      '  "flag": true,',
      '  "missing": null',
      '}',
      '',
      '   ',
      '\t"tabbed": 1',
    ]
    for (const line of lines) expect(roundtrip(line)).toBe(line)
  })

  it('reproduces strings containing escapes and punctuation', () => {
    const line = String.raw`  "quote": "he said \"hi\", then {left}"`
    expect(roundtrip(line)).toBe(line)
  })

  it('reproduces unicode and emoji without splitting them', () => {
    const line = '  "emoji": "👍 नमस्ते"'
    expect(roundtrip(line)).toBe(line)
  })

  it('never throws and stays lossless on garbage input', () => {
    const junk = ['<<<>>>', '@@@', 'undefined', '{{{{', '"unterminated', '\\', '][']
    for (const line of junk) expect(roundtrip(line)).toBe(line)
  })
})

describe('tokenizeJson — classification', () => {
  it('marks a string followed by a colon as a key, not a string', () => {
    const tokens = tokenizeJson('  "name": "Scult"')
    const key = tokens.find((t) => t.text === '"name"')
    const value = tokens.find((t) => t.text === '"Scult"')
    expect(key?.kind).toBe('key')
    expect(value?.kind).toBe('string')
  })

  it('treats a string in an array as a value, not a key', () => {
    const tokens = tokenizeJson('  ["a", "b"]')
    expect(tokens.filter((t) => t.kind === 'key')).toHaveLength(0)
    expect(tokens.filter((t) => t.kind === 'string')).toHaveLength(2)
  })

  it('classifies numbers including negative, decimal and exponent forms', () => {
    for (const n of ['1', '-42', '3.14', '1e10', '2.5E-3', '-0.5e+7']) {
      const tokens = tokenizeJson(`  "v": ${n}`)
      const num = tokens.find((t) => t.kind === 'number')
      expect(num?.text, n).toBe(n)
    }
  })

  it('classifies literals', () => {
    expect(tokenizeJson('true').some((t) => t.kind === 'boolean')).toBe(true)
    expect(tokenizeJson('false').some((t) => t.kind === 'boolean')).toBe(true)
    expect(tokenizeJson('null').some((t) => t.kind === 'null')).toBe(true)
  })

  it('does not mistake a literal inside a string for a literal token', () => {
    const tokens = tokenizeJson('  "v": "true"')
    expect(tokens.some((t) => t.kind === 'boolean')).toBe(false)
    expect(tokens.some((t) => t.kind === 'string' && t.text === '"true"')).toBe(true)
  })

  it('marks structural characters as punctuation', () => {
    const tokens = tokenizeJson('{}[],:')
    expect(tokens.every((t) => t.kind === 'punct')).toBe(true)
    expect(tokens).toHaveLength(6)
  })

  it('handles a key whose colon is separated by spaces', () => {
    const tokens = tokenizeJson('  "spaced"   : 1')
    expect(tokens.find((t) => t.text === '"spaced"')?.kind).toBe('key')
  })

  it('returns no tokens for an empty line', () => {
    expect(tokenizeJson('')).toEqual([])
  })

  it('terminates on an unterminated string rather than looping', () => {
    const tokens = tokenizeJson('  "no closing quote')
    expect(tokens.length).toBeGreaterThan(0)
    expect(roundtrip('  "no closing quote')).toBe('  "no closing quote')
  })

  it('preserves leading indentation as its own token', () => {
    const tokens = tokenizeJson('    "a": 1')
    expect(tokens[0]?.text).toBe('    ')
  })
})
