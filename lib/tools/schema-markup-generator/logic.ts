/**
 * JSON-LD schema markup construction and validation.
 *
 * Purpose
 *   Turn a flat map of form values into a valid JSON-LD object for the nine
 *   schema.org types people actually generate markup for, plus a list of
 *   advisory warnings covering Google's rich-result requirements.
 *
 * Inputs   a SchemaTypeId and a SchemaValues map (strings for scalar fields,
 *          row arrays for repeatable fields). Keys come from SCHEMA_TYPES.
 * Outputs  a SchemaResult: the JSON-LD object, its pretty-printed JSON, and
 *          field-named warnings. Warnings never block output — the user sees
 *          exactly what their current input produces.
 * Failure  never throws. Empty and half-typed values are the normal case
 *          (the caller rebuilds on every keystroke); empty optionals are
 *          dropped from the output entirely rather than emitted as "".
 *
 * No React, no DOM, no I/O — pure functions, unit-tested in logic.test.ts.
 */

export type SchemaTypeId =
  | 'Article'
  | 'Organization'
  | 'LocalBusiness'
  | 'Product'
  | 'Person'
  | 'Event'
  | 'WebSite'
  | 'BreadcrumbList'
  | 'HowTo'

/** How a scalar field is edited and validated. */
export type ScalarKind =
  | 'text'
  | 'textarea'
  | 'url'
  | 'date'
  | 'datetime'
  | 'time'
  | 'number'
  | 'select'

export interface SelectOption {
  readonly value: string
  readonly label: string
}

export interface ScalarFieldSpec {
  readonly key: string
  readonly label: string
  readonly kind: ScalarKind
  /** True when Google's rich-result documentation requires the property. */
  readonly required: boolean
  /** Form section heading. Consecutive fields with the same group share a fieldset. */
  readonly group: string
  readonly placeholder: string
  readonly hint?: string
  readonly options?: readonly SelectOption[]
}

export interface RepeatItemFieldSpec {
  readonly key: string
  readonly label: string
  readonly kind: ScalarKind
  readonly required?: boolean
  readonly placeholder: string
  readonly options?: readonly SelectOption[]
}

export interface RepeatFieldSpec {
  readonly key: string
  readonly label: string
  readonly kind: 'repeat'
  readonly required: boolean
  readonly group: string
  /** Singular noun for one row: "Step", "Crumb", "Profile URL". */
  readonly itemLabel: string
  readonly addLabel: string
  readonly hint?: string
  readonly itemFields: readonly RepeatItemFieldSpec[]
}

export type FieldSpec = ScalarFieldSpec | RepeatFieldSpec

export interface SchemaTypeSpec {
  readonly id: SchemaTypeId
  readonly label: string
  /** One-line "use this when" shown under the type selector. */
  readonly blurb: string
  readonly fields: readonly FieldSpec[]
}

export type RepeatRow = Readonly<Record<string, string>>
export type FieldValue = string | readonly RepeatRow[]
export type SchemaValues = Readonly<Record<string, FieldValue>>

export interface SchemaWarning {
  /** The exact field (or row) the warning concerns, e.g. `Image URL` or `Step 2 · Instruction`. */
  readonly field: string
  readonly message: string
}

export interface SchemaResult {
  readonly jsonLd: Record<string, unknown>
  /** `JSON.stringify(jsonLd, null, 2)` — what the <pre> shows. */
  readonly json: string
  readonly warnings: readonly SchemaWarning[]
}

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

const DAY_OPTIONS: readonly SelectOption[] = DAYS.map((d) => ({ value: d, label: d }))

const AVAILABILITY_OPTIONS: readonly SelectOption[] = [
  { value: 'InStock', label: 'In stock' },
  { value: 'OutOfStock', label: 'Out of stock' },
  { value: 'PreOrder', label: 'Pre-order' },
  { value: 'BackOrder', label: 'Back-order' },
]

/**
 * The spec table. `required` mirrors Google's rich-result documentation, not
 * schema.org (where almost everything is optional) — that distinction is the
 * whole point of the warnings panel.
 */
