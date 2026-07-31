import { describe, expect, it } from 'vitest'
import {
  buildSchema,
  EXAMPLE_VALUES,
  expandDayRange,
  isAbsoluteHttpUrl,
  isIsoDate,
  isIsoDateTime,
  isIsoDuration,
  SCHEMA_TYPES,
  type SchemaTypeId,
  wrapInScriptTag,
} from './logic'

const ALL_TYPES: readonly SchemaTypeId[] = SCHEMA_TYPES.map((t) => t.id)

describe('happy-path fixtures', () => {
  it('builds every example fixture with zero warnings', () => {
    // EXAMPLE_VALUES doubles as the component's defaults, so a warning here
    // would mean the first paint shows an amber panel on a pristine form.
    for (const type of ALL_TYPES) {
      const { warnings } = buildSchema(type, EXAMPLE_VALUES[type])
      expect(warnings, `${type} fixture should be warning-free`).toEqual([])
    }
  })

  it('produces JSON that round-trips to the same object for every type', () => {
    for (const type of ALL_TYPES) {
      const { jsonLd, json } = buildSchema(type, EXAMPLE_VALUES[type])
      expect(JSON.parse(json), type).toEqual(jsonLd)
    }
  })

  it('always includes @context and @type', () => {
    for (const type of ALL_TYPES) {
      const { jsonLd } = buildSchema(type, EXAMPLE_VALUES[type])
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe(type)
    }
  })

  it('nests Article author and publisher as typed entities', () => {
    const { jsonLd } = buildSchema('Article', EXAMPLE_VALUES.Article)
    expect(jsonLd.headline).toBe('How to Reduce Cart Abandonment: 12 Tactics That Work')
    expect(jsonLd.author).toEqual({
      '@type': 'Person',
      name: 'Asha Verma',
      url: 'https://example.com/authors/asha-verma',
    })
    expect(jsonLd.publisher).toMatchObject({
      '@type': 'Organization',
      name: 'Example Insights',
      logo: { '@type': 'ImageObject', url: 'https://example.com/logo.png' },
    })
  })

  it('emits a Product offer with numeric price and schema.org availability URL', () => {
    const { jsonLd } = buildSchema('Product', EXAMPLE_VALUES.Product)
    expect(jsonLd.offers).toEqual({
      '@type': 'Offer',
      price: 4999,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: 'https://example.com/products/atlas-trail',
    })
    expect(jsonLd.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.6,
      reviewCount: 128,
    })
  })

  it('expands LocalBusiness day ranges into explicit day lists', () => {
    const { jsonLd } = buildSchema('LocalBusiness', EXAMPLE_VALUES.LocalBusiness)
    const hours = jsonLd.openingHoursSpecification as Record<string, unknown>[]
    expect(hours).toHaveLength(2)
    expect(hours[0]?.dayOfWeek).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ])
    expect(hours[1]?.dayOfWeek).toEqual(['Saturday', 'Sunday'])
    expect(jsonLd.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 12.9784,
      longitude: 77.6408,
    })
    expect(jsonLd.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: '100 Feet Road',
      addressLocality: 'Bengaluru',
    })
  })

  it('numbers BreadcrumbList items and lets the final crumb omit its URL', () => {
    const { jsonLd, warnings } = buildSchema(
      'BreadcrumbList',
      EXAMPLE_VALUES.BreadcrumbList,
    )
    const items = jsonLd.itemListElement as Record<string, unknown>[]
    expect(items.map((i) => i.position)).toEqual([1, 2, 3])
    expect(items[0]?.item).toBe('https://example.com')
    expect(items[2]?.item).toBeUndefined()
    expect(warnings).toEqual([])
  })

  it('builds the WebSite sitelinks SearchAction from the search URL pattern', () => {
    const { jsonLd } = buildSchema('WebSite', EXAMPLE_VALUES.WebSite)
    expect(jsonLd.potentialAction).toEqual({
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    })
  })

  it('emits HowTo steps as HowToStep entities with name and text', () => {
    const { jsonLd } = buildSchema('HowTo', EXAMPLE_VALUES.HowTo)
    const steps = jsonLd.step as Record<string, unknown>[]
    expect(steps).toHaveLength(3)
    expect(steps[0]).toEqual({
      '@type': 'HowToStep',
      name: 'Add a CNAME record',
      text: 'In your DNS provider, create a CNAME record for www pointing at your host.',
    })
  })

  it('wraps Event location in a Place', () => {
    const { jsonLd } = buildSchema('Event', EXAMPLE_VALUES.Event)
    expect(jsonLd.location).toEqual({
      '@type': 'Place',
      name: 'WeWork Galaxy',
      address: '43 Residency Road, Bengaluru 560025',
    })
    expect(jsonLd.startDate).toBe('2026-08-15T18:30')
  })
})

