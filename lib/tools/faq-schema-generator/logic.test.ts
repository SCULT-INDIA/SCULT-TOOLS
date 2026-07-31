import { describe, expect, it } from 'vitest'
import { ANSWER_SOFT_LIMIT, buildFaqSchema, escapeHtml } from './logic'

const PAIRS = [
  {
    question: 'How long does SEO take to show results?',
    answer: 'Expect 3-6 months before rankings move meaningfully.',
  },
  {
    question: 'How much does a website cost in India?',
    answer: 'A small-business brochure site typically runs Rs 30,000 to Rs 1,00,000.',
  },
] as const

describe('buildFaqSchema — happy path', () => {
  it('builds a schema.org FAQPage with one Question per complete pair', () => {
    const r = buildFaqSchema(PAIRS)
    expect(r.jsonLd['@context']).toBe('https://schema.org')
    expect(r.jsonLd['@type']).toBe('FAQPage')
    expect(r.jsonLd.mainEntity).toHaveLength(2)
    expect(r.jsonLd.mainEntity[0]?.['@type']).toBe('Question')
    expect(r.jsonLd.mainEntity[0]?.name).toBe(PAIRS[0].question)
    expect(r.jsonLd.mainEntity[0]?.acceptedAnswer).toEqual({
      '@type': 'Answer',
      text: PAIRS[0].answer,
    })
  })

  it('preserves the row order the user arranged', () => {
    const r = buildFaqSchema([...PAIRS].reverse())
    expect(r.jsonLd.mainEntity.map((q) => q.name)).toEqual([
      PAIRS[1].question,
      PAIRS[0].question,
    ])
  })

  it('raises no warnings for two clean pairs', () => {
    expect(buildFaqSchema(PAIRS).warnings).toEqual([])
  })

  it('trims questions and answers before they enter the schema', () => {
    const r = buildFaqSchema([
      { question: '  What is FAQPage schema?  ', answer: '\n Structured data. \n' },
      PAIRS[1],
    ])
    expect(r.jsonLd.mainEntity[0]?.name).toBe('What is FAQPage schema?')
    expect(r.jsonLd.mainEntity[0]?.acceptedAnswer.text).toBe('Structured data.')
  })
})

describe('buildFaqSchema — JSON output', () => {
  it('round-trips: parsing the json string recreates the jsonLd object exactly', () => {
    const withMarkup = [
      { question: 'Can I use <em>tags</em> & "quotes"?', answer: 'Yes — <b>some</b>.' },
      PAIRS[1],
    ]
    const r = buildFaqSchema(withMarkup)
    expect(JSON.parse(r.json)).toEqual(r.jsonLd)
  })

  it('escapes < so a closing script tag in an answer cannot break the script element', () => {
    const r = buildFaqSchema([
      { question: 'Is this safe?', answer: 'Try </script><script>alert("x")</script>' },
      PAIRS[1],
    ])
    expect(r.json).not.toContain('<')
    expect(r.json).toContain('\\u003c/script>')
  })
})

describe('buildFaqSchema — HTML output', () => {
  it('emits a details/summary block per pair followed by the JSON-LD script tag', () => {
    const r = buildFaqSchema(PAIRS)
    expect(r.html.match(/<details>/g)).toHaveLength(2)
    expect(r.html).toContain(`<summary>${PAIRS[0].question}</summary>`)
    expect(r.html).toContain('<script type="application/ld+json">')
    expect(r.html.indexOf('</section>')).toBeLessThan(r.html.indexOf('<script'))
  })

  it('never carries unescaped input — a script tag in a question is neutralised', () => {
    const q = '<script>alert("hi")</script> & \'quotes\'?'
    const r = buildFaqSchema([
      { question: q, answer: 'An answer with <b>bold</b>.' },
      PAIRS[1],
    ])
    expect(r.html).not.toContain('<script>alert')
    expect(r.html).not.toContain('<b>')
    expect(r.html).toContain(
      '&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt; &amp; &#39;quotes&#39;?',
    )
    expect(r.html).toContain('&lt;b&gt;bold&lt;/b&gt;')
  })

  it('turns blank lines in an answer into separate paragraphs', () => {
    const r = buildFaqSchema([
      { question: 'Multi paragraph?', answer: 'First part.\n\nSecond part.' },
      PAIRS[1],
    ])
    expect(r.html).toContain('<p>First part.</p>')
    expect(r.html).toContain('<p>Second part.</p>')
  })

  it('returns an empty html string when no pair is complete', () => {
    expect(buildFaqSchema([{ question: '', answer: '' }]).html).toBe('')
  })
})