export const SCHEMA_TYPES: readonly SchemaTypeSpec[] = [
  {
    id: 'Article',
    label: 'Article',
    blurb: 'Blog posts and news stories — headline, image and dates drive eligibility.',
    fields: [
      {
        key: 'name',
        label: 'Headline',
        kind: 'text',
        required: true,
        group: 'Basics',
        placeholder: 'How to Reduce Cart Abandonment: 12 Tactics That Work',
      },
      {
        key: 'description',
        label: 'Description',
        kind: 'textarea',
        required: false,
        group: 'Basics',
        placeholder: 'A short summary of the article…',
      },
      {
        key: 'url',
        label: 'Article URL',
        kind: 'url',
        required: false,
        group: 'Basics',
        placeholder: 'https://example.com/blog/cart-abandonment',
      },
      {
        key: 'image',
        label: 'Image URL',
        kind: 'url',
        required: true,
        group: 'Basics',
        placeholder: 'https://example.com/images/cover.jpg',
        hint: 'Google wants a high-resolution image; 1200px+ wide works best.',
      },
      {
        key: 'datePublished',
        label: 'Date published',
        kind: 'date',
        required: true,
        group: 'Dates',
        placeholder: '2026-07-01',
      },
      {
        key: 'dateModified',
        label: 'Date modified',
        kind: 'date',
        required: false,
        group: 'Dates',
        placeholder: '2026-07-20',
      },
      {
        key: 'authorName',
        label: 'Author name',
        kind: 'text',
        required: true,
        group: 'Attribution',
        placeholder: 'Asha Verma',
      },
      {
        key: 'authorUrl',
        label: 'Author profile URL',
        kind: 'url',
        required: false,
        group: 'Attribution',
        placeholder: 'https://example.com/authors/asha-verma',
      },
      {
        key: 'publisherName',
        label: 'Publisher name',
        kind: 'text',
        required: false,
        group: 'Attribution',
        placeholder: 'Example Insights',
      },
      {
        key: 'publisherLogo',
        label: 'Publisher logo URL',
        kind: 'url',
        required: false,
        group: 'Attribution',
        placeholder: 'https://example.com/logo.png',
      },
    ],
  },
  {
    id: 'Organization',
    label: 'Organization',
    blurb: 'Company identity — feeds the knowledge panel and logo in search.',
    fields: [
      {
        key: 'name',
        label: 'Organization name',
        kind: 'text',
        required: true,
        group: 'Basics',
        placeholder: 'Example Software Pvt Ltd',
      },
      {
        key: 'url',
        label: 'Website URL',
        kind: 'url',
        required: true,
        group: 'Basics',
        placeholder: 'https://example.com',
      },
      {
        key: 'logo',
        label: 'Logo URL',
        kind: 'url',
        required: true,
        group: 'Basics',
        placeholder: 'https://example.com/logo.png',
        hint: 'Google requires a crawlable logo for the logo rich result.',
      },
      {
        key: 'description',
        label: 'Description',
        kind: 'textarea',
        required: false,
        group: 'Basics',
        placeholder: 'What the organization does, in a sentence or two…',
      },
      {
        key: 'email',
        label: 'Contact email',
        kind: 'text',
        required: false,
        group: 'Contact',
        placeholder: 'hello@example.com',
      },
      {
        key: 'telephone',
        label: 'Telephone',
        kind: 'text',
        required: false,
        group: 'Contact',
        placeholder: '+91 98765 43210',
      },
      {
        key: 'sameAs',
        label: 'Social profiles (sameAs)',
        kind: 'repeat',
        required: false,
        group: 'Profiles',
        itemLabel: 'Profile URL',
        addLabel: 'Add profile URL',
        hint: 'LinkedIn, X, Instagram, Wikipedia — anywhere this entity officially lives.',
        itemFields: [
          {
            key: 'url',
            label: 'Profile URL',
            kind: 'url',
            placeholder: 'https://www.linkedin.com/company/example',
          },
        ],
      },
    ],
  },
  {
    id: 'LocalBusiness',
    label: 'Local Business',
    blurb: 'Shops, restaurants, clinics — address and hours power the local pack.',
    fields: [
      {
        key: 'name',
        label: 'Business name',
        kind: 'text',
        required: true,
        group: 'Basics',
        placeholder: 'Blue Leaf Coffee — Indiranagar',
      },
      {
        key: 'image',
        label: 'Image URL',
        kind: 'url',
        required: true,
        group: 'Basics',
        placeholder: 'https://example.com/images/storefront.jpg',
      },
      {
        key: 'url',
        label: 'Website URL',
        kind: 'url',
        required: false,
        group: 'Basics',
        placeholder: 'https://example.com',
      },
      {
        key: 'telephone',
        label: 'Telephone',
        kind: 'text',
        required: false,
        group: 'Basics',
        placeholder: '+91 80 4111 2222',
      },
      {
        key: 'priceRange',
        label: 'Price range',
        kind: 'text',
        required: false,
        group: 'Basics',
        placeholder: '₹₹',
        hint: 'Relative cost, usually ₹ to ₹₹₹₹ (or $ to $$$$).',
      },
      {
        key: 'streetAddress',
        label: 'Street address',
        kind: 'text',
        required: true,
        group: 'Address',
        placeholder: '100 Feet Road',
      },
      {
        key: 'addressLocality',
        label: 'City',
        kind: 'text',
        required: true,
        group: 'Address',
        placeholder: 'Bengaluru',
      },
      {
        key: 'addressRegion',
        label: 'State / region',
        kind: 'text',
        required: false,
        group: 'Address',
        placeholder: 'Karnataka',
      },
      {
        key: 'postalCode',
        label: 'Postal code',
        kind: 'text',
        required: false,
        group: 'Address',
        placeholder: '560038',
      },
      {
        key: 'addressCountry',
        label: 'Country code',
        kind: 'text',
        required: false,
        group: 'Address',
        placeholder: 'IN',
        hint: 'Two-letter ISO 3166 code: IN, US, GB…',
      },
      {
        key: 'latitude',
        label: 'Latitude',
        kind: 'number',
        required: false,
        group: 'Map location',
        placeholder: '12.9784',
      },
      {
        key: 'longitude',
        label: 'Longitude',
        kind: 'number',
        required: false,
        group: 'Map location',
        placeholder: '77.6408',
      },
      {
        key: 'openingHours',
        label: 'Opening hours',
        kind: 'repeat',
        required: false,
        group: 'Opening hours',
        itemLabel: 'Hours',
        addLabel: 'Add opening hours',
        hint: 'One row per pattern — e.g. Monday–Friday 08:00–22:00, then a weekend row.',
        itemFields: [
          {
            key: 'dayFrom',
            label: 'From day',
            kind: 'select',
            placeholder: 'Monday',
            options: DAY_OPTIONS,
          },
          {
            key: 'dayTo',
            label: 'To day',
            kind: 'select',
            placeholder: 'Friday',
            options: DAY_OPTIONS,
          },
          { key: 'opens', label: 'Opens', kind: 'time', placeholder: '08:00' },
          { key: 'closes', label: 'Closes', kind: 'time', placeholder: '22:00' },
        ],
      },
    ],
  },
  {
    id: 'Product',
    label: 'Product',
    blurb: 'Anything sold — price, availability and ratings show in the snippet.',
    fields: [
      {
        key: 'name',
        label: 'Product name',
        kind: 'text',
        required: true,
        group: 'Basics',
        placeholder: 'Atlas Trail Running Shoes',
      },
      {
        key: 'image',
        label: 'Image URL',
        kind: 'url',
        required: true,
        group: 'Basics',
        placeholder: 'https://example.com/images/atlas-trail.jpg',
      },
      {
        key: 'description',
        label: 'Description',
        kind: 'textarea',
        required: false,
        group: 'Basics',
        placeholder: 'What the product is and who it is for…',
      },
      {
        key: 'brand',
        label: 'Brand',
        kind: 'text',
        required: false,
        group: 'Identifiers',
        placeholder: 'Atlas',
      },
      {
        key: 'sku',
        label: 'SKU',
        kind: 'text',
        required: false,
        group: 'Identifiers',
        placeholder: 'ATL-TR-42',
      },
      {
        key: 'gtin',
        label: 'GTIN / barcode',
        kind: 'text',
        required: false,
        group: 'Identifiers',
        placeholder: '8901234567890',
      },
      {
        key: 'price',
        label: 'Price',
        kind: 'number',
        required: true,
        group: 'Offer',
        placeholder: '4999',
        hint: 'Number only, no currency symbol — the currency goes in the next field.',
      },
      {
        key: 'priceCurrency',
        label: 'Currency code',
        kind: 'text',
        required: true,
        group: 'Offer',
        placeholder: 'INR',
        hint: 'Three-letter ISO 4217 code: INR, USD, EUR…',
      },
      {
        key: 'availability',
        label: 'Availability',
        kind: 'select',
        required: false,
        group: 'Offer',
        placeholder: 'In stock',
        options: AVAILABILITY_OPTIONS,
      },
      {
        key: 'offerUrl',
        label: 'Product page URL',
        kind: 'url',
        required: false,
        group: 'Offer',
        placeholder: 'https://example.com/products/atlas-trail',
      },
      {
        key: 'ratingValue',
        label: 'Average rating',
        kind: 'number',
        required: false,
        group: 'Reviews',
        placeholder: '4.6',
      },
      {
        key: 'reviewCount',
        label: 'Review count',
        kind: 'number',
        required: false,
        group: 'Reviews',
        placeholder: '128',
      },
    ],
  },
  {
    id: 'Person',
    label: 'Person',
    blurb: 'Author pages and team bios — link the person to their profiles.',
    fields: [
      {
        key: 'name',
        label: 'Full name',
        kind: 'text',
        required: true,
        group: 'Basics',
        placeholder: 'Asha Verma',
      },
      {
        key: 'jobTitle',
        label: 'Job title',
        kind: 'text',
        required: false,
        group: 'Basics',
        placeholder: 'Head of Growth',
      },
      {
        key: 'worksFor',
        label: 'Works for (organization)',
        kind: 'text',
        required: false,
        group: 'Basics',
        placeholder: 'Example Software',
      },
      {
        key: 'url',
        label: 'Profile page URL',
        kind: 'url',
        required: false,
        group: 'Links',
        placeholder: 'https://example.com/team/asha-verma',
      },
      {
        key: 'image',
        label: 'Photo URL',
        kind: 'url',
        required: false,
        group: 'Links',
        placeholder: 'https://example.com/images/asha.jpg',
      },
      {
        key: 'email',
        label: 'Email',
        kind: 'text',
        required: false,
        group: 'Links',
        placeholder: 'asha@example.com',
      },
      {
        key: 'sameAs',
        label: 'Social profiles (sameAs)',
        kind: 'repeat',
        required: false,
        group: 'Profiles',
        itemLabel: 'Profile URL',
        addLabel: 'Add profile URL',
        itemFields: [
          {
            key: 'url',
            label: 'Profile URL',
            kind: 'url',
            placeholder: 'https://www.linkedin.com/in/ashaverma',
          },
        ],
      },
    ],
  },
  {
    id: 'Event',
    label: 'Event',
    blurb: 'Meetups, concerts, webinars — dates and venue are what Google requires.',
    fields: [
      {
        key: 'name',
        label: 'Event name',
        kind: 'text',
        required: true,
        group: 'Basics',
        placeholder: 'Bengaluru SaaS Meetup — August 2026',
      },
      {
        key: 'description',
        label: 'Description',
        kind: 'textarea',
        required: false,
        group: 'Basics',
        placeholder: 'What happens at the event…',
      },
      {
        key: 'url',
        label: 'Event page URL',
        kind: 'url',
        required: false,
        group: 'Basics',
        placeholder: 'https://example.com/events/saas-meetup-aug',
      },
      {
        key: 'image',
        label: 'Image URL',
        kind: 'url',
        required: false,
        group: 'Basics',
        placeholder: 'https://example.com/images/meetup.jpg',
      },
      {
        key: 'startDate',
        label: 'Start date & time',
        kind: 'datetime',
        required: true,
        group: 'When',
        placeholder: '2026-08-15T18:30',
      },
      {
        key: 'endDate',
        label: 'End date & time',
        kind: 'datetime',
        required: false,
        group: 'When',
        placeholder: '2026-08-15T21:00',
      },
      {
        key: 'locationName',
        label: 'Venue name',
        kind: 'text',
        required: true,
        group: 'Where',
        placeholder: 'WeWork Galaxy',
      },
      {
        key: 'locationAddress',
        label: 'Venue address',
        kind: 'text',
        required: true,
        group: 'Where',
        placeholder: '43 Residency Road, Bengaluru 560025',
      },
      {
        key: 'price',
        label: 'Ticket price',
        kind: 'number',
        required: false,
        group: 'Tickets',
        placeholder: '499',
      },
      {
        key: 'priceCurrency',
        label: 'Currency code',
        kind: 'text',
        required: false,
        group: 'Tickets',
        placeholder: 'INR',
      },
      {
        key: 'ticketUrl',
        label: 'Ticket URL',
        kind: 'url',
        required: false,
        group: 'Tickets',
        placeholder: 'https://example.com/events/saas-meetup-aug/tickets',
      },
      {
        key: 'organizerName',
        label: 'Organizer',
        kind: 'text',
        required: false,
        group: 'Tickets',
        placeholder: 'Example Community',
      },
    ],
  },
  {
    id: 'WebSite',
    label: 'WebSite',
    blurb: 'Site identity plus the sitelinks search box action.',
    fields: [
      {
        key: 'name',
        label: 'Site name',
        kind: 'text',
        required: true,
        group: 'Basics',
        placeholder: 'Example',
      },
      {
        key: 'url',
        label: 'Homepage URL',
        kind: 'url',
        required: true,
        group: 'Basics',
        placeholder: 'https://example.com',
      },
      {
        key: 'alternateName',
        label: 'Alternate name',
        kind: 'text',
        required: false,
        group: 'Basics',
        placeholder: 'Example Inc',
      },
      {
        key: 'searchUrl',
        label: 'Search results URL pattern',
        kind: 'url',
        required: false,
        group: 'Site search',
        placeholder: 'https://example.com/search?q={search_term_string}',
        hint: 'Your on-site search URL with {search_term_string} where the query goes.',
      },
    ],
  },
  {
    id: 'BreadcrumbList',
    label: 'Breadcrumbs',
    blurb: 'The page trail Google shows in place of the raw URL.',
    fields: [
      {
        key: 'crumbs',
        label: 'Breadcrumb trail',
        kind: 'repeat',
        required: true,
        group: 'Trail',
        itemLabel: 'Crumb',
        addLabel: 'Add crumb',
        hint: 'Top to bottom, ending at the current page. The last crumb can omit its URL.',
        itemFields: [
          {
            key: 'name',
            label: 'Name',
            kind: 'text',
            required: true,
            placeholder: 'Blog',
          },
          {
            key: 'url',
            label: 'URL',
            kind: 'url',
            placeholder: 'https://example.com/blog',
          },
        ],
      },
    ],
  },
  {
    id: 'HowTo',
    label: 'HowTo',
    blurb: 'Step-by-step instructions — each step can appear directly in results.',
    fields: [
      {
        key: 'name',
        label: 'Task name',
        kind: 'text',
        required: true,
        group: 'Basics',
        placeholder: 'How to set up a custom domain',
      },
      {
        key: 'description',
        label: 'Description',
        kind: 'textarea',
        required: false,
        group: 'Basics',
        placeholder: 'What the reader will have done by the end…',
      },
      {
        key: 'image',
        label: 'Image URL',
        kind: 'url',
        required: false,
        group: 'Basics',
        placeholder: 'https://example.com/images/custom-domain.jpg',
      },
      {
        key: 'totalTime',
        label: 'Total time',
        kind: 'text',
        required: false,
        group: 'Basics',
        placeholder: 'PT20M',
        hint: 'ISO 8601 duration: PT20M is 20 minutes, PT1H30M is 90 minutes.',
      },
      {
        key: 'costValue',
        label: 'Estimated cost',
        kind: 'number',
        required: false,
        group: 'Cost',
        placeholder: '0',
      },
      {
        key: 'costCurrency',
        label: 'Currency code',
        kind: 'text',
        required: false,
        group: 'Cost',
        placeholder: 'INR',
      },
      {
        key: 'steps',
        label: 'Steps',
        kind: 'repeat',
        required: true,
        group: 'Steps',
        itemLabel: 'Step',
        addLabel: 'Add step',
        itemFields: [
          {
            key: 'name',
            label: 'Step name',
            kind: 'text',
            placeholder: 'Add a CNAME record',
          },
          {
            key: 'text',
            label: 'Instruction',
            kind: 'textarea',
            required: true,
            placeholder: 'In your DNS provider, create a CNAME record pointing…',
          },
        ],
      },
    ],
  },
]

