import type { Tool } from '../types'

const MINIFY_SUPPORT: Tool['supportContent'] = [
  {
    heading: 'Minify vs beautify — what they do',
    blocks: [
      {
        type: 'prose',
        paragraphs: [
          'The same JSON can be stored two ways. Beautified JSON is indented and spread over multiple lines so a human can read it. Minified JSON removes every unnecessary space and line break so a machine can transfer it as fast as possible. Both are valid, identical data — only the formatting differs.',
        ],
      },
      {
        type: 'code',
        snippets: [
          {
            label: 'Beautified — for reading & debugging',
            lang: 'json',
            code: `{
  "user": {
    "id": 42,
    "name": "Aarav",
    "roles": ["admin", "editor"]
  }
}`,
          },
          {
            label: 'Minified — for transfer & storage',
            lang: 'json',
            code: '{"user":{"id":42,"name":"Aarav","roles":["admin","editor"]}}',
          },
        ],
      },
      {
        type: 'list',
        intro:
          "Beautify when: debugging an API response or log, reviewing a config file or someone else's data, or writing documentation and examples.",
        items: [
          'Minify when sending over the network — smaller payloads load faster.',
          'Minify when storing at scale — less space in databases and caches.',
          "Minify for production builds, where readability doesn't matter and size does.",
        ],
      },
      {
        type: 'prose',
        paragraphs: [
          'Rule of thumb: work in beautified JSON, ship minified JSON. If a person is reading it, beautify. If a machine is consuming it, minify.',
        ],
      },
    ],
  },
]

export const meta: Tool = {
  slug: 'json-formatter',
  category: 'dev',
  title: 'JSON Formatter & Validator',
  h1: 'JSON Formatter & Validator',
  description:
    'Format, minify and validate JSON with error messages that tell you the line and column. Runs locally — safe for payloads you should not paste into a website.',
  tagline: 'Format and validate JSON without sending it anywhere.',
  keywords: ['json formatter', 'json validator', 'json beautifier'],
  related: ['schema-markup-generator', 'faq-schema-generator', 'favicon-generator'],
  wave: 1,
  runtime: 'client',
  monthlyCostCeiling: 0,
  leadTier: 'C',
  updatedAt: '2026-07-29',
  owner: 'scult-dev',
  icon: 'Braces',
  runsInBrowser: true,
  howToUse: [
    'Paste your JSON.',
    'Choose an indent width, or minify.',
    'Read the error location if it fails to parse.',
    'Copy the result.',
  ],
  howItWorks:
    'Parsing uses the native JSON.parse, the fastest and most standards-accurate option available. Its errors only give a character offset, so we convert that into a line and column and show the offending line — turning "unexpected token at position 1043" into "trailing comma on line 42."',
  limitations: [
    'Strict JSON only — comments, trailing commas and single-quoted strings are reported as errors, not silently fixed.',
    'Integers beyond 2^53 lose precision; JavaScript numbers are IEEE-754 doubles.',
  ],
  faq: [
    {
      q: 'Is my JSON sent to a server?',
      a: 'No, and that is the point of this one. Everything runs in your tab, so it is safe for API responses and payloads you should not be pasting into arbitrary websites.',
    },
    {
      q: 'Why is my JSON invalid when it looks fine?',
      a: 'The usual culprits are a trailing comma before a closing brace, unquoted keys, or single quotes instead of double quotes. All three are valid JavaScript and invalid JSON.',
    },
    {
      q: 'What indent should I use?',
      a: 'Two spaces is the most common convention. Minify for anything going over the wire.',
    },
    {
      q: "What's the difference between format, minify, and validate?",
      a: 'Format (beautify) adds indentation and line breaks so JSON is readable. Minify strips whitespace to make it as small as possible for transfer. Validate checks the JSON is syntactically correct and points you to the error if not.',
    },
    {
      q: 'Is there a size limit?',
      a: "No hard limit — it handles large files comfortably since parsing runs locally with the browser's native JSON.parse. Very large files depend on your own device's memory, not a server-side cap.",
    },
    {
      q: 'Is it free?',
      a: 'Yes — free, no signup, and it keeps working offline once the page has loaded.',
    },
  ],
  supportContent: MINIFY_SUPPORT,
}