describe('Google-required property warnings', () => {
  it('flags a missing Article image and datePublished by exact field name', () => {
    const values = { ...EXAMPLE_VALUES.Article, image: '', datePublished: '' }
    const { warnings } = buildSchema('Article', values)
    const fields = warnings.map((w) => w.field)
    expect(fields).toContain('Image URL')
    expect(fields).toContain('Date published')
  })

  it('flags a Product without a price', () => {
    const values = { ...EXAMPLE_VALUES.Product, price: '' }
    const { warnings, jsonLd } = buildSchema('Product', values)
    expect(warnings.map((w) => w.field)).toContain('Price')
    // No price means no offer at all — never an offer with an empty price.
    expect(jsonLd.offers).toBeUndefined()
  })

  it('flags a half-filled aggregateRating and omits it from the output', () => {
    const values = { ...EXAMPLE_VALUES.Product, reviewCount: '' }
    const { warnings, jsonLd } = buildSchema('Product', values)
    expect(warnings.map((w) => w.field)).toContain('Review count')
    expect(jsonLd.aggregateRating).toBeUndefined()
  })

  it('requires at least one HowTo step', () => {
    const values = { ...EXAMPLE_VALUES.HowTo, steps: [] }
    const { warnings } = buildSchema('HowTo', values)
    expect(warnings.map((w) => w.field)).toContain('Steps')
  })

  it('warns on a single-crumb breadcrumb trail', () => {
    const values = { crumbs: [{ name: 'Home', url: 'https://example.com' }] }
    const { warnings } = buildSchema('BreadcrumbList', values)
    expect(
      warnings.some((w) => w.field === 'Breadcrumb trail' && /two/.test(w.message)),
    ).toBe(true)
  })

  it('warns when a non-final crumb omits its URL, naming the row', () => {
    const values = {
      crumbs: [
        { name: 'Home', url: '' },
        { name: 'Blog', url: 'https://example.com/blog' },
      ],
    }
    const { warnings } = buildSchema('BreadcrumbList', values)
    expect(warnings.map((w) => w.field)).toContain('Crumb 1 · URL')
  })
})