/**
 * Realistic example values per type. Used as the component's defaults (so the
 * first paint shows a real result) and as the tests' happy-path fixtures —
 * every one of these must build with zero warnings, and a test enforces that.
 */
export const EXAMPLE_VALUES: Readonly<Record<SchemaTypeId, SchemaValues>> = {
  Article: {
    name: 'How to Reduce Cart Abandonment: 12 Tactics That Work',
    description:
      'Twelve practical tactics for recovering abandoned carts, from exit-intent offers to payment-page trust signals.',
    url: 'https://example.com/blog/cart-abandonment',
    image: 'https://example.com/images/cart-abandonment-cover.jpg',
    datePublished: '2026-07-01',
    dateModified: '2026-07-20',
    authorName: 'Asha Verma',
    authorUrl: 'https://example.com/authors/asha-verma',
    publisherName: 'Example Insights',
    publisherLogo: 'https://example.com/logo.png',
  },
  Organization: {
    name: 'Example Software Pvt Ltd',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    description: 'Product analytics for subscription businesses.',
    email: 'hello@example.com',
    telephone: '+91 98765 43210',
    sameAs: [
      { url: 'https://www.linkedin.com/company/example' },
      { url: 'https://x.com/example' },
    ],
  },
  LocalBusiness: {
    name: 'Blue Leaf Coffee — Indiranagar',
    image: 'https://example.com/images/storefront.jpg',
    url: 'https://example.com',
    telephone: '+91 80 4111 2222',
    priceRange: '₹₹',
    streetAddress: '100 Feet Road',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560038',
    addressCountry: 'IN',
    latitude: '12.9784',
    longitude: '77.6408',
    openingHours: [
      { dayFrom: 'Monday', dayTo: 'Friday', opens: '08:00', closes: '22:00' },
      { dayFrom: 'Saturday', dayTo: 'Sunday', opens: '09:00', closes: '23:00' },
    ],
  },
  Product: {
    name: 'Atlas Trail Running Shoes',
    image: 'https://example.com/images/atlas-trail.jpg',
    description: 'Lightweight trail shoes with a 6 mm drop and a grippy outsole.',
    brand: 'Atlas',
    sku: 'ATL-TR-42',
    gtin: '8901234567890',
    price: '4999',
    priceCurrency: 'INR',
    availability: 'InStock',
    offerUrl: 'https://example.com/products/atlas-trail',
    ratingValue: '4.6',
    reviewCount: '128',
  },
  Person: {
    name: 'Asha Verma',
    jobTitle: 'Head of Growth',
    worksFor: 'Example Software',
    url: 'https://example.com/team/asha-verma',
    image: 'https://example.com/images/asha.jpg',
    email: 'asha@example.com',
    sameAs: [{ url: 'https://www.linkedin.com/in/ashaverma' }],
  },
  Event: {
    name: 'Bengaluru SaaS Meetup — August 2026',
    description: 'Talks on pricing experiments and PLG onboarding, plus networking.',
    url: 'https://example.com/events/saas-meetup-aug',
    image: 'https://example.com/images/meetup.jpg',
    startDate: '2026-08-15T18:30',
    endDate: '2026-08-15T21:00',
    locationName: 'WeWork Galaxy',
    locationAddress: '43 Residency Road, Bengaluru 560025',
    price: '499',
    priceCurrency: 'INR',
    ticketUrl: 'https://example.com/events/saas-meetup-aug/tickets',
    organizerName: 'Example Community',
  },
  WebSite: {
    name: 'Example',
    url: 'https://example.com',
    alternateName: 'Example Inc',
    searchUrl: 'https://example.com/search?q={search_term_string}',
  },
  BreadcrumbList: {
    crumbs: [
      { name: 'Home', url: 'https://example.com' },
      { name: 'Blog', url: 'https://example.com/blog' },
      { name: 'Cart abandonment tactics', url: '' },
    ],
  },
  HowTo: {
    name: 'How to set up a custom domain',
    description: 'Point your own domain at your site and get HTTPS issued.',
    image: 'https://example.com/images/custom-domain.jpg',
    totalTime: 'PT20M',
    costValue: '0',
    costCurrency: 'INR',
    steps: [
      {
        name: 'Add a CNAME record',
        text: 'In your DNS provider, create a CNAME record for www pointing at your host.',
      },
      {
        name: 'Verify the domain',
        text: 'Back in your hosting dashboard, add the domain and wait for DNS to propagate.',
      },
      {
        name: 'Enable HTTPS',
        text: 'Issue the TLS certificate — most hosts do this automatically once DNS resolves.',
      },
    ],
  },
}

