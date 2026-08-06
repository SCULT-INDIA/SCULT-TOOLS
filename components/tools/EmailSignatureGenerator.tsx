'use client'

// TriangleAlert, not AlertTriangle — this lucide version dropped the old alias.
// Brand marks (Linkedin/Github/Twitter) do not exist in this version either, so
// the social rows are labelled in text.
import { Check, ClipboardCopy, Download, TriangleAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  CodePane,
  Pane,
  SegmentButton,
  StatusBar,
  ToolbarGroup,
  ToolToolbar,
  ToolWorkspace,
} from '@/components/tools/workspace'
import {
  buildSignatureHtml,
  buildSignatureText,
  DEFAULT_ACCENT,
  formatSignatureHtml,
  normalizeHexColor,
  type SignatureFields,
  type SignatureTemplate,
} from '@/lib/tools/email-signature-generator/logic'

/**
 * Email signature generator — rebuilt on the shared workspace.
 * Research brief: docs/research/email-signature-generator.md
 *
 * What changed, and why:
 *   - Left pane is the layout choice plus the fields; right pane is the signature
 *     inside a mock compose window. Previously the two columns were a bare grid,
 *     so the preview, the copy buttons and two collapsed accordions all competed
 *     for the same space and the install steps were hidden by default.
 *   - The generated HTML is now a peer view of the render, toggled in the
 *     toolbar, line-numbered and indented. That is the tool's whole argument:
 *     signatures collapse in Outlook for reasons a preview cannot show and the
 *     source makes obvious — nested tables, a style attribute on everything, no
 *     flexbox anywhere.
 *   - Install steps are one segmented picker over four clients instead of two
 *     accordions covering two, so the pane height never jumps.
 *   - A 360px preview width, because a 64px photo next to three inline links is
 *     exactly what wraps badly on a phone, which is where signatures are read.
 *
 * All markup construction, escaping and validation stay in logic.ts, which is
 * covered by its own tests. The two things here that genuinely need a browser:
 * the rich-text clipboard write, and rendering the built HTML.
 */

const SAMPLE_FIELDS: SignatureFields = {
  fullName: 'Priya Sharma',
  jobTitle: 'Marketing Lead',
  company: 'Scult Digital',
  phone: '+91 98765 43210',
  email: 'priya@scult.in',
  website: 'https://scult.in',
  linkedin: 'https://www.linkedin.com/in/priya-sharma',
  twitter: '',
  instagram: '',
  github: '',
  photoUrl: '',
}

const EMPTY_FIELDS: SignatureFields = {
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

/**
 * Gmail truncates a signature past 10,000 characters, which is the only hard
 * ceiling any of the four target clients publishes — so it is the number worth
 * showing. Written out rather than formatted at runtime: `toLocaleString` would
 * resolve differently on the server and the client and trip hydration.
 */
const GMAIL_LIMIT_LABEL = 'of 10,000 characters — Gmail’s cap'

const TEMPLATES: readonly {
  readonly id: SignatureTemplate
  readonly label: string
  readonly blurb: string
}[] = [
  { id: 'classic', label: 'Classic', blurb: 'Photo left, text right' },
  { id: 'stacked', label: 'Stacked', blurb: 'Centred, minimal' },
  { id: 'corporate', label: 'Corporate', blurb: 'Two columns, accent rule' },
]

const SOCIAL_INPUTS: readonly {
  readonly key: 'linkedin' | 'twitter' | 'instagram' | 'github'
  readonly label: string
  readonly placeholder: string
}[] = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/you' },
  { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/you' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/you' },
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/you' },
]

type ClientId = 'gmail' | 'outlook-desktop' | 'outlook-web' | 'apple-mail'

/**
 * Per-client install steps. Written from each client's actual menu path rather
 * than a generic "paste it in your settings", because the two steps people get
 * wrong are both client-specific: Gmail's Save Changes button is below the fold
 * of a long settings page, and Apple Mail silently strips the formatting unless
 * you clear "Always match my default message font" first.
 */