describe('buildFaqSchema — row skipping and warnings', () => {
  it('skips fully-empty rows silently', () => {
    const r = buildFaqSchema([
      PAIRS[0],
      { question: '', answer: '' },
      { question: '   ', answer: '\n\t' },
      PAIRS[1],
    ])
    expect(r.jsonLd.mainEntity).toHaveLength(2)
    expect(r.warnings).toEqual([])
  })

  it('leaves out a row with an answer but no question, and names the row', () => {
    const r = buildFaqSchema([
      PAIRS[0],
      { question: '  ', answer: 'Orphan answer.' },
      PAIRS[1],
    ])
    expect(r.jsonLd.mainEntity).toHaveLength(2)
    expect(r.warnings.join(' ')).toContain('Question 2 is empty')
  })

  it('leaves out a row with a question but no answer, and names the row', () => {
    const r = buildFaqSchema([
      PAIRS[0],
      PAIRS[1],
      { question: 'Unanswered?', answer: ' ' },
    ])
    expect(r.jsonLd.mainEntity).toHaveLength(2)
    expect(r.warnings.join(' ')).toContain('Question 3')
    expect(r.warnings.join(' ')).toContain('no answer')
  })

  it('warns when fewer than two complete pairs remain', () => {
    const one = buildFaqSchema([PAIRS[0]])
    expect(one.warnings.join(' ')).toContain('at least two')
    expect(buildFaqSchema(PAIRS).warnings.join(' ')).not.toContain('at least two')
  })

  it('warns about an answer past the truncation limit but still includes it', () => {
    const long = 'a'.repeat(ANSWER_SOFT_LIMIT + 1)
    const r = buildFaqSchema([{ question: 'Long one?', answer: long }, PAIRS[1]])
    expect(r.jsonLd.mainEntity).toHaveLength(2)
    expect(r.warnings.join(' ')).toContain('truncates')
    expect(buildFaqSchema(PAIRS).warnings.join(' ')).not.toContain('truncates')
  })

  it('never throws on an empty input array and still returns a valid shell', () => {
    const r = buildFaqSchema([])
    expect(r.jsonLd.mainEntity).toEqual([])
    expect(JSON.parse(r.json)).toEqual(r.jsonLd)
    expect(r.warnings).toEqual([])
  })
})

describe('buildFaqSchema — duplicate detection', () => {
  it('flags duplicates case-insensitively and whitespace-insensitively, naming both rows', () => {
    const r = buildFaqSchema([
      { question: 'What is  SEO?', answer: 'Search engine optimisation.' },
      PAIRS[1],
      { question: '  what   is seo?', answer: 'A different answer.' },
    ])
    expect(r.warnings.join(' ')).toContain('Questions 1 and 3 are the same question')
  })

  it('does not flag questions that merely share a prefix', () => {
    const r = buildFaqSchema([
      { question: 'What is SEO?', answer: 'One.' },
      { question: 'What is SEO auditing?', answer: 'Two.' },
    ])
    expect(r.warnings).toEqual([])
  })
})

describe('escapeHtml', () => {
  it('escapes all five HTML-significant characters', () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
      '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;',
    )
  })
})