/** Looks up a type spec. Returns undefined only if the id is somehow unknown. */
export function getSchemaType(id: SchemaTypeId): SchemaTypeSpec | undefined {
  return SCHEMA_TYPES.find((t) => t.id === id)
}

/* ---------------------------------------------------------------------------
 * Value validation helpers
 * ------------------------------------------------------------------------- */

/** True for a parseable http(s) URL with a real scheme — never for `/path` or `images/x.jpg`. */
export function isAbsoluteHttpUrl(raw: string): boolean {
  if (!/^https?:\/\//i.test(raw)) return false
  try {
    const parsed = new URL(raw)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/** True for a real calendar date in ISO 8601 `YYYY-MM-DD` form. */
export function isIsoDate(raw: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false
  const time = Date.parse(`${raw}T00:00:00Z`)
  if (Number.isNaN(time)) return false
  // Date.parse normalises 2026-02-30 to March — a round-trip catches that.
  return new Date(time).toISOString().slice(0, 10) === raw
}

/** True for an ISO 8601 date, or date + time with optional seconds and offset. */
export function isIsoDateTime(raw: string): boolean {
  const match = /^(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})?)?$/.exec(
    raw,
  )
  if (!match) return false
  const datePart = match[1]
  return datePart !== undefined && isIsoDate(datePart)
}

/** True for 24-hour `HH:MM`. */
export function isTime(raw: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(raw)
}

/** True for an ISO 8601 duration like PT20M, PT1H30M or P1D. */
export function isIsoDuration(raw: string): boolean {
  return /^P(?=\d|T\d)(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/.test(raw)
}

/**
 * Expands a day range into individual schema.org day names, wrapping across
 * the weekend: Friday→Monday yields Friday, Saturday, Sunday, Monday.
 * OpeningHoursSpecification takes a list of days, not a range, so the
 * expansion happens here rather than in the markup consumer's imagination.
 */
export function expandDayRange(from: string, to: string): readonly string[] {
  const start = DAYS.indexOf(from as (typeof DAYS)[number])
  const end = DAYS.indexOf(to as (typeof DAYS)[number])
  if (start < 0 || end < 0) return []
  const out: string[] = []
  for (let i = 0; i < 7; i++) {
    const day = DAYS[(start + i) % 7]
    if (day !== undefined) out.push(day)
    if ((start + i) % 7 === end) break
  }
  return out
}

/**
 * Wraps the JSON in the script tag site owners paste into their <head>.
 * `</` is escaped as `<\/` — a no-op to any JSON parser, but it stops a value
 * containing `</script>` from terminating the script element early.
 */
export function wrapInScriptTag(json: string): string {
  const safe = json.replace(/<\//g, '<\\/')
  return `<script type="application/ld+json">\n${safe}\n</script>`
}

/* ---------------------------------------------------------------------------
 * Internal value readers
 * ------------------------------------------------------------------------- */

function scalar(values: SchemaValues, key: string): string {
  const v = values[key]
  return typeof v === 'string' ? v.trim() : ''
}

function repeatRows(values: SchemaValues, key: string): readonly RepeatRow[] {
  const v = values[key]
  if (v === undefined || typeof v === 'string') return []
  return v
}

function rowValue(row: RepeatRow, key: string): string {
  return (row[key] ?? '').trim()
}

/** A row where every item field is blank contributes nothing and is skipped. */
function nonEmptyRows(rows: readonly RepeatRow[]): readonly RepeatRow[] {
  return rows.filter((row) => Object.values(row).some((v) => v.trim() !== ''))
}

/** Sets `prop` on `target` only when the value is non-empty — never emits "". */
function setIf(target: Record<string, unknown>, prop: string, value: string): void {
  if (value !== '') target[prop] = value
}

/** Emits a number when the string parses cleanly, the raw string otherwise. */
function asNumber(value: string): number | string {
  const n = Number(value)
  return Number.isFinite(n) ? n : value
}

/* ---------------------------------------------------------------------------
 * Warnings
 * ------------------------------------------------------------------------- */

function scalarFormatWarning(
  kind: ScalarKind,
  value: string,
  field: string,
): SchemaWarning | undefined {
  if (value === '') return undefined
  switch (kind) {
    case 'url':
      if (!isAbsoluteHttpUrl(value)) {
        return {
          field,
          message:
            'must be an absolute URL starting with https:// — relative paths are ambiguous to crawlers and fail validation.',
        }
      }
      return undefined
    case 'date':
      if (!isIsoDate(value)) {
        return {
          field,
          message: 'is not a valid ISO 8601 date. Use YYYY-MM-DD, e.g. 2026-07-29.',
        }
      }
      return undefined
    case 'datetime':
      if (!isIsoDateTime(value)) {
        return {
          field,
          message:
            'is not a valid ISO 8601 date-time. Use YYYY-MM-DDTHH:MM, e.g. 2026-08-15T19:30.',
        }
      }
      return undefined
    case 'time':
      if (!isTime(value)) {
        return { field, message: 'is not a valid time. Use 24-hour HH:MM, e.g. 09:30.' }
      }
      return undefined
    case 'number': {
      const n = Number(value)
      if (!Number.isFinite(n)) {
        return {
          field,
          message: 'must be a plain number — digits and a decimal point only.',
        }
      }
      if (n < 0) {
        return { field, message: 'cannot be negative.' }
      }
      return undefined
    }
    default:
      return undefined
  }
}

function genericWarnings(spec: SchemaTypeSpec, values: SchemaValues): SchemaWarning[] {
  const warnings: SchemaWarning[] = []
  for (const field of spec.fields) {
    if (field.kind === 'repeat') {
      const rows = nonEmptyRows(repeatRows(values, field.key))
      if (field.required && rows.length === 0) {
        warnings.push({
          field: field.label,
          message: `needs at least one ${field.itemLabel.toLowerCase()} — Google requires it for ${spec.id} rich results.`,
        })
        continue
      }
      rows.forEach((row, i) => {
        for (const item of field.itemFields) {
          const value = rowValue(row, item.key)
          const name = `${field.itemLabel} ${i + 1} · ${item.label}`
          if (item.required === true && value === '') {
            warnings.push({ field: name, message: 'is empty but required.' })
            continue
          }
          const formatWarning = scalarFormatWarning(item.kind, value, name)
          if (formatWarning) warnings.push(formatWarning)
        }
      })
      continue
    }

    const value = scalar(values, field.key)
    if (field.required && value === '') {
      warnings.push({
        field: field.label,
        message: `is empty. Google requires it for ${spec.id} rich results — the Rich Results Test will flag this.`,
      })
      continue
    }
    const formatWarning = scalarFormatWarning(field.kind, value, field.label)
    if (formatWarning) warnings.push(formatWarning)
  }
  return warnings
}

function extraWarnings(type: SchemaTypeId, values: SchemaValues): SchemaWarning[] {
  const warnings: SchemaWarning[] = []
  switch (type) {
    case 'Product': {
      const rating = scalar(values, 'ratingValue')
      const count = scalar(values, 'reviewCount')
      if (rating !== '' && count === '') {
        warnings.push({
          field: 'Review count',
          message:
            'is needed alongside the average rating — an aggregateRating without a count is invalid.',
        })
      }
      if (rating === '' && count !== '') {
        warnings.push({
          field: 'Average rating',
          message: 'is needed alongside the review count for a valid aggregateRating.',
        })
      }
      break
    }
    case 'LocalBusiness': {
      const lat = scalar(values, 'latitude')
      const lng = scalar(values, 'longitude')
      if ((lat === '') !== (lng === '')) {
        warnings.push({
          field: lat === '' ? 'Latitude' : 'Longitude',
          message: 'is missing — geo coordinates only make sense as a pair.',
        })
      }
      const latN = Number(lat)
      const lngN = Number(lng)
      if (lat !== '' && Number.isFinite(latN) && Math.abs(latN) > 90) {
        warnings.push({ field: 'Latitude', message: 'must be between -90 and 90.' })
      }
      if (lng !== '' && Number.isFinite(lngN) && Math.abs(lngN) > 180) {
        warnings.push({ field: 'Longitude', message: 'must be between -180 and 180.' })
      }
      break
    }
    case 'BreadcrumbList': {
      const rows = nonEmptyRows(repeatRows(values, 'crumbs'))
      if (rows.length === 1) {
        warnings.push({
          field: 'Breadcrumb trail',
          message: 'needs at least two crumbs — a single-item trail is not a breadcrumb.',
        })
      }
      rows.forEach((row, i) => {
        if (i < rows.length - 1 && rowValue(row, 'url') === '') {
          warnings.push({
            field: `Crumb ${i + 1} · URL`,
            message:
              'is empty. Only the final crumb (the current page) may omit its URL.',
          })
        }
      })
      break
    }
    case 'WebSite': {
      const searchUrl = scalar(values, 'searchUrl')
      if (searchUrl !== '' && !searchUrl.includes('{search_term_string}')) {
        warnings.push({
          field: 'Search results URL pattern',
          message:
            'must contain the literal placeholder {search_term_string} where the query is inserted.',
        })
      }
      break
    }
    case 'HowTo': {
      const totalTime = scalar(values, 'totalTime')
      if (totalTime !== '' && !isIsoDuration(totalTime)) {
        warnings.push({
          field: 'Total time',
          message:
            'is not an ISO 8601 duration. Use PT20M for 20 minutes or PT1H30M for 90 minutes.',
        })
      }
      break
    }
    case 'Event': {
      const start = scalar(values, 'startDate')
      const end = scalar(values, 'endDate')
      if (
        start !== '' &&
        end !== '' &&
        isIsoDateTime(start) &&
        isIsoDateTime(end) &&
        Date.parse(end) < Date.parse(start)
      ) {
        warnings.push({
          field: 'End date & time',
          message: 'is before the start date — check the dates.',
        })
      }
      break
    }
    default:
      break
  }
  return warnings
}

/* ---------------------------------------------------------------------------
 * JSON-LD builders — one per type. Empty optionals are dropped entirely:
 * `"dateModified": ""` is not "no value" to a parser, it is the empty string,
 * and Google's validator rejects it.
 * ------------------------------------------------------------------------- */

function buildArticle(values: SchemaValues): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  setIf(out, 'headline', scalar(values, 'name'))
  setIf(out, 'description', scalar(values, 'description'))
  setIf(out, 'image', scalar(values, 'image'))
  const url = scalar(values, 'url')
  if (url !== '') {
    out.url = url
    out.mainEntityOfPage = { '@type': 'WebPage', '@id': url }
  }
  setIf(out, 'datePublished', scalar(values, 'datePublished'))
  setIf(out, 'dateModified', scalar(values, 'dateModified'))
  const authorName = scalar(values, 'authorName')
  if (authorName !== '') {
    const author: Record<string, unknown> = { '@type': 'Person', name: authorName }
    setIf(author, 'url', scalar(values, 'authorUrl'))
    out.author = author
  }
  const publisherName = scalar(values, 'publisherName')
  if (publisherName !== '') {
    const publisher: Record<string, unknown> = {
      '@type': 'Organization',
      name: publisherName,
    }
    const logo = scalar(values, 'publisherLogo')
    if (logo !== '') publisher.logo = { '@type': 'ImageObject', url: logo }
    out.publisher = publisher
  }
  return out
}

function collectSameAs(values: SchemaValues): readonly string[] {
  return nonEmptyRows(repeatRows(values, 'sameAs'))
    .map((row) => rowValue(row, 'url'))
    .filter((u) => u !== '')
}

function buildOrganization(values: SchemaValues): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  setIf(out, 'name', scalar(values, 'name'))
  setIf(out, 'url', scalar(values, 'url'))
  setIf(out, 'logo', scalar(values, 'logo'))
  setIf(out, 'description', scalar(values, 'description'))
  setIf(out, 'email', scalar(values, 'email'))
  setIf(out, 'telephone', scalar(values, 'telephone'))
  const sameAs = collectSameAs(values)
  if (sameAs.length > 0) out.sameAs = sameAs
  return out
}

function buildLocalBusiness(values: SchemaValues): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  setIf(out, 'name', scalar(values, 'name'))
  setIf(out, 'image', scalar(values, 'image'))
  setIf(out, 'url', scalar(values, 'url'))
  setIf(out, 'telephone', scalar(values, 'telephone'))
  setIf(out, 'priceRange', scalar(values, 'priceRange'))

  const address: Record<string, unknown> = { '@type': 'PostalAddress' }
  setIf(address, 'streetAddress', scalar(values, 'streetAddress'))
  setIf(address, 'addressLocality', scalar(values, 'addressLocality'))
  setIf(address, 'addressRegion', scalar(values, 'addressRegion'))
  setIf(address, 'postalCode', scalar(values, 'postalCode'))
  setIf(address, 'addressCountry', scalar(values, 'addressCountry'))
  if (Object.keys(address).length > 1) out.address = address

  const lat = scalar(values, 'latitude')
  const lng = scalar(values, 'longitude')
  if (lat !== '' && lng !== '') {
    out.geo = {
      '@type': 'GeoCoordinates',
      latitude: asNumber(lat),
      longitude: asNumber(lng),
    }
  }

  const hours = nonEmptyRows(repeatRows(values, 'openingHours'))
    .map((row) => {
      const days = expandDayRange(rowValue(row, 'dayFrom'), rowValue(row, 'dayTo'))
      const spec: Record<string, unknown> = { '@type': 'OpeningHoursSpecification' }
      if (days.length > 0) spec.dayOfWeek = days
      setIf(spec, 'opens', rowValue(row, 'opens'))
      setIf(spec, 'closes', rowValue(row, 'closes'))
      return spec
    })
    .filter((spec) => Object.keys(spec).length > 1)
  if (hours.length > 0) out.openingHoursSpecification = hours

  return out
}

