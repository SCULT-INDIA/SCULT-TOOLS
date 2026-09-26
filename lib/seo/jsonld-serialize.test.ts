import { describe, expect, it } from 'vitest'
import { serializeJsonLd } from './jsonld'

describe('serializeJsonLd', () => {
  it('cannot break out of the <script> tag it is embedded in', () => {
    const out = serializeJsonLd({ name: 'x</script><script>alert(1)</script>' })
    expect(out).not.toContain('</script>')
    expect(out).not.toContain('<')
    expect(out).not.toContain('>')
  })

  it('escapes the line separators an HTML script parser treats as line breaks', () => {
    const out = serializeJsonLd({ name: `a${String.fromCharCode(0x2028)}b` })
    expect(out).toContain('\\u2028')
    expect(out).not.toContain(String.fromCharCode(0x2028))
  })

  it('stays valid JSON that parses back to the same object', () => {
    const data = { title: 'Chase an <overdue> invoice & win', n: 1, nested: { ok: true } }
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data)
  })
})
