import { describe, expect, it } from 'vitest'
import {
  compareJson,
  formatBytes,
  formatJson,
  formatJsonPath,
  getAtPath,
  minifyJson,
  previewValue,
  repairJson,
  setAtPath,
  typeOfValue,
} from './logic'

describe('formatJson — formatting', () => {
  it('formats valid JSON with a 2-space indent by default', () => {
    const r = formatJson('{"a":1,"b":[2,3]}')
    expect(r.error).toBeUndefined()
    expect(r.output).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}')
  })

  it('honours a 4-space indent', () => {
    const r = formatJson('{"a":1}', { indent: 4 })
    expect(r.output).toBe('{\n    "a": 1\n}')
  })

  it('honours tab indentation', () => {
    const r = formatJson('{"a":1}', { indent: 'tab' })
    expect(r.output).toBe('{\n\t"a": 1\n}')
  })

  it('accepts a top-level scalar', () => {
    expect(formatJson('42').output).toBe('42')
    expect(formatJson('"hi"').output).toBe('"hi"')
    expect(formatJson('null').output).toBe('null')
  })

  it('preserves non-ASCII characters rather than escaping them', () => {
    expect(formatJson('{"n":"₹ café"}').output).toContain('₹ café')
  })
})

describe('minifyJson', () => {
  it('strips all insignificant whitespace', () => {
    const r = minifyJson('{\n  "a": 1,\n  "b": [ 2, 3 ]\n}')
    expect(r.error).toBeUndefined()
    expect(r.output).toBe('{"a":1,"b":[2,3]}')
  })

  it('reports errors the same way formatting does', () => {
    const broken = '{\n  "a": 1,\n}'
    expect(minifyJson(broken).errorLine).toBe(formatJson(broken).errorLine)
    expect(minifyJson(broken).error).toBeDefined()
  })

  it('round-trips: minifying a formatted document is idempotent', () => {
    const source = '{"z":1,"a":{"b":[1,2,{"c":3}]}}'
    const formatted = formatJson(source, { indent: 4 }).output
    expect(minifyJson(formatted).output).toBe(source)
  })
})

describe('formatJson — error location', () => {
  it('reports line AND column for a trailing comma', () => {
    // The offending token is the `}` on line 3: a trailing comma promises
    // another property that never arrives.
    const r = formatJson('{\n  "a": 1,\n}')
    expect(r.output).toBe('')
    expect(r.error).toBeDefined()
    expect(r.errorLine).toBe(3)
    expect(r.errorColumn).toBe(1)
    expect(r.errorSnippet).toBe('}')
  })

  it('reports line and column for an unquoted key', () => {
    const r = formatJson('{\n  a: 1\n}')
    expect(r.errorLine).toBe(2)
    expect(r.errorColumn).toBe(3)
    expect(r.errorSnippet).toBe('  a: 1')
  })

  it('reports line and column for a single-quoted string', () => {
    const r = formatJson("{'a': 1}")
    expect(r.errorLine).toBe(1)
    expect(r.errorColumn).toBe(2)
    expect(r.errorSnippet).toBe("{'a': 1}")
  })

  it('locates an error on a later line of a multi-line document', () => {
    const source = ['{', '  "a": 1,', '  "b": 2,', '  "c": 3', '  "d": 4', '}'].join('\n')
    const r = formatJson(source)
    // The parser only knows something is wrong once it reaches `"d"`, which is
    // the line after the missing comma — that is the honest location.
    expect(r.errorLine).toBe(5)
    expect(r.errorSnippet).toBe('  "d": 4')
  })

  it('strips the raw character offset out of the message it shows', () => {
    const r = formatJson('{\n  "a": 1,\n}')
    expect(r.error).not.toMatch(/position \d+/i)
    expect(r.error).not.toMatch(/line \d+ column \d+/i)
  })

  it('points at the end of the input when the document is truncated', () => {
    const r = formatJson('{"a": [1, 2')
    expect(r.error).toBeDefined()
    expect(r.errorLine).toBe(1)
    expect(r.errorColumn).toBeGreaterThan(1)
  })

  it('counts columns from the start of the line, not the start of the file', () => {
    const r = formatJson('{\n  "a": 1\n  "b": 2\n}')
    expect(r.errorLine).toBe(3)
    // Column 3 is the `"` of "b" — 3 into line 3, not 13 into the document.
    expect(r.errorColumn).toBe(3)
  })

  it('does not let a stray carriage return leak into the snippet', () => {
    const r = formatJson('{\r\n  "a": 1,\r\n}')
    expect(r.errorSnippet).toBe('}')
  })

  it('windows an absurdly long offending line instead of returning all of it', () => {
    const long = `{"pad":"${'x'.repeat(5000)}", 'bad': 1}`
    const r = formatJson(long)
    expect(r.error).toBeDefined()
    expect(r.errorSnippet).toBeDefined()
    expect((r.errorSnippet ?? '').length).toBeLessThanOrEqual(162)
  })
})