function buildProduct(values: SchemaValues): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  setIf(out, 'name', scalar(values, 'name'))
  setIf(out, 'image', scalar(values, 'image'))
  setIf(out, 'description', scalar(values, 'description'))
  const brand = scalar(values, 'brand')
  if (brand !== '') out.brand = { '@type': 'Brand', name: brand }
  setIf(out, 'sku', scalar(values, 'sku'))
  setIf(out, 'gtin', scalar(values, 'gtin'))

  const price = scalar(values, 'price')
  if (price !== '') {
    const offer: Record<string, unknown> = { '@type': 'Offer', price: asNumber(price) }
    setIf(offer, 'priceCurrency', scalar(values, 'priceCurrency'))
    const availability = scalar(values, 'availability')
    if (availability !== '') offer.availability = `https://schema.org/${availability}`
    setIf(offer, 'url', scalar(values, 'offerUrl'))
    out.offers = offer
  }

  const rating = scalar(values, 'ratingValue')
  const count = scalar(values, 'reviewCount')
  if (rating !== '' && count !== '') {
    out.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: asNumber(rating),
      reviewCount: asNumber(count),
    }
  }
  return out
}

function buildPerson(values: SchemaValues): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  setIf(out, 'name', scalar(values, 'name'))
  setIf(out, 'jobTitle', scalar(values, 'jobTitle'))
  const worksFor = scalar(values, 'worksFor')
  if (worksFor !== '') out.worksFor = { '@type': 'Organization', name: worksFor }
  setIf(out, 'url', scalar(values, 'url'))
  setIf(out, 'image', scalar(values, 'image'))
  setIf(out, 'email', scalar(values, 'email'))
  const sameAs = collectSameAs(values)
  if (sameAs.length > 0) out.sameAs = sameAs
  return out
}