describe('format validation', () => {
  it('warns on relative URLs where absolute ones are required', () => {
    const values = { ...EXAMPLE_VALUES.Article, image: 'images/cover.jpg' }
    const { warnings } = buildSchema('Article', values)
    const warning = warnings.find((w) => w.field === 'Image URL')
    expect(warning?.message).toMatch(/absolute URL/)
  })

  it('validates absolute http(s) URLs strictly', () => {
    expect(isAbsoluteHttpUrl('https://example.com/a?b=c')).toBe(true)
    expect(isAbsoluteHttpUrl('http://example.com')).toBe(true)
    expect(isAbsoluteHttpUrl('/images/cover.jpg')).toBe(false)
    expect(isAbsoluteHttpUrl('example.com/page')).toBe(false)
    expect(isAbsoluteHttpUrl('ftp://example.com/file')).toBe(false)
  })

  it('accepts only real ISO dates', () => {
    expect(isIsoDate('2026-07-29')).toBe(true)
    expect(isIsoDate('29-07-2026')).toBe(false)
    expect(isIsoDate('2026-7-1')).toBe(false)
    expect(isIsoDate('2026-02-30')).toBe(false) // not a real calendar day
  })

  it('accepts ISO date-times with optional seconds and offset', () => {
    expect(isIsoDateTime('2026-08-15')).toBe(true)
    expect(isIsoDateTime('2026-08-15T19:30')).toBe(true)
    expect(isIsoDateTime('2026-08-15T19:30:00+05:30')).toBe(true)
    expect(isIsoDateTime('15/08/2026 7pm')).toBe(false)
  })

  it('warns on a malformed datePublished, naming the field', () => {
    const values = { ...EXAMPLE_VALUES.Article, datePublished: '01-07-2026' }
    const { warnings } = buildSchema('Article', values)
    const warning = warnings.find((w) => w.field === 'Date published')
    expect(warning?.message).toMatch(/ISO 8601/)
  })

  it('validates ISO 8601 durations for HowTo totalTime', () => {
    expect(isIsoDuration('PT20M')).toBe(true)
    expect(isIsoDuration('PT1H30M')).toBe(true)
    expect(isIsoDuration('P1D')).toBe(true)
    expect(isIsoDuration('20 minutes')).toBe(false)
    const values = { ...EXAMPLE_VALUES.HowTo, totalTime: '20 minutes' }
    const { warnings } = buildSchema('HowTo', values)
    expect(warnings.map((w) => w.field)).toContain('Total time')
  })

  it('warns when the WebSite search URL lacks the query placeholder', () => {
    const values = { ...EXAMPLE_VALUES.WebSite, searchUrl: 'https://example.com/search' }
    const { warnings } = buildSchema('WebSite', values)
    expect(
      warnings.some(
        (w) =>
          w.field === 'Search results URL pattern' &&
          w.message.includes('{search_term_string}'),
      ),
    ).toBe(true)
  })

  it('warns when an Event ends before it starts', () => {
    const values = {
      ...EXAMPLE_VALUES.Event,
      startDate: '2026-08-15T21:00',
      endDate: '2026-08-15T18:30',
    }
    const { warnings } = buildSchema('Event', values)
    expect(warnings.map((w) => w.field)).toContain('End date & time')
  })
})

describe('empty-optional omission', () => {
  it('drops empty optional properties instead of emitting empty strings', () => {
    const values = {
      ...EXAMPLE_VALUES.Article,
      description: '',
      dateModified: '',
      publisherName: '',
    }
    const { jsonLd, json } = buildSchema('Article', values)
    expect('description' in jsonLd).toBe(false)
    expect('dateModified' in jsonLd).toBe(false)
    expect('publisher' in jsonLd).toBe(false)
    expect(json).not.toContain('""')
  })

  it('drops blank repeatable rows entirely', () => {
    const values = {
      ...EXAMPLE_VALUES.Organization,
      sameAs: [{ url: 'https://x.com/example' }, { url: '   ' }, { url: '' }],
    }
    const { jsonLd } = buildSchema('Organization', values)
    expect(jsonLd.sameAs).toEqual(['https://x.com/example'])
  })

  it('never throws on completely empty values and still returns valid JSON', () => {
    for (const type of ALL_TYPES) {
      const result = buildSchema(type, {})
      expect(result.warnings.length, type).toBeGreaterThan(0)
      expect(JSON.parse(result.json)).toEqual({
        '@context': 'https://schema.org',
        '@type': type,
      })
    }
  })
})

describe('helpers', () => {
  it('expands day ranges including wrap-around past Sunday', () => {
    expect(expandDayRange('Monday', 'Friday')).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ])
    expect(expandDayRange('Friday', 'Monday')).toEqual([
      'Friday',
      'Saturday',
      'Sunday',
      'Monday',
    ])
    expect(expandDayRange('Wednesday', 'Wednesday')).toEqual(['Wednesday'])
    expect(expandDayRange('Blursday', 'Friday')).toEqual([])
  })

  it('escapes </ in the script wrapper so values cannot break out of the element', () => {
    const json = JSON.stringify({ name: 'sneaky </script> value' })
    const wrapped = wrapInScriptTag(json)
    expect(wrapped.startsWith('<script type="application/ld+json">')).toBe(true)
    expect(wrapped.endsWith('</script>')).toBe(true)
    // The payload's </script> is escaped; the only raw one left is the wrapper's own.
    expect(wrapped).toContain('<\\/script>')
    expect(wrapped.split('</script>')).toHaveLength(2)
  })
})