describe('formatJson — empty and oversized input', () => {
  it('treats empty input as not an error', () => {
    const r = formatJson('')
    expect(r.error).toBeUndefined()
    expect(r.output).toBe('')
    expect(r.stats).toBeUndefined()
  })

  it('treats whitespace-only input as not an error', () => {
    const r = formatJson('   \n\t  ')
    expect(r.error).toBeUndefined()
    expect(r.output).toBe('')
  })

  it('rejects input beyond the size ceiling instead of hanging', () => {
    const r = formatJson(`"${'a'.repeat(2_000_001)}"`)
    expect(r.error).toBeDefined()
    expect(r.output).toBe('')
  })

  it('never throws, whatever it is handed', () => {
    const junk = [
      '{',
      '[',
      '}',
      ']',
      ',',
      '{"a"',
      '{"a":}',
      'undefined',
      'NaN',
      '01',
      '{,}',
    ]
    for (const input of junk) {
      expect(() => formatJson(input)).not.toThrow()
      expect(formatJson(input).error).toBeDefined()
    }
  })
})

describe('formatJson — stats', () => {
  it('computes depth for nested structures', () => {
    expect(formatJson('5').stats?.depth).toBe(0)
    expect(formatJson('{}').stats?.depth).toBe(1)
    expect(formatJson('{"a":1}').stats?.depth).toBe(1)
    expect(formatJson('{"a":{"b":1}}').stats?.depth).toBe(2)
    expect(formatJson('{"a":{"b":{"c":[1]}}}').stats?.depth).toBe(4)
    expect(formatJson('[[[1]]]').stats?.depth).toBe(3)
  })

  it('takes the deepest branch, not the last one', () => {
    expect(formatJson('{"shallow":1,"deep":{"a":{"b":2}}}').stats?.depth).toBe(3)
    expect(formatJson('{"deep":{"a":{"b":2}},"shallow":1}').stats?.depth).toBe(3)
  })

  it('counts nested object keys, and does not count array indices as keys', () => {
    expect(formatJson('{"a":1,"b":2}').stats?.keys).toBe(2)
    expect(formatJson('{"a":{"b":1,"c":2}}').stats?.keys).toBe(3)
    expect(formatJson('[1,2,3]').stats?.keys).toBe(0)
    expect(formatJson('[{"a":1},{"b":2}]').stats?.keys).toBe(2)
  })

  it('reports the UTF-8 byte length of the output, not its character count', () => {
    // '₹' is three bytes in UTF-8; a naive .length would say 6 for {"a":"₹"}.
    const r = minifyJson('{"a":"₹"}')
    expect(r.output).toBe('{"a":"₹"}')
    expect(r.stats?.bytes).toBe(11)
  })

  it('measures the output, so minifying reports fewer bytes than formatting', () => {
    const source = '{"a":1,"b":[2,3]}'
    const min = minifyJson(source).stats?.bytes ?? 0
    const pretty = formatJson(source).stats?.bytes ?? 0
    expect(min).toBe(17)
    expect(pretty).toBeGreaterThan(min)
  })
})