function buildEvent(values: SchemaValues): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  setIf(out, 'name', scalar(values, 'name'))
  setIf(out, 'description', scalar(values, 'description'))
  setIf(out, 'url', scalar(values, 'url'))
  setIf(out, 'image', scalar(values, 'image'))
  setIf(out, 'startDate', scalar(values, 'startDate'))
  setIf(out, 'endDate', scalar(values, 'endDate'))

  const locationName = scalar(values, 'locationName')
  const locationAddress = scalar(values, 'locationAddress')
  if (locationName !== '' || locationAddress !== '') {
    const location: Record<string, unknown> = { '@type': 'Place' }
    setIf(location, 'name', locationName)
    setIf(location, 'address', locationAddress)
    out.location = location
  }

  const price = scalar(values, 'price')
  if (price !== '') {
    const offer: Record<string, unknown> = { '@type': 'Offer', price: asNumber(price) }
    setIf(offer, 'priceCurrency', scalar(values, 'priceCurrency'))
    setIf(offer, 'url', scalar(values, 'ticketUrl'))
    out.offers = offer
  }

  const organizer = scalar(values, 'organizerName')
  if (organizer !== '') out.organizer = { '@type': 'Organization', name: organizer }
  return out
}

function buildWebSite(values: SchemaValues): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  setIf(out, 'name', scalar(values, 'name'))
  setIf(out, 'alternateName', scalar(values, 'alternateName'))
  setIf(out, 'url', scalar(values, 'url'))
  const searchUrl = scalar(values, 'searchUrl')
  if (searchUrl !== '') {
    out.potentialAction = {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: searchUrl },
      'query-input': 'required name=search_term_string',
    }
  }
  return out
}