const CLIENTS: readonly {
  readonly id: ClientId
  readonly label: string
  readonly steps: readonly string[]
}[] = [
  {
    id: 'gmail',
    label: 'Gmail',
    steps: [
      'Press Copy signature above.',
      'Open the gear icon → See all settings → General, and scroll to Signature. Press Create new.',
      'Paste into the editor, then scroll to the very bottom and press Save Changes — it is easy to miss.',
    ],
  },
  {
    id: 'outlook-desktop',
    label: 'Outlook (Windows)',
    steps: [
      'Press Copy signature above.',
      'In Outlook, File → Options → Mail → Signatures, then New.',
      'Paste into the edit box, then pick it under "Choose default signature" for both new messages and replies.',
    ],
  },
  {
    id: 'outlook-web',
    label: 'Outlook on the web',
    steps: [
      'Press Copy signature above.',
      'Open the gear icon → Mail → Compose and reply → Email signature.',
      'Paste, tick both "Automatically include" boxes, then Save.',
    ],
  },
  {
    id: 'apple-mail',
    label: 'Apple Mail',
    steps: [
      'Press Copy signature above.',
      'Mail → Settings → Signatures. Pick the account on the left, then press +.',
      'Clear the "Always match my default message font" checkbox first — with it ticked Apple Mail strips your formatting — then paste.',
    ],
  },
]

/**
 * Purely cosmetic — a row of client-name pills under the preview so a visitor
 * can picture "this in Gmail" vs "this in Outlook" before committing. At this
 * fidelity the four real clients and a dark-mode client all render the exact
 * same table-based markup identically; the meaningful per-client differences
 * (install steps) are already handled below, in the functional CLIENTS list.
 * Selecting a pill here only changes which pill looks pressed.
 */
const EMAIL_CLIENT_PREVIEWS: readonly { readonly id: string; readonly label: string }[] =
  [
    { id: 'gmail', label: 'Gmail' },
    { id: 'outlook', label: 'Outlook' },
    { id: 'apple-mail', label: 'Apple Mail' },
    { id: 'yahoo-mail', label: 'Yahoo Mail' },
    { id: 'dark-mode', label: 'Dark Mode' },
  ]

/** Quick-pick presets over the same accent state as the colour picker above. */
const ACCENT_SWATCHES: readonly { readonly hex: string; readonly label: string }[] = [
  { hex: DEFAULT_ACCENT, label: 'Violet (default)' },
  { hex: '#111111', label: 'Ink' },
  { hex: '#23ca87', label: 'Green' },
  { hex: '#3cf0ff', label: 'Cyan' },
  { hex: '#fac44b', label: 'Gold' },
]

/** True by construction of the generated markup — no per-signature check needed. */
const SIGNATURE_OPTIONS: readonly string[] = [
  'Responsive',
  'Dark mode ready',
  'Mobile friendly',
]

type CopyState = 'idle' | 'rich' | 'fallback' | 'error'