describe('formatJson — key sorting', () => {
  it('sorts object keys when asked, and leaves them alone otherwise', () => {
    expect(formatJson('{"b":1,"a":2}', { sort: false }).output).toBe(
      '{\n  "b": 1,\n  "a": 2\n}',
    )
    expect(formatJson('{"b":1,"a":2}', { sort: true }).output).toBe(
      '{\n  "a": 2,\n  "b": 1\n}',
    )
  })

  it('sorts nested objects too', () => {
    const r = minifyJson('{"b":{"z":1,"y":2},"a":3}', { sort: true })
    expect(r.output).toBe('{"a":3,"b":{"y":2,"z":1}}')
  })

  it('never reorders array elements', () => {
    expect(minifyJson('[3,1,2]', { sort: true }).output).toBe('[3,1,2]')
    expect(minifyJson('[{"b":1,"a":2},{"a":3}]', { sort: true }).output).toBe(
      '[{"a":2,"b":1},{"a":3}]',
    )
  })

  it('is stable: sorting is idempotent and independent of input order', () => {
    const once = minifyJson('{"c":1,"a":2,"b":3}', { sort: true }).output
    const twice = minifyJson(once, { sort: true }).output
    expect(twice).toBe(once)
    expect(minifyJson('{"a":2,"b":3,"c":1}', { sort: true }).output).toBe(once)
    expect(minifyJson('{"b":3,"c":1,"a":2}', { sort: true }).output).toBe(once)
  })

  it('orders by code unit, so uppercase sorts before lowercase deterministically', () => {
    expect(minifyJson('{"b":1,"A":2,"a":3,"B":4}', { sort: true }).output).toBe(
      '{"A":2,"B":4,"a":3,"b":1}',
    )
  })
})

describe('formatBytes', () => {
  it('uses bytes below 1 KiB', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1023)).toBe('1023 B')
  })

  it('switches to KB and MB', () => {
    expect(formatBytes(1024)).toBe('1.00 KB')
    expect(formatBytes(20480)).toBe('20.0 KB')
    expect(formatBytes(1048576)).toBe('1.00 MB')
  })

  it('does not print a nonsense figure for invalid input', () => {
    expect(formatBytes(Number.NaN)).toBe('—')
    expect(formatBytes(-1)).toBe('—')
  })
})

describe('typeOfValue', () => {
  it('names every JSON value shape', () => {
    expect(typeOfValue(null)).toBe('null')
    expect(typeOfValue([1])).toBe('array')
    expect(typeOfValue({})).toBe('object')
    expect(typeOfValue('s')).toBe('string')
    expect(typeOfValue(1)).toBe('number')
    expect(typeOfValue(true)).toBe('boolean')
  })
})

describe('formatJsonPath', () => {
  it('renders identifier keys with dot notation', () => {
    expect(formatJsonPath(['a', 'b'])).toBe('$.a.b')
  })

  it('renders array indices in brackets', () => {
    expect(formatJsonPath(['items', 0, 'sku'])).toBe('$.items[0].sku')
  })

  it('brackets and quotes keys that are not valid identifiers', () => {
    expect(formatJsonPath(['a-b'])).toBe('$["a-b"]')
    expect(formatJsonPath(['2fast'])).toBe('$["2fast"]')
  })

  it('renders the root path as just "$"', () => {
    expect(formatJsonPath([])).toBe('$')
  })
})

describe('previewValue', () => {
  it('summarises containers by size, not contents', () => {
    expect(previewValue({})).toBe('{}')
    expect(previewValue({ a: 1 })).toBe('{1 key}')
    expect(previewValue({ a: 1, b: 2 })).toBe('{2 keys}')
    expect(previewValue([])).toBe('[]')
    expect(previewValue([1, 2, 3])).toBe('[3 items]')
  })

  it('renders scalars as their JSON literal', () => {
    expect(previewValue('hi')).toBe('"hi"')
    expect(previewValue(42)).toBe('42')
    expect(previewValue(true)).toBe('true')
    expect(previewValue(null)).toBe('null')
  })

  it('truncates long strings rather than printing them in full', () => {
    const long = previewValue('x'.repeat(200), 20)
    expect(long.length).toBeLessThanOrEqual(20)
    expect(long.endsWith('…"')).toBe(true)
  })
})

describe('getAtPath / setAtPath', () => {
  const doc = { a: { b: [1, 2, { c: 3 }] }, d: 'x' }

  it('reads a nested value by path', () => {
    expect(getAtPath(doc, ['a', 'b', 2, 'c'])).toBe(3)
    expect(getAtPath(doc, ['d'])).toBe('x')
    expect(getAtPath(doc, [])).toBe(doc)
  })

  it('returns undefined for a path that does not exist', () => {
    expect(getAtPath(doc, ['nope'])).toBeUndefined()
    expect(getAtPath(doc, ['a', 'b', 99])).toBeUndefined()
    expect(getAtPath(doc, ['d', 'x'])).toBeUndefined()
  })

  it('replaces a value at a path without mutating the original', () => {
    const next = setAtPath(doc, ['a', 'b', 2, 'c'], 99)
    expect(getAtPath(next, ['a', 'b', 2, 'c'])).toBe(99)
    expect(getAtPath(doc, ['a', 'b', 2, 'c'])).toBe(3)
  })

  it('leaves sibling subtrees referentially unchanged', () => {
    const next = setAtPath(doc, ['d'], 'y') as typeof doc
    expect(next.a).toBe(doc.a)
  })

  it('is a no-op for a path that does not resolve', () => {
    expect(setAtPath(doc, ['nope'], 1)).toBe(doc)
    expect(setAtPath(doc, ['a', 'b', 99], 1)).toBe(doc)
  })
})