function buildBreadcrumbList(values: SchemaValues): Record<string, unknown> {
  const items = nonEmptyRows(repeatRows(values, 'crumbs')).map((row, i) => {
    const item: Record<string, unknown> = {
      '@type': 'ListItem',
      position: i + 1,
    }
    setIf(item, 'name', rowValue(row, 'name'))
    setIf(item, 'item', rowValue(row, 'url'))
    return item
  })
  return items.length > 0 ? { itemListElement: items } : {}
}

function buildHowTo(values: SchemaValues): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  setIf(out, 'name', scalar(values, 'name'))
  setIf(out, 'description', scalar(values, 'description'))
  setIf(out, 'image', scalar(values, 'image'))
  setIf(out, 'totalTime', scalar(values, 'totalTime'))

  const costValue = scalar(values, 'costValue')
  if (costValue !== '') {
    const cost: Record<string, unknown> = {
      '@type': 'MonetaryAmount',
      value: asNumber(costValue),
    }
    setIf(cost, 'currency', scalar(values, 'costCurrency'))
    out.estimatedCost = cost
  }

  const steps = nonEmptyRows(repeatRows(values, 'steps')).map((row) => {
    const step: Record<string, unknown> = { '@type': 'HowToStep' }
    setIf(step, 'name', rowValue(row, 'name'))
    setIf(step, 'text', rowValue(row, 'text'))
    return step
  })
  if (steps.length > 0) out.step = steps
  return out
}