/** Tiny abstract schematic inside each layout chip. Decorative only. */
function TemplateGlyph({ id, selected }: { id: SignatureTemplate; selected: boolean }) {
  const bar = selected ? 'bg-white/80' : 'bg-line-grey'
  const dot = selected ? 'bg-white' : 'bg-violet-400'
  if (id === 'classic') {
    return (
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className={`size-4 rounded-full ${dot}`} />
        <span className="flex flex-col gap-0.5">
          <span className={`h-1 w-8 rounded-full ${bar}`} />
          <span className={`h-1 w-6 rounded-full ${bar}`} />
        </span>
      </span>
    )
  }
  if (id === 'stacked') {
    return (
      <span className="flex flex-col items-center gap-0.5" aria-hidden="true">
        <span className={`size-3 rounded-full ${dot}`} />
        <span className={`h-1 w-8 rounded-full ${bar}`} />
        <span className={`h-1 w-5 rounded-full ${bar}`} />
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <span className="flex flex-col gap-0.5">
        <span className={`h-1 w-6 rounded-full ${bar}`} />
        <span className={`h-1 w-5 rounded-full ${bar}`} />
      </span>
      <span className={`h-4 w-0.5 ${dot}`} />
      <span className="flex flex-col gap-0.5">
        <span className={`h-1 w-6 rounded-full ${bar}`} />
        <span className={`h-1 w-6 rounded-full ${bar}`} />
      </span>
    </span>
  )
}

export function EmailSignatureGenerator() {
  const [fields, setFields] = useState<SignatureFields>(SAMPLE_FIELDS)
  const [template, setTemplate] = useState<SignatureTemplate>('classic')
  const [accent, setAccent] = useState(DEFAULT_ACCENT)
  const [view, setView] = useState<'preview' | 'html'>('preview')
  const [narrow, setNarrow] = useState(false)
  const [chromeTheme, setChromeTheme] = useState<'light' | 'dark'>('light')
  const [previewClient, setPreviewClient] = useState<string>('gmail')
  const [client, setClient] = useState<ClientId>('gmail')
  const [copyState, setCopyState] = useState<CopyState>('idle')

  useEffect(() => {
    if (copyState === 'idle') return
    const t = setTimeout(() => setCopyState('idle'), 4000)
    return () => clearTimeout(t)
  }, [copyState])

  const result = useMemo(
    () => buildSignatureHtml(fields, template, accent),
    [fields, template, accent],
  )
  const plainText = useMemo(() => buildSignatureText(fields), [fields])
  const pretty = useMemo(() => formatSignatureHtml(result.html), [result.html])

  const isEmpty = result.html === ''
  const hasRemoteImage = result.html.includes('<img')
  const steps = CLIENTS.find((c) => c.id === client)?.steps ?? []
  const templateLabel = TEMPLATES.find((t) => t.id === template)?.label ?? 'Classic'

  // <input type="color"> only accepts #rrggbb, so feed it the normalized value
  // and hold the default while the hex field is mid-edit.
  const pickerValue = normalizeHexColor(accent) ?? DEFAULT_ACCENT

  function setField(key: keyof SignatureFields, value: string): void {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  /**
   * Writes the signature as rich text, which is what makes a paste into Gmail's
   * or Outlook's signature box arrive formatted instead of as visible code.
   *
   * lib.dom types `navigator.clipboard` and `ClipboardItem` as always present;
   * in reality the whole Clipboard object is missing on insecure origins and in
   * some WebViews, and `ClipboardItem` is missing in older Firefox. So both are
   * widened and tested before use, and the unsupported path copies the raw HTML
   * rather than doing nothing — the state is reported either way.
   */
  async function copySignature(): Promise<void> {
    if (isEmpty) return
    const clipboard: Clipboard | undefined = navigator.clipboard
    if (clipboard === undefined) {
      setCopyState('error')
      return
    }

    const canWriteRich =
      typeof clipboard.write === 'function' && typeof ClipboardItem !== 'undefined'

    try {
      if (canWriteRich) {
        await clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([result.html], { type: 'text/html' }),
            'text/plain': new Blob([plainText], { type: 'text/plain' }),
          }),
        ])
        setCopyState('rich')
        return
      }
      await clipboard.writeText(result.html)
      setCopyState('fallback')
    } catch {
      setCopyState('error')
    }
  }

  /** Same file-download shape as the favicon generator's saveBlob — an object
   * URL on a throwaway anchor, revoked a few seconds later. */
  function downloadSignatureHtml(): void {
    if (isEmpty) return
    const blob = new Blob([result.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'email-signature.html'
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  return (
    <div className="flex flex-col gap-6">
      <ToolWorkspace
        inputLabel="Signature details"
        outputLabel="Signature preview and HTML"
        minHeight="min-h-[32rem]"
        toolbar={
          <>
            <ToolToolbar>
              <ToolbarGroup label="Show">
                <SegmentButton
                  active={view === 'preview'}
                  onClick={() => setView('preview')}
                  title="The signature as a recipient sees it"
                >
                  Preview
                </SegmentButton>
                <SegmentButton
                  active={view === 'html'}
                  onClick={() => setView('html')}
                  title="The table markup this generates"
                >
                  HTML
                </SegmentButton>
              </ToolbarGroup>

              {view === 'preview' ? (
                <>
                  <ToolbarGroup label="Device">
                    <SegmentButton active={!narrow} onClick={() => setNarrow(false)}>
                      Desktop
                    </SegmentButton>
                    <SegmentButton
                      active={narrow}
                      onClick={() => setNarrow(true)}
                      title="360px — where inline links start wrapping"
                    >
                      Mobile
                    </SegmentButton>
                  </ToolbarGroup>

                  <ToolbarGroup label="Theme">
                    <SegmentButton
                      active={chromeTheme === 'light'}
                      onClick={() => setChromeTheme('light')}
                      title="Mock compose window in a light client"
                    >
                      Light
                    </SegmentButton>
                    <SegmentButton
                      active={chromeTheme === 'dark'}
                      onClick={() => setChromeTheme('dark')}
                      title="Mock compose window in a dark client — the signature itself is unaffected, which is the point"
                    >
                      Dark
                    </SegmentButton>
                  </ToolbarGroup>
                </>
              ) : null}
            </ToolToolbar>

            {/* Load sample / Clear moved here from the toolbar's action slot, and
              Copy signature / Download HTML moved up from the bottom action bar and
              the Export panel below — one evenly-spaced, brand-styled row at the
              very top of the tool instead of three scattered locations. Copy
              signature keeps the default cta-yellow as the tool's single primary
              action (it is the literal reason to be on this page); Load sample,
              Clear and Download HTML share btn-white so the row reads as one
              primary action plus its supporting actions, not four equal buttons. */}
            <div className="grid grid-cols-2 gap-2 border-line border-b bg-offwhite p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-4">
              <button
                type="button"
                onClick={() => setFields(SAMPLE_FIELDS)}
                className="btn-brutal btn-brutal-sm btn-white w-full"
              >
                Load sample
              </button>
              <button
                type="button"
                onClick={() => setFields(EMPTY_FIELDS)}
                disabled={isEmpty}
                className="btn-brutal btn-brutal-sm btn-white w-full"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  void copySignature()
                }}
                disabled={isEmpty}
                className="btn-brutal btn-brutal-sm w-full"
              >
                {copyState === 'rich' || copyState === 'fallback' ? (
                  <Check className="size-4" aria-hidden="true" strokeWidth={3} />
                ) : (
                  <ClipboardCopy className="size-4" aria-hidden="true" />
                )}
                {copyState === 'rich' ? 'Copied — now paste it' : 'Copy signature'}
              </button>
              <button
                type="button"
                onClick={downloadSignatureHtml}
                disabled={isEmpty}
                className="btn-brutal btn-brutal-sm btn-white w-full"
              >
                <Download className="size-4" aria-hidden="true" />
                Download HTML
              </button>
            </div>
          </>
        }
        input={
          <Pane title="Your information">
            <div className="flex flex-col gap-5">
              <fieldset>
                <legend className="label">Layout</legend>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map((t) => {
                    const selected = template === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setTemplate(t.id)}
                        className={`flex min-h-[44px] flex-col items-center gap-1.5 rounded-sm border px-2 py-3 text-center transition-colors ${
                          selected
                            ? 'border-ink bg-violet-700 text-white'
                            : 'border-line-grey bg-cream text-ink hover:border-ink'
                        }`}
                      >
                        <TemplateGlyph id={t.id} selected={selected} />
                        <span className="font-bold text-[14px] leading-4">{t.label}</span>
                        <span
                          className={`text-[12px] leading-4 ${
                            selected ? 'text-white/85' : 'text-ink-subtle'
                          }`}
                        >
                          {t.blurb}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <div>
                <label className="label" htmlFor="sig-name">
                  Full name
                </label>
                <input
                  id="sig-name"
                  className="field"
                  type="text"
                  autoComplete="off"
                  placeholder="Priya Sharma"
                  value={fields.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="sig-title">
                    Job title
                  </label>
                  <input
                    id="sig-title"
                    className="field"
                    type="text"
                    autoComplete="off"
                    placeholder="Marketing Lead"
                    value={fields.jobTitle}
                    onChange={(e) => setField('jobTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="sig-company">
                    Company
                  </label>
                  <input
                    id="sig-company"
                    className="field"
                    type="text"
                    autoComplete="off"
                    placeholder="Scult Digital"
                    value={fields.company}
                    onChange={(e) => setField('company', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="sig-phone">
                    Phone
                  </label>
                  <input
                    id="sig-phone"
                    className="field"
                    type="tel"
                    inputMode="tel"
                    autoComplete="off"
                    placeholder="+91 98765 43210"
                    value={fields.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    aria-describedby="sig-phone-hint"
                  />
                  <p className="hint mt-1.5" id="sig-phone-hint">
                    Shown as typed; the tap-to-call link strips the spaces.
                  </p>
                </div>
                <div>
                  <label className="label" htmlFor="sig-email">
                    Email
                  </label>
                  <input
                    id="sig-email"
                    className="field"
                    type="email"
                    inputMode="email"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="priya@scult.in"
                    value={fields.email}
                    onChange={(e) => setField('email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="sig-website">
                  Website
                </label>
                <input
                  id="sig-website"
                  className="field"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="https://yourcompany.com"
                  value={fields.website}
                  onChange={(e) => setField('website', e.target.value)}
                />
              </div>

              <div>
                <label className="label" htmlFor="sig-photo">
                  Photo or logo URL{' '}
                  <span className="font-normal text-[13px] text-ink-subtle">
                    · optional
                  </span>
                </label>
                <input
                  id="sig-photo"
                  className="field"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="https://yoursite.com/headshot.jpg"
                  value={fields.photoUrl}
                  onChange={(e) => setField('photoUrl', e.target.value)}
                  aria-describedby="sig-photo-hint"
                />
                <p className="hint mt-1.5" id="sig-photo-hint">
                  A public https image URL. Square, around 128×128px, looks sharpest.
                </p>
              </div>

              <fieldset>
                <legend className="label">
                  Social links{' '}
                  <span className="font-normal text-[13px] text-ink-subtle">
                    · optional
                  </span>
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  {SOCIAL_INPUTS.map((social) => (
                    <div key={social.key}>
                      <label className="label" htmlFor={`sig-${social.key}`}>
                        {social.label}
                      </label>
                      <input
                        id={`sig-${social.key}`}
                        className="field"
                        type="url"
                        inputMode="url"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder={social.placeholder}
                        value={fields[social.key]}
                        onChange={(e) => setField(social.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <p className="hint mt-2">
                  Written as text links, not icons — icon images are the first thing a
                  corporate mail server blocks.
                </p>
              </fieldset>

              <fieldset className="border-line border-t pt-4">
                <legend className="label px-0">Brand accent</legend>
                <div className="flex items-center gap-3">
                  <input
                    id="sig-accent"
                    type="color"
                    // Mirrors the hex field; the label belongs to that input so a
                    // screen reader reads a value rather than a swatch.
                    aria-label="Accent colour picker"
                    value={pickerValue}
                    onChange={(e) => setAccent(e.target.value)}
                    className="size-11 shrink-0 cursor-pointer rounded-sm border border-line-grey bg-cream p-1"
                  />
                  <label className="sr-only" htmlFor="sig-accent-hex">
                    Accent colour hex value
                  </label>
                  <input
                    id="sig-accent-hex"
                    className="field w-36 font-mono"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    aria-describedby="sig-accent-hint"
                  />
                </div>
                {/* The "type stays Arial/Helvetica" clause moved out — it answers
                  the custom-font FAQ rendered below the tool, word for word. */}
                <p className="hint mt-2" id="sig-accent-hint">
                  Used for the links, your company name and the accent rule.
                </p>
              </fieldset>
            </div>
          </Pane>
        }
        output={
          <Pane
            title={view === 'preview' ? 'Live preview' : 'Email-safe HTML'}
            padded={false}
            scroll={false}
            actions={isEmpty ? null : <CopyButton text={result.html} label="Copy HTML" />}
          >
            <div className="flex h-full min-h-0 flex-col">
              <div className="min-h-0 flex-1 overflow-auto">
                {isEmpty ? (
                  <div className="flex h-full items-center justify-center p-6">
                    <p className="max-w-[38ch] text-center text-[14px] text-ink-subtle leading-6">
                      Fill in a name on the left and your signature is assembled here,
                      inside a mock compose window — then switch to HTML to read the exact
                      nested-table markup that gets copied.
                    </p>
                  </div>
                ) : view === 'html' ? (
                  <CodePane
                    value={pretty}
                    language="html"
                    wrap
                    emptyLabel="Nothing to show yet."
                  />
                ) : (
                  <div className="flex flex-col gap-4 p-4">
                    {/* Mock compose window. A signature judged on empty white always
                      looks fine; judged under "Best," at the foot of a message, an
                      oversized photo or a shouty accent is obvious. This frame is
                      chrome and uses brand tokens; the signature inside renders the
                      user's own styling and is deliberately exempt. Only the chrome
                      swaps for the dark toggle — the message body and the signature
                      stay light, matching how Gmail/Outlook dark themes actually
                      behave: the compose surface itself, not arbitrary content, is
                      what goes dark. */}
                    {/* `print-paper-ctx` on the light branch pins the ink/line
                      tokens used below (New message / To / Subject labels) to
                      their light-mode values — this mock must read as a light
                      email client even when the site itself is in dark mode.
                      Only the light branch gets it: the dark branch already
                      uses literal white/opacity values plus the live `border-ink`
                      token, which correctly tracks site theme for contrast
                      against its own literal near-black background. */}
                    <div
                      className={`overflow-hidden rounded-card border ${
                        chromeTheme === 'dark'
                          ? 'border-ink bg-[#1c1c1e]'
                          : 'print-paper-ctx border-line-grey bg-white'
                      } ${narrow ? 'mx-auto max-w-[360px]' : ''}`}
                    >
                      <div
                        className={`border-b px-4 py-2.5 ${
                          chromeTheme === 'dark'
                            ? 'border-white/10 bg-[#141416]'
                            : // Literal, not `bg-offwhite` — that token flips dark
                              // in site dark mode, which would leave a near-black
                              // header floating inside this always-light frame.
                              'border-line-grey bg-[#fafafb]'
                        }`}
                      >
                        <p
                          className={`font-bold text-[11px] uppercase tracking-[0.1em] ${
                            chromeTheme === 'dark' ? 'text-white/50' : 'text-ink-subtle'
                          }`}
                        >
                          New message
                        </p>
                        <p
                          className={`mt-1 text-[13px] ${
                            chromeTheme === 'dark' ? 'text-white/80' : 'text-ink-muted'
                          }`}
                        >
                          <span
                            className={
                              chromeTheme === 'dark' ? 'text-white/50' : 'text-ink-subtle'
                            }
                          >
                            To{' '}
                          </span>
                          client@company.com
                        </p>
                        <p
                          className={`text-[13px] ${
                            chromeTheme === 'dark' ? 'text-white/80' : 'text-ink-muted'
                          }`}
                        >
                          <span
                            className={
                              chromeTheme === 'dark' ? 'text-white/50' : 'text-ink-subtle'
                            }
                          >
                            Subject{' '}
                          </span>
                          Re: Next steps
                        </p>
                      </div>
                      {/* print-paper-ctx applied unconditionally: this div sits
                        on a literal-white background in BOTH chrome themes
                        (its own `bg-white` when dark, the frame's `bg-white`
                        when light), so `text-ink-muted` needs pinning to its
                        light value either way — otherwise it turns pale lavender
                        in site dark mode and nearly disappears against the white
                        message body. */}
                      <div
                        className={`print-paper-ctx px-4 pt-4 text-[14px] leading-6 ${
                          chromeTheme === 'dark'
                            ? 'bg-white text-ink-muted'
                            : 'text-ink-muted'
                        }`}
                      >
                        <p>Sounds good — I’ll send the draft across tomorrow.</p>
                        <p className="mt-3">Best,</p>
                      </div>
                      {/* Safe to render with dangerouslySetInnerHTML ONLY because
                        buildSignatureHtml escapes every user-supplied value
                        (& < > " ') before it reaches this string, and restricts
                        every href to http(s)/tel:/mailto: — see escapeHtml and
                        resolveLink in logic.ts and their tests. No unescaped user
                        input can enter this markup. */}
                      <div
                        className={`overflow-x-auto px-4 pt-3 pb-5 ${
                          chromeTheme === 'dark' ? 'bg-white' : ''
                        }`}
                        dangerouslySetInnerHTML={{ __html: result.html }}
                      />
                    </div>

                    {/* Presentational only — see EMAIL_CLIENT_PREVIEWS. Switching the
                      pill never changes result.html or the mock window above; the
                      whole argument of this tool is that the markup is identical
                      everywhere, so there is nothing to actually re-render here. */}
                    <fieldset>
                      <legend className="label">Email client previews</legend>
                      <div className="flex flex-wrap gap-2">
                        {EMAIL_CLIENT_PREVIEWS.map((c) => (
                          <SegmentButton
                            key={c.id}
                            active={previewClient === c.id}
                            onClick={() => setPreviewClient(c.id)}
                          >
                            {c.label}
                          </SegmentButton>
                        ))}
                      </div>
                      <p className="hint mt-1.5">
                        A reference only — the copied HTML is identical across every
                        client above.
                      </p>
                    </fieldset>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-line border-t bg-offwhite p-4">
                {/* Warnings live here rather than in the preview so they survive the
                  switch to the HTML view — a dropped social URL is exactly the
                  thing you would otherwise hunt for in the source. */}
                {result.warnings.length > 0 ? (
                  <ul className="mb-4 flex flex-col gap-2">
                    {result.warnings.map((warning) => (
                      <li
                        key={warning}
                        className="flex items-start gap-2 rounded-sm border border-line-grey bg-tile-yellow p-3 text-[13px] text-ink-body leading-5"
                      >
                        <TriangleAlert
                          className="mt-0.5 size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* The Copy signature button itself now lives in the top button
                  grid (see the toolbar above) — this hint stays here because it
                  is about the current view, not a standalone action. */}
                <p className="hint max-w-[28ch]">
                  {view === 'html'
                    ? 'Indented here for reading — Copy HTML hands over the exact markup.'
                    : 'Copies as rich text, so it pastes in formatted rather than as code.'}
                </p>

                {copyState === 'fallback' ? (
                  <p className="mt-3 text-[13px] text-ink-body leading-5">
                    Your browser cannot write rich text to the clipboard, so the HTML
                    source was copied instead. Paste it into your client’s “edit signature
                    as HTML” or source view.
                  </p>
                ) : null}
                {copyState === 'error' ? (
                  <p className="mt-3 flex items-start gap-2 text-[13px] text-ink-body leading-5">
                    <TriangleAlert
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      Your browser refused clipboard access. Switch to the HTML view and
                      select the markup by hand, or allow clipboard permissions for this
                      site.
                    </span>
                  </p>
                ) : null}

                <fieldset className="mt-4">
                  <legend className="label">Install it in</legend>
                  <div className="flex flex-wrap gap-2">
                    {CLIENTS.map((c) => (
                      <SegmentButton
                        key={c.id}
                        active={client === c.id}
                        onClick={() => setClient(c.id)}
                      >
                        {c.label}
                      </SegmentButton>
                    ))}
                  </div>
                  <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5 text-[13px] text-ink-body leading-5">
                    {steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </fieldset>
              </div>
            </div>
          </Pane>
        }
        status={
          <StatusBar
            state={isEmpty ? 'neutral' : 'valid'}
            message={
              isEmpty
                ? 'Waiting for your details'
                : result.warnings.length > 0
                  ? `Ready to paste · ${result.warnings.length} thing${
                      result.warnings.length === 1 ? '' : 's'
                    } worth checking`
                  : 'Ready to paste'
            }
            stats={[
              { label: GMAIL_LIMIT_LABEL, value: String(result.html.length) },
              { label: 'layout', value: templateLabel },
              {
                label: hasRemoteImage ? 'remote image — often blocked' : 'remote images',
                value: hasRemoteImage ? '1' : '0',
              },
            ]}
            privacyNote="Built in your browser — no upload, no account"
          />
        }
      />

      <section
        aria-label="Signature summary"
        className="rounded-panel border border-line bg-cream p-5 md:p-6"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <fieldset>
            <legend className="label">Layout</legend>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => {
                const selected = template === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setTemplate(t.id)}
                    title={t.blurb}
                    className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-sm border p-2 transition-colors ${
                      selected
                        ? 'border-ink bg-violet-700 text-white'
                        : 'border-line-grey bg-cream text-ink hover:border-ink'
                    }`}
                  >
                    <TemplateGlyph id={t.id} selected={selected} />
                    <span className="font-bold text-[12px] leading-4">{t.label}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label">Brand colours</legend>
            <div className="flex flex-wrap gap-2">
              {ACCENT_SWATCHES.map((swatch) => {
                const active = normalizeHexColor(accent) === normalizeHexColor(swatch.hex)
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    aria-pressed={active}
                    title={swatch.label}
                    aria-label={swatch.label}
                    onClick={() => setAccent(swatch.hex)}
                    className={`size-9 shrink-0 rounded-full border-2 transition-colors ${
                      active ? 'border-ink' : 'border-transparent hover:border-line-grey'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                )
              })}
            </div>
            <p className="hint mt-2">Or pick a custom hex on the left.</p>
          </fieldset>

          <fieldset>
            <legend className="label">Signature options</legend>
            <ul className="flex flex-col gap-1.5">
              {SIGNATURE_OPTIONS.map((option) => (
                <li
                  key={option}
                  className="flex items-center gap-2 text-[13px] text-ink-body"
                >
                  <Check className="size-4 shrink-0 text-green" aria-hidden="true" />
                  {option}
                </li>
              ))}
            </ul>
          </fieldset>
        </div>
      </section>
    </div>
  )
}