describe('repairJson', () => {
  it('passes already-valid JSON straight through, unmarked as repaired', () => {
    const r = repairJson('{"a":1}')
    expect(r.error).toBeUndefined()
    expect(r.repaired).toBe(false)
  })

  it('fixes a trailing comma', () => {
    const r = repairJson('{"a": 1,}')
    expect(r.error).toBeUndefined()
    expect(r.repaired).toBe(true)
    expect(r.output).toBe('{\n  "a": 1\n}')
  })

  it('fixes single-quoted strings', () => {
    const r = repairJson("{'a': 'x'}")
    expect(r.error).toBeUndefined()
    expect(r.output).toBe('{\n  "a": "x"\n}')
  })

  it('fixes unquoted keys', () => {
    const r = repairJson('{a: 1, b: 2}')
    expect(r.error).toBeUndefined()
    expect(r.output).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })

  it('strips // and block comments', () => {
    const r = repairJson('{\n  // note\n  "a": 1 /* inline */\n}')
    expect(r.error).toBeUndefined()
    expect(r.output).toBe('{\n  "a": 1\n}')
  })

  it('does not touch // inside a string value', () => {
    const r = repairJson('{"url": "https://example.com"}')
    expect(r.error).toBeUndefined()
    expect(r.output).toContain('https://example.com')
  })

  it('does not touch a single quote inside a double-quoted string', () => {
    const r = repairJson('{"name": "O\'Brien"}')
    expect(r.error).toBeUndefined()
    expect(r.output).toContain("O'Brien")
  })

  it('handles several problems in the same document', () => {
    const r = repairJson(
      "{\n  name: 'Scult', // trailing comma below\n  active: true,\n}",
    )
    expect(r.error).toBeUndefined()
    expect(r.repaired).toBe(true)
    expect(JSON.parse(r.output)).toEqual({ name: 'Scult', active: true })
  })

  it('reports failure, still marked as an attempted repair, for unfixable input', () => {
    const r = repairJson('not json at all {{{')
    expect(r.error).toBeDefined()
    expect(r.repaired).toBe(true)
  })

  it('treats empty input as not an error', () => {
    expect(repairJson('').output).toBe('')
    expect(repairJson('').error).toBeUndefined()
  })
})

describe('compareJson', () => {
  it('reports no differences for identical documents', () => {
    const r = compareJson({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] })
    expect(r.identical).toBe(true)
    expect(r.entries).toHaveLength(0)
  })

  it('reports an added key', () => {
    const r = compareJson({ a: 1 }, { a: 1, b: 2 })
    expect(r.entries).toEqual([{ path: '$.b', kind: 'added', right: '2' }])
  })

  it('reports a removed key', () => {
    const r = compareJson({ a: 1, b: 2 }, { a: 1 })
    expect(r.entries).toEqual([{ path: '$.b', kind: 'removed', left: '2' }])
  })

  it('reports a changed scalar', () => {
    const r = compareJson({ a: 1 }, { a: 2 })
    expect(r.entries).toEqual([{ path: '$.a', kind: 'changed', left: '1', right: '2' }])
  })

  it('reports a type change as changed, not added+removed', () => {
    const r = compareJson({ a: 1 }, { a: '1' })
    expect(r.entries).toEqual([{ path: '$.a', kind: 'changed', left: '1', right: '"1"' }])
  })

  it('walks nested objects and arrays with a path per difference', () => {
    const r = compareJson({ items: [{ sku: 'A' }] }, { items: [{ sku: 'B' }] })
    expect(r.entries).toEqual([
      { path: '$.items[0].sku', kind: 'changed', left: '"A"', right: '"B"' },
    ])
  })

  it('diffs extra array elements as additions', () => {
    const r = compareJson([1, 2], [1, 2, 3])
    expect(r.entries).toEqual([{ path: '$[2]', kind: 'added', right: '3' }])
  })
})