function buildBody(type: SchemaTypeId, values: SchemaValues): Record<string, unknown> {
  switch (type) {
    case 'Article':
      return buildArticle(values)
    case 'Organization':
      return buildOrganization(values)
    case 'LocalBusiness':
      return buildLocalBusiness(values)
    case 'Product':
      return buildProduct(values)
    case 'Person':
      return buildPerson(values)
    case 'Event':
      return buildEvent(values)
    case 'WebSite':
      return buildWebSite(values)
    case 'BreadcrumbList':
      return buildBreadcrumbList(values)
    case 'HowTo':
      return buildHowTo(values)
  }
}

/**
 * Builds the JSON-LD object, its pretty-printed JSON and the warnings list.
 *
 * Escaping is left entirely to JSON.stringify — the one thing it cannot know
 * about is the surrounding <script> element, which wrapInScriptTag handles.
 * Warnings are advisory, never blocking: the output always reflects the
 * current input so the user can watch the object take shape.
 */
export function buildSchema(type: SchemaTypeId, values: SchemaValues): SchemaResult {
  const spec = getSchemaType(type)
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    ...buildBody(type, values),
  }
  const warnings = spec
    ? [...genericWarnings(spec, values), ...extraWarnings(type, values)]
    : []
  return { jsonLd, json: JSON.stringify(jsonLd, null, 2), warnings }
}
