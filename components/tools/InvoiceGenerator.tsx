'use client'

// TriangleAlert, not AlertTriangle — this lucide version dropped the old alias.
import {
  Building2,
  ChevronDown,
  FileText,
  List,
  Minus,
  Package,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Percent,
  Plus,
  Printer,
  Settings as SettingsIcon,
  StickyNote,
  Tag,
  Trash2,
  TriangleAlert,
  User,
  X,
} from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { INVOICE_TEMPLATE_COMPONENTS } from '@/components/tools/invoice-templates'
import { CopyButton } from '@/components/tools/ResultPanel'
import {
  DropZone,
  SegmentButton,
  StatusBar,
  ToolbarGroup,
  ToolToolbar,
} from '@/components/tools/workspace'
import { trackToolEvent } from '@/lib/analytics'
import {
  addDays,
  CURRENCIES,
  type CurrencyCode,
  computeInvoice,
  daysBetween,
  dueDateFromTerms,
  formatMoney,
  INVOICE_TEMPLATES,
  type InvoiceDraft,
  isCurrencyCode,
  nextInvoiceNumber,
  parseAmountInput,
  parseInvoiceDraft,
  suggestInvoiceNumber,
  type TemplateId,
  toIsoDate,
} from '@/lib/tools/invoice-generator/logic'

/**
 * Invoice generator — one of 15 tools, but the only one with a bespoke layout
 * rather than the shared `ToolWorkspace` two-pane grid. Research brief:
 * docs/research/invoice-generator.md
 *
 * The A4 sheet is the product: it is not a "preview of" the invoice, it IS
 * the element the print stylesheet hands to the PDF writer.
 *
 * The shell is a dense four-column workspace once there's room for it (`lg`
 * and up): a narrow icon rail for the seven form sections, that section's
 * fields beside it, the sheet itself (large, auto-scaled to fill its box
 * exactly with no scrollbar — see `ScaledSheet`) in the centre with its own
 * toolbar, and a template/design sidebar on the right. Below `lg` there is
 * no room for four columns side by side, so the rail+fields collapse into one
 * column that sits ABOVE the sheet (you came here to fill the form; the sheet
 * is what you're checking as you go), and the design sidebar becomes a single
 * collapsible `<details>` section below it.
 *
 * Every template renders the SAME `InvoiceDraft`/`InvoiceTotals`, so which one
 * is selected can never change what a client is actually billed.
 *
 * All arithmetic is in logic.ts: integer minor units, one rounding step per
 * figure, and the guarantee that subtotal − discount + tax === total exactly.
 * Nothing in this file recomputes money.
 *
 * Three behaviours here are genuinely UI-side:
 *   - draft autosave — the whole form persists to localStorage (debounced) and
 *     restores on return, because an invoice is rarely finished in one sitting;
 *   - the printable region — #invoice-sheet, isolated by PRINT_CSS below, which
 *     is what makes "Download PDF" (`window.print()`) produce a clean invoice
 *     with no site chrome and no trailing blank pages;
 *   - the logo — read locally with FileReader into a data URL, so it prints,
 *     persists with the draft, and never leaves the browser.
 *
 * "Show business logo" (right sidebar → Document options) is real, but
 * deliberately NOT a field on `InvoiceDraft`: it only overrides what gets
 * PASSED to the rendered template (`effectiveDraft` below), never the stored
 * draft, so it needs no change to logic.ts's schema or persistence — turning
 * it off hides the logo on the live sheet (and therefore the PDF) without
 * ever touching the uploaded logo itself, and resets to "on" on reload since
 * it isn't part of the autosaved draft. Colour theme, Typography, Table
 * style, "Show thank-you note"/"Show signature", list view, undo/redo, and
 * PNG/send/share export were all removed at the user's request rather than
 * left as disabled "coming soon" placeholders — every template hardcodes
 * its own colours/fonts/table styling rather than reading them from a
 * shared variable, and reaching into all 11 template files to add that
 * would change their actual visual designs, which this rebuild must not do.
 */

const DRAFT_KEY = 'scult-tools:invoice-generator:v1'
const MAX_LINES = 50
const MAX_LOGO_BYTES = 1_000_000

/** Payment terms offered in the toolbar, in days after the issue date. */
const TERM_DAYS = [7, 14, 30] as const

/**
 * Zoom presets for the preview box. The box's CSS height is
 * `30rem * var(--inv-zoom)` (`46rem` from `lg`) — see the `--inv-zoom` custom
 * property set on the preview `section` below. Tailwind's class scanner needs
 * those `rem` figures as literal text in a className, which is why they are
 * written out there rather than interpolated from a constant here.
 */
const ZOOM_LEVELS = [75, 100, 125, 150] as const

/** How many template swatches show before "View all" is needed. */
const TEMPLATE_PREVIEW_COUNT = 6

type SidebarTabId =
  | 'business'
  | 'client'
  | 'items'
  | 'taxes'
  | 'notes'
  | 'branding'
  | 'settings'

/**
 * The left rail's tab set. "Payments" from the target wireframe is folded
 * into "Notes & payments" rather than getting its own tab — `notes` is one
 * free-text field with no separate payment-details value to split out, so a
 * distinct Payments tab bound to the same field would just show the same
 * textarea twice under two different names, which reads as broken rather
 * than as a second real surface.
 */
const SIDEBAR_TABS: ReadonlyArray<{
  id: SidebarTabId
  label: string
  heading: string
  icon: typeof Building2
}> = [
  { id: 'business', label: 'Business', heading: 'Business information', icon: Building2 },
  { id: 'client', label: 'Client', heading: 'Client information', icon: User },
  { id: 'items', label: 'Items', heading: 'Line items', icon: List },
  { id: 'taxes', label: 'Taxes', heading: 'Tax & discount', icon: Percent },
  {
    id: 'notes',
    label: 'Notes & payments',
    heading: 'Notes & payment details',
    icon: StickyNote,
  },
  { id: 'branding', label: 'Branding', heading: 'Branding & template', icon: Palette },
  { id: 'settings', label: 'Settings', heading: 'Invoice settings', icon: SettingsIcon },
]

/**
 * Row-id strategy, and why it is split in two:
 *
 * The SEEDED rows must have fixed ids. A module-level counter here caused a real
 * hydration mismatch — the server rendered `line-1`/`line-2`, but dev-mode
 * double-invocation advanced the counter before the client's first paint, which
 * hydrated as `line-11`/`line-12` and broke every label/input pairing. Anything
 * counter- or clock-derived in the server-rendered tree brings that bug back.
 *
 * USER-ADDED rows may use a counter freely: they can only ever be created after
 * hydration, inside an event handler, so the server never sees them.
 */
const DEFAULT_LINE_IDS = ['line-a', 'line-b', 'line-c'] as const

let userLineCounter = 0
function nextLineId(): string {
  userLineCounter += 1
  return `line-u${userLineCounter}`
}

/**
 * The seeded sample. Dates and the suggested invoice number depend on "today",
 * so they are filled in after mount and left blank during the server render —
 * the first client paint must match the server byte for byte.
 */
function makeDefaultDraft(today?: Date): InvoiceDraft {
  return {
    fromName: 'Studio Andaz',
    fromAddress: '42 Residency Road\nBengaluru, Karnataka 560025\nGSTIN 29ABCDE1234F1Z5',
    fromEmail: 'billing@studioandaz.in',
    toName: 'Meridian Traders Pvt Ltd',
    toAddress: '8 FC Road\nPune, Maharashtra 411004\nGSTIN 27FGHIJ5678K1Z2',
    toEmail: 'accounts@meridiantraders.in',
    invoiceNumber: today ? suggestInvoiceNumber(today, 1) : '',
    issueDate: today ? toIsoDate(today) : '',
    dueDate: today ? toIsoDate(addDays(today, 14)) : '',
    currency: 'INR',
    lines: [
      {
        id: DEFAULT_LINE_IDS[0],
        description: 'Website design — 5 pages, 2 rounds of revisions',
        quantity: '1',
        rate: '45000',
      },
      {
        id: DEFAULT_LINE_IDS[1],
        description: 'Content writing (per page)',
        quantity: '5',
        rate: '1800',
      },
      {
        id: DEFAULT_LINE_IDS[2],
        description: 'Analytics & Search Console setup',
        quantity: '1',
        rate: '6500',
      },
    ],
    taxLabel: 'GST 18%',
    taxPercent: '18',
    discount: '0',
    discountKind: 'percent',
    notes:
      'Payment due within 14 days of the issue date.\n\nBank transfer — Studio Andaz, HDFC Bank, A/C 50100123456789, IFSC HDFC0000123.\nUPI: studioandaz@okhdfcbank\n\nPlease quote the invoice number with your payment.',
    logo: '',
    template: 'trade',
  }
}

/**
 * Clear starts a genuinely blank invoice, but keeps the things that are
 * settings rather than content: the currency, the chosen template, a fresh
 * number in the same series, and today's dates. Emptying those would just be
 * work to redo.
 */
function makeEmptyDraft(
  today: Date,
  currency: CurrencyCode,
  template: TemplateId,
): InvoiceDraft {
  return {
    fromName: '',
    fromAddress: '',
    fromEmail: '',
    toName: '',
    toAddress: '',
    toEmail: '',
    invoiceNumber: suggestInvoiceNumber(today, 1),
    issueDate: toIsoDate(today),
    dueDate: toIsoDate(addDays(today, 14)),
    currency,
    lines: [{ id: nextLineId(), description: '', quantity: '1', rate: '' }],
    taxLabel: '',
    taxPercent: '',
    discount: '0',
    discountKind: 'percent',
    notes: '',
    logo: '',
    template,
  }
}

/**
 * The print stylesheet. This is the export path — there is no server, no
 * headless Chrome and no PDF library, so everything about the PDF is decided
 * here.
 *
 * Two passes, deliberately:
 *   1. A `visibility` pass. Universal support, and it keeps layout intact, so
 *      the sheet is pulled to the page origin absolutely. On its own it leaves
 *      the collapsed page occupying space, which can trail blank pages.
 *   2. A `:has()` pass, behind @supports. Everything that is not the sheet, a
 *      descendant of it, or an ANCESTOR of it is display:none'd; the ancestors
 *      are then flattened to plain blocks. The workspace's panes are
 *      independently scrolling boxes with a min-height, so that flattening must
 *      release overflow and height as well as spacing — otherwise the PDF is
 *      truncated at one screenful, which is the failure mode this rule exists
 *      to prevent.
 */
const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 14mm; }
  body * { visibility: hidden; }
  #invoice-sheet, #invoice-sheet * { visibility: visible; }
  #invoice-sheet {
    position: absolute; left: 0; top: 0; width: 100%;
    max-width: none; margin: 0; padding: 0; border: none; border-radius: 0;
    box-shadow: none; aspect-ratio: auto; min-height: 0;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  #invoice-sheet tr { break-inside: avoid; }
  /* Repeat the column headings on every page of a 50-line invoice. */
  #invoice-sheet thead { display: table-header-group; }
}
/* Where :has() is supported (all evergreen browsers), collapse everything that
   is not the invoice sheet or one of its ancestors, so the hidden page cannot
   leave trailing blank pages behind the sheet. */
@supports selector(html:has(body)) {
  @media print {
    body *:not(#invoice-sheet):not(#invoice-sheet *):not(:has(#invoice-sheet)) {
      display: none !important;
    }
    body :has(#invoice-sheet) {
      display: block !important; position: static !important;
      margin: 0 !important; padding: 0 !important; border: 0 !important;
      border-radius: 0 !important; box-shadow: none !important;
      background: #fff !important; max-width: none !important;
      width: auto !important; min-height: 0 !important; height: auto !important;
      overflow: visible !important; transform: none !important;
    }
    #invoice-sheet { position: static !important; }
  }
}
`

/** An inline field problem. Icon plus wording, so colour is never the signal. */
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p className="mt-1.5 flex gap-1.5 font-medium text-[13px] text-ink" id={id}>
      <TriangleAlert
        className="mt-0.5 size-3.5 shrink-0 text-violet-700"
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  )
}

/**
 * A form section. `<fieldset>`/`<legend>` so the grouping is real rather than
 * visual — a screen reader announces the section name with each field inside it.
 *
 * The dividing rule sits on the CONTENT wrapper, not on the fieldset. A
 * `border-top` on a fieldset is interrupted by its own legend (the UA notches
 * the block-start border to seat it), which renders as a broken line; putting
 * the rule under the legend gives an unbroken section header instead.
 */
function FormSection({
  legend,
  children,
}: {
  legend: string
  children: React.ReactNode
}) {
  return (
    <fieldset>
      <legend className="px-0 font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
        {legend}
      </legend>
      <div className="mt-2 border-line border-t pt-4">{children}</div>
    </fieldset>
  )
}

/** The fixed design width every template is built to (`max-w-[860px]`). */
const SHEET_WIDTH = 860

/**
 * Scales a fixed-size A4 sheet down (or up) to exactly fill its container,
 * with no scrollbar ever appearing — the user's explicit requirement.
 *
 * Why this exists: a template's root div sizes itself from `aspect-[210/297]
 * w-full`, so its rendered height depends on how wide its container is. A
 * plain `overflow-auto` pane (the previous approach) works, but "works" means
 * "scrolls when it doesn't fit" — exactly the failure mode being fixed here.
 * Rendering the sheet at a fixed design WIDTH (860px, natural height) inside a
 * CSS `transform: scale()` wrapper sidesteps the whole problem: the sheet
 * always computes the same internal layout, and only the PAINTED size changes
 * to match whatever box it's given.
 *
 * The height is MEASURED, not assumed from the aspect ratio, and that
 * distinction is load-bearing: `aspect-ratio` is a preferred size, not a cap
 * — a template whose content (a longer address, more line items, a note) needs
 * more room than the pure 210:297 ratio provides at 860px will render TALLER
 * than that ratio, same as any flex column with no `overflow`/max-height
 * fights back. Assuming the ratio's own height here reproduced exactly the
 * bug `min-h-0` fixed in `ToolWorkspace`'s `Pane` — the sheet quietly grew a
 * few percent past the box this component computed for it, and the excess
 * painted outside the fit. Measuring `contentRef.current.offsetHeight` reads
 * whatever height the sheet actually settled on, so the fit is always exact
 * regardless of how tall a given template + invoice combination turns out.
 *
 * `useLayoutEffect` + `ResizeObserver` rather than a CSS-only fit: no CSS
 * property can express "scale my child so it exactly fits my variable-size
 * self" — that ratio can only be computed in JS from measured pixel sizes.
 * `useLayoutEffect` (not `useEffect`) so the scale is set before the browser
 * paints, avoiding a one-frame flash of the unscaled sheet. Both the
 * container AND the content are observed: the container resizes when the
 * viewport does, the content resizes when a template or the invoice's own
 * content (more line items, a longer note) changes its natural height —
 * either one changing the required scale.
 *
 * Print safety: this wrapper is an ANCESTOR of `#invoice-sheet` whenever it
 * wraps the live pane instance, so PRINT_CSS's ancestor-flattening rule
 * explicitly resets `transform: none !important` on it — otherwise the PDF
 * would inherit whatever scale factor happened to be showing on screen.
 *
 * `offsetWidth`/`offsetHeight` for BOTH the container and the content — never
 * `getBoundingClientRect()` on either. This site runs its whole UI at
 * `zoom: 1.1` (see globals.css) for density, and `zoom` is one of the rare CSS
 * properties `getBoundingClientRect()` actually reports post-scaling while
 * `offsetWidth`/`offsetHeight` do not. Measuring the container via
 * `getBoundingClientRect()` (zoomed) against the content via `offsetHeight`
 * (unzoomed) silently multiplied the computed scale by the zoom factor, so
 * the sheet rendered ~10% larger than its box everywhere the fit was
 * checked — small enough to read as "slightly off" in a screenshot, exactly
 * why it survived a first pass and needed measuring by hand to actually find.
 * Reading both figures the same way makes the ambient zoom cancel out
 * regardless of what it's set to.
 */
function ScaledSheet({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return
    function compute() {
      if (!container || !content) return
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight
      const naturalWidth = content.offsetWidth
      const naturalHeight = content.offsetHeight
      if (
        naturalWidth === 0 ||
        naturalHeight === 0 ||
        containerWidth === 0 ||
        containerHeight === 0
      ) {
        return
      }
      setScale(Math.min(containerWidth / naturalWidth, containerHeight / naturalHeight))
    }
    compute()
    const observer = new ResizeObserver(compute)
    observer.observe(container)
    observer.observe(content)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div ref={contentRef} style={{ width: SHEET_WIDTH, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}

/** A thin abstract bar standing in for a line of text in a thumbnail. */
function TextBar({
  widthClass = 'w-full',
  toneClass = 'bg-ink/15',
}: {
  widthClass?: string
  toneClass?: string
}) {
  return <div className={`h-[3px] rounded-full ${widthClass} ${toneClass}`} />
}

/**
 * A schematic — not a shrunk-down live render — of each template's most
 * distinguishing visual move: Agency's dark masthead band, Trade's heavy
 * black frame, Clinic's green side-stripe, and so on. This exists because the
 * first version of this grid rendered the REAL template at ~110px wide, which
 * scales 15px body text down to under 2px tall — completely illegible, just a
 * grey smear. A hand-drawn schematic using abstract bars for "text" stays
 * honestly readable at thumbnail size while still showing the one thing that
 * actually distinguishes 11 templates from a glance: colour and shape, not
 * paragraphs no one can read at 12% scale anyway.
 *
 * Every case's root carries `print-paper-ctx`, the same escape hatch the real
 * templates render inside of (see InvoiceGenerator's canvas section and the
 * "Preview invoice" modal). Without it, `border-ink`/`bg-ink/NN` (the "text
 * bar" and hairline simulations) resolve to the site's DARK-mode ink value —
 * near-white — which paints them invisible against these swatches' `bg-white`
 * root; that same near-white value is what a bare screenshot in dark mode
 * shows as a blank card. Pinning ink/line back to their light values here
 * keeps every swatch reading as the light paper it is meant to depict,
 * regardless of the site theme — exactly the same contract `.print-paper-ctx`
 * already gives the real templates.
 */
function TemplateThumbnail({ templateId }: { templateId: TemplateId }) {
  const lines = (
    <div className="flex flex-col gap-[3px]">
      <TextBar widthClass="w-[70%]" />
      <TextBar widthClass="w-[45%]" />
    </div>
  )

  switch (templateId) {
    case 'agency':
      return (
        <div className="print-paper-ctx flex h-full flex-col overflow-hidden rounded-[2px] border border-line-grey bg-white">
          <div className="h-[34%] shrink-0 bg-violet-900" />
          <div className="flex flex-1 flex-col justify-center gap-1.5 p-2">{lines}</div>
        </div>
      )
    case 'boutique':
      return (
        <div className="print-paper-ctx flex h-full flex-col overflow-hidden rounded-[2px] border border-line bg-white">
          <div className="h-[28%] shrink-0 bg-tile-lavender" />
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 p-2">
            <TextBar widthClass="w-[55%]" />
            <TextBar widthClass="w-[35%]" />
          </div>
        </div>
      )
    case 'hospitality':
      return (
        <div className="print-paper-ctx flex h-full flex-col justify-between overflow-hidden rounded-[2px] border border-line-grey bg-cream p-2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-2 w-[36%] rounded-full bg-peach" />
            {lines}
          </div>
          <TextBar widthClass="w-[50%]" toneClass="bg-ink/20" />
        </div>
      )
    case 'nonprofit':
      return (
        <div className="print-paper-ctx flex h-full flex-col justify-between overflow-hidden rounded-[2px] border border-line-grey bg-cream p-2">
          <div className="flex flex-col gap-1.5">
            {lines}
            <div className="mt-0.5 h-[3px] w-full rounded-full bg-lime" />
          </div>
          <div className="h-2 w-[40%] rounded-full bg-lime" />
        </div>
      )
    case 'trade':
      return (
        <div className="print-paper-ctx flex h-full flex-col justify-between overflow-hidden rounded-[2px] border-2 border-ink bg-white p-2">
          <div className="flex flex-col gap-1.5">{lines}</div>
          <div className="h-2.5 w-full bg-cta-pure" />
        </div>
      )
    case 'retail':
      return (
        <div className="print-paper-ctx flex h-full flex-col items-center justify-between overflow-hidden rounded-[2px] border border-line-grey bg-white p-2">
          <div className="flex w-[70%] flex-col items-center gap-1.5 border-line-grey border-b border-dashed pb-1.5">
            {lines}
          </div>
          <div className="h-2 w-[45%] rounded-full bg-tile-green" />
        </div>
      )
    case 'tech':
      return (
        <div className="print-paper-ctx flex h-full flex-col gap-1.5 overflow-hidden rounded-[2px] border border-line-grey bg-white p-2">
          {lines}
          <div className="mt-auto h-[30%] w-full rounded-sm border border-violet-100 bg-tile-lavender" />
        </div>
      )
    case 'corporate':
      return (
        <div className="print-paper-ctx flex h-full flex-col gap-1.5 overflow-hidden rounded-[2px] border border-ink bg-white p-2">
          <div className="border-violet-700 border-b-2 pb-1.5">{lines}</div>
          <div className="mt-auto h-[26%] w-full rounded-[1px] border border-violet-700" />
        </div>
      )
    case 'clinic':
      return (
        <div className="print-paper-ctx flex h-full overflow-hidden rounded-md border border-line-grey border-l-4 border-l-tile-green bg-white">
          <div className="flex flex-1 flex-col justify-center gap-1.5 p-2">
            {lines}
            <div className="h-[22%] w-full rounded-md bg-tile-green/30" />
          </div>
        </div>
      )
    case 'minimal':
      return (
        <div className="print-paper-ctx flex h-full flex-col justify-center gap-2 overflow-hidden rounded-[2px] border border-line-grey/60 bg-white p-2.5">
          <TextBar widthClass="w-[60%]" toneClass="bg-ink/25" />
          <TextBar widthClass="w-[38%]" />
          <TextBar widthClass="w-[20%]" toneClass="bg-violet-700/70" />
        </div>
      )
    default:
      return (
        <div className="print-paper-ctx flex h-full flex-col justify-between overflow-hidden rounded-[2px] border border-line-grey bg-white p-2">
          <div className="flex flex-col gap-1.5">{lines}</div>
          <div className="h-px w-full bg-ink" />
          <div className="flex justify-end">
            <TextBar widthClass="w-[30%]" toneClass="bg-ink/25" />
          </div>
        </div>
      )
  }
}

/**
 * One cell in the template picker grid. Shows `TemplateThumbnail`'s schematic
 * rather than a live shrunk render — see that component's docblock for why.
 */
function TemplateSwatch({
  templateId,
  label,
  active,
  onSelect,
}: {
  templateId: TemplateId
  label: string
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      title={label}
      className={`flex flex-col gap-1.5 rounded-sm border p-1.5 text-left transition-colors ${
        active
          ? 'border-violet-700 bg-violet-50 ring-1 ring-violet-700'
          : 'border-line-grey hover:border-violet-700'
      }`}
    >
      <div className="aspect-[210/297] w-full">
        <TemplateThumbnail templateId={templateId} />
      </div>
      <span
        className={`truncate text-[11px] leading-4 ${active ? 'font-semibold text-violet-700' : 'text-ink-muted'}`}
      >
        {label}
      </span>
    </button>
  )
}

/**
 * The narrow icon-over-label rail — Business/Client/Items/Taxes/Notes &
 * payments/Branding/Settings. Standard roving-tabindex tab pattern with
 * automatic activation (arrow keys both move focus and switch the panel) —
 * there is nothing costly enough behind any panel to prefer manual activation
 * here.
 *
 * A horizontal-scrolling pill row below `lg`, a real vertical rail from `lg`
 * up — a ~96px-wide vertical column of icon-over-label cells only makes sense
 * once there is a left column that width to give it; on a phone the same
 * seven tabs read better as one scrollable row.
 */
function SidebarTabRail({
  activeTab,
  onSelect,
}: {
  activeTab: SidebarTabId
  onSelect: (id: SidebarTabId) => void
}) {
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    const index = SIDEBAR_TABS.findIndex((t) => t.id === activeTab)
    if (index === -1) return
    let nextIndex: number | undefined
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      nextIndex = (index + 1) % SIDEBAR_TABS.length
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + SIDEBAR_TABS.length) % SIDEBAR_TABS.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = SIDEBAR_TABS.length - 1
    }
    if (nextIndex === undefined) return
    e.preventDefault()
    const next = SIDEBAR_TABS[nextIndex]
    if (next) onSelect(next.id)
  }

  return (
    <div
      role="tablist"
      aria-label="Invoice form sections"
      aria-orientation="vertical"
      onKeyDown={onKeyDown}
      className="flex gap-1 overflow-x-auto border-line border-b p-2 lg:w-24 lg:shrink-0 lg:flex-col lg:overflow-visible lg:border-b-0"
    >
      {SIDEBAR_TABS.map((tab) => {
        const Icon = tab.icon
        const active = tab.id === activeTab
        return (
          <button
            key={tab.id}
            id={`inv-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`inv-tabpanel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            className={`flex min-h-11 shrink-0 flex-col items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 py-2 text-center font-medium text-[11px] leading-tight transition-colors sm:min-h-9 lg:w-full lg:whitespace-normal lg:py-2.5 ${
              active
                ? 'bg-violet-100 text-violet-700'
                : 'text-ink-muted hover:bg-violet-50 hover:text-violet-700'
            }`}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * A small pill switch — used by Document options. No such control existed
 * anywhere in the codebase before this rebuild, so it is
 * built here rather than reached for from a shared library.
 *
 * The clickable button keeps the codebase's `min-h-11 sm:min-h-9` touch-target
 * convention (see `SegmentButton`/`ToolbarAction`) even though the switch's
 * own visual track is much smaller than that — the extra hit area is
 * transparent padding around a small, centred pill, not a bigger switch.
 */
function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  title,
}: {
  checked: boolean
  onChange?: (next: boolean) => void
  label: string
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={title}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className="inline-flex min-h-11 items-center px-1 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-9"
    >
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
          checked ? 'border-violet-700 bg-violet-700' : 'border-line-grey bg-cream'
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block size-[18px] rounded-full bg-white shadow-card transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-1'
          } ${checked ? '' : 'border border-line-grey'}`}
        />
      </span>
    </button>
  )
}

/** One cell of the "Quick add" grid — jumps to a tab and, where a real
 * "add a blank row" handler exists for that field, invokes it too. */
function QuickAddButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Plus
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-sm border border-line-grey bg-cream px-2 py-3 text-center font-medium text-[12px] text-ink-muted transition-colors hover:border-violet-700 hover:text-violet-700"
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  )
}

export function InvoiceGenerator() {
  const [draft, setDraft] = useState<InvoiceDraft>(() => makeDefaultDraft())
  const [savedAt, setSavedAt] = useState(0)
  const [logoError, setLogoError] = useState('')
  const [exportOpen, setExportOpen] = useState(false)
  // Pure UI state — which sidebar tab, how big the preview box renders, how
  // much of the template grid shows, and whether the logo is drawn on the
  // live sheet. None of this is part of `InvoiceDraft`: switching tabs, zoom,
  // "View all" or the logo-visibility toggle must never touch the autosaved
  // draft or the print path's source of truth.
  const [activeTab, setActiveTab] = useState<SidebarTabId>('business')
  const [zoom, setZoom] = useState<(typeof ZOOM_LEVELS)[number]>(75)
  const [templatesExpanded, setTemplatesExpanded] = useState(false)
  // Collapses the fields column to just its icon rail on desktop, freeing
  // ~24rem for the sheet. Only meaningful at `lg` and up — below that the
  // fields already stack full-width above the sheet, so there's nothing to
  // collapse and the toggle button is hidden there.
  const [fieldsOpen, setFieldsOpen] = useState(true)
  const [showLogo, setShowLogo] = useState(true)
  const hydrated = useRef(false)
  const lastAddedLineId = useRef<string | null>(null)
  // "Quick add → Add tax/discount/note" focus handoff: which field to focus
  // once its tab is showing, and a signal that always changes even when the
  // requested tab was ALREADY active (so clicking "Add tax" while already on
  // the Taxes tab still moves focus to the rate field, rather than being a
  // no-op because `setActiveTab` bailed out on an unchanged value).
  const pendingFocusRef = useRef<string | null>(null)
  const [focusSignal, setFocusSignal] = useState(0)

  // Restore the autosaved draft after mount, never during render: the server
  // has no localStorage, and reading it in render would desync hydration.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY)
      if (stored !== null) {
        const parsed = parseInvoiceDraft(JSON.parse(stored))
        if (parsed) {
          setDraft(parsed)
          hydrated.current = true
          return
        }
      }
    } catch {
      // Blocked storage or corrupt JSON — fall through to fresh defaults.
    }
    const today = new Date()
    setDraft((d) => ({
      ...d,
      invoiceNumber: suggestInvoiceNumber(today, 1),
      issueDate: toIsoDate(today),
      dueDate: toIsoDate(addDays(today, 14)),
    }))
    hydrated.current = true
  }, [])

  // Debounced autosave. The cleanup cancels the pending write on every
  // keystroke, so only a 600ms pause actually touches localStorage.
  useEffect(() => {
    if (!hydrated.current) return
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
        setSavedAt(Date.now())
      } catch {
        // Private mode blocks writes; the form still works, just without a draft.
      }
    }, 600)
    return () => clearTimeout(t)
  }, [draft])

  useEffect(() => {
    if (savedAt === 0) return
    const t = setTimeout(() => setSavedAt(0), 2500)
    return () => clearTimeout(t)
  }, [savedAt])

  // The export dialog is a look-closer-and-choose-a-template surface, not a
  // second editable form, so it gets Escape-to-close and a scroll lock but
  // not MobileDrawer's full focus trap — nothing inside it needs tabbing
  // through beyond the close button and the template swatches themselves.
  useEffect(() => {
    if (!exportOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setExportOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [exportOpen])

  // Fires once per "Quick add" click (see `focusSignal` above), after the
  // requested tab's panel has committed to the DOM, and moves focus to the
  // field that click promised to jump to.
  useEffect(() => {
    if (focusSignal === 0) return
    const id = pendingFocusRef.current
    pendingFocusRef.current = null
    if (id === null) return
    const el = document.getElementById(id)
    if (el instanceof HTMLElement) el.focus()
    // `focusSignal` is the trigger; `activeTab`'s value is irrelevant here.
  }, [focusSignal])

  const result = useMemo(
    () =>
      computeInvoice({
        lines: draft.lines.map((line) => ({
          quantity: parseAmountInput(line.quantity),
          rate: parseAmountInput(line.rate),
        })),
        taxPercent: parseAmountInput(draft.taxPercent),
        discount: parseAmountInput(draft.discount),
        discountKind: draft.discountKind,
      }),
    [draft.lines, draft.taxPercent, draft.discount, draft.discountKind],
  )

  const currency = draft.currency
  const taxLabel = draft.taxLabel.trim() !== '' ? draft.taxLabel : 'Tax'
  const SelectedTemplate =
    INVOICE_TEMPLATE_COMPONENTS[draft.template] ?? INVOICE_TEMPLATE_COMPONENTS.classic
  const currentTemplateLabel =
    INVOICE_TEMPLATES.find((t) => t.id === draft.template)?.label ?? draft.template
  const termDays = daysBetween(draft.issueDate, draft.dueDate)
  const lineErrorCount = result.lineAmounts.filter((l) => l.error !== undefined).length

  // What actually gets RENDERED — never what gets SAVED. "Show business logo"
  // (Document options, right sidebar) only swaps this object in for the two
  // template instances below; `draft.logo` itself, the autosave payload and
  // the upload/remove controls in the Business tab all keep using `draft`
  // unchanged. See this file's top docblock for why it's built this way.
  const effectiveDraft: InvoiceDraft = showLogo ? draft : { ...draft, logo: '' }

  /**
   * The reconciliation guarantee, re-checked at the point of display rather than
   * asserted. It holds by construction in logic.ts; verifying it here means the
   * status bar reports something computed, not a marketing claim.
   */
  const reconciles =
    result.subtotal - result.discountAmount + result.taxAmount === result.total

  const notices: readonly string[] = [
    ...result.warnings,
    ...(termDays !== undefined && termDays < 0
      ? ['The due date falls before the issue date — worth checking.']
      : []),
    ...(logoError !== '' ? [logoError] : []),
  ]

  function patch(partial: Partial<InvoiceDraft>): void {
    setDraft((d) => ({ ...d, ...partial }))
  }

  function patchLine(
    id: string,
    partial: Partial<{ description: string; quantity: string; rate: string }>,
  ): void {
    setDraft((d) => ({
      ...d,
      lines: d.lines.map((line) => (line.id === id ? { ...line, ...partial } : line)),
    }))
  }

  function addLine(): void {
    const id = nextLineId()
    lastAddedLineId.current = id
    setDraft((d) => ({
      ...d,
      lines: [...d.lines, { id, description: '', quantity: '1', rate: '' }],
    }))
  }

  function removeLine(id: string): void {
    setDraft((d) => ({ ...d, lines: d.lines.filter((line) => line.id !== id) }))
  }

  /** Sets the due date to N days after the issue date, per the chosen term. */
  function applyTerm(days: number): void {
    setDraft((d) => {
      // dueDateFromTerms returns '' for a half-typed date, which doubles as the
      // validity check: if the issue date is not a real date yet, use today's.
      const issue =
        dueDateFromTerms(d.issueDate, 0) !== '' ? d.issueDate : toIsoDate(new Date())
      const due = dueDateFromTerms(issue, days)
      if (due === '') return d
      return { ...d, issueDate: issue, dueDate: due }
    })
  }

  function clearAll(): void {
    if (!window.confirm('Clear the whole invoice and start again?')) return
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // Nothing to remove if storage is blocked.
    }
    setLogoError('')
    setDraft((d) => makeEmptyDraft(new Date(), d.currency, d.template))
  }

  function readLogo(file: File): void {
    // DropZone already enforces the byte ceiling and reports it. Type is checked
    // here because a drag-and-drop bypasses the input's `accept` filter.
    if (!file.type.startsWith('image/')) {
      setLogoError('Choose an image file — PNG, JPG, SVG or WebP.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const data = reader.result
      if (typeof data === 'string' && data.startsWith('data:image/')) {
        setLogoError('')
        patch({ logo: data })
      } else {
        setLogoError('That file could not be read. Try a PNG or JPG.')
      }
    }
    reader.onerror = () => setLogoError('That file could not be read. Try a PNG or JPG.')
    reader.readAsDataURL(file)
  }

  /** Switches to a tab and asks the focus effect above to land on `focusId`
   * once that tab's panel is showing — used by "Quick add" for the three
   * fields that have no "add a blank row" concept to invoke (see `quickAddItem`
   * for the one Quick-add button that DOES call a real add-row handler). */
  function quickAddFocus(tab: SidebarTabId, focusId: string): void {
    pendingFocusRef.current = focusId
    setActiveTab(tab)
    setFocusSignal((n) => n + 1)
  }

  function quickAddItem(): void {
    setActiveTab('items')
    addLine()
  }

  function decrementZoom(): void {
    setZoom((z) => {
      const index = ZOOM_LEVELS.indexOf(z)
      return ZOOM_LEVELS[Math.max(0, index - 1)] ?? z
    })
  }

  function incrementZoom(): void {
    setZoom((z) => {
      const index = ZOOM_LEVELS.indexOf(z)
      return ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, index + 1)] ?? z
    })
  }

  const visibleTemplates = templatesExpanded
    ? INVOICE_TEMPLATES
    : INVOICE_TEMPLATES.slice(0, TEMPLATE_PREVIEW_COUNT)

  return (
    <>
      <style>{PRINT_CSS}</style>

      {/* One bespoke layout, not the shared ToolWorkspace two-pane grid every
          other tool uses — deliberately, at the user's request. A dense
          four-column workspace (icon rail, that tab's fields, the sheet
          itself, a template/design sidebar) once there's room for it; below
          `lg` the rail+fields collapse into one column ABOVE the sheet and
          the design sidebar becomes a collapsible section below it.

          The sheet itself has a fixed natural width (SHEET_WIDTH, 860px) and
          ScaledSheet shrinks it to fit whatever box it's given. On
          ToolShell's normal container-site cap (1160px) minus the two fixed
          side columns (24rem + 18rem = 672px) minus their own padding, the
          sheet was landing in roughly a 400px box — under half its natural
          width. A first attempt broke this tool out to full viewport width
          (up to a 1600px cap) to fix that, but that made the workspace span
          edge-to-edge on a typical ~1366px laptop screen while the page's
          own header stayed at the normal, narrower width above it — a
          jarring, disproportionate jump, not what "fits the screen" means.
          Staying inside container-site's normal width and instead letting
          the two collapsible side columns below (PanelLeftClose on the
          fields column, the `<details>` on Column 4) be how a user reclaims
          space is the fix that doesn't fight the rest of the page's own
          layout. */}
      <div className="overflow-hidden rounded-panel border border-line bg-cream">
        <div className="flex flex-col lg:flex-row">
          {/* Column 1 + 2 — the icon rail and the active tab's fields. Kept as
              one bordered unit (rail | fields) so the divider between them and
              the divider between this unit and the sheet read as one
              consistent ruleset, same idiom the previous layout used. */}
          <div
            className={`flex flex-col border-line border-b lg:flex-none lg:flex-row lg:border-b-0 lg:border-r ${
              fieldsOpen ? 'lg:w-[24rem]' : 'lg:w-24'
            }`}
          >
            <SidebarTabRail activeTab={activeTab} onSelect={setActiveTab} />
            <div
              className={`flex min-w-0 flex-1 flex-col border-line border-t p-4 sm:p-5 lg:border-t-0 lg:border-l ${
                fieldsOpen ? '' : 'lg:hidden'
              }`}
            >
              <div className="flex-1">
                <div
                  role="tabpanel"
                  id="inv-tabpanel-business"
                  aria-labelledby="inv-tab-business"
                  hidden={activeTab !== 'business'}
                >
                  <h2 className="mb-4 text-[17px]">Business information</h2>
                  <div className="flex flex-col gap-5">
                    <FormSection legend="Your business">
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="label" htmlFor="inv-from-name">
                            Your business
                          </label>
                          <input
                            id="inv-from-name"
                            className="field"
                            type="text"
                            autoComplete="organization"
                            value={draft.fromName}
                            onChange={(e) => patch({ fromName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="label" htmlFor="inv-from-address">
                            Your address
                          </label>
                          <textarea
                            id="inv-from-address"
                            className="field"
                            rows={3}
                            value={draft.fromAddress}
                            onChange={(e) => patch({ fromAddress: e.target.value })}
                            aria-describedby="inv-from-address-hint"
                          />
                          <p className="hint mt-1.5" id="inv-from-address-hint">
                            Put your GSTIN or VAT number on its own line here.
                          </p>
                        </div>
                        <div>
                          <label className="label" htmlFor="inv-from-email">
                            Your email
                          </label>
                          <input
                            id="inv-from-email"
                            className="field"
                            type="email"
                            autoComplete="email"
                            value={draft.fromEmail}
                            onChange={(e) => patch({ fromEmail: e.target.value })}
                          />
                        </div>
                      </div>
                    </FormSection>

                    <FormSection legend="Logo (optional)">
                      {draft.logo === '' ? (
                        <DropZone
                          accept="image/png,image/jpeg,image/svg+xml,image/webp"
                          maxBytes={MAX_LOGO_BYTES}
                          onFile={readLogo}
                          label="Drop your logo, or choose a file"
                          hint="PNG, JPG, SVG or WebP under 1 MB"
                        />
                      ) : (
                        <div className="flex flex-wrap items-center gap-3 rounded-card border border-line-grey bg-offwhite p-3">
                          {/* biome-ignore lint/performance/noImgElement: a local data URL — next/image cannot optimise it, and user data must not be sent to an optimiser */}
                          <img
                            src={draft.logo}
                            alt=""
                            className="max-h-12 max-w-[120px] object-contain"
                          />
                          <p className="min-w-[14ch] flex-1 text-[13px] text-ink-muted">
                            Added — prints on the invoice, saved with your local draft.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              patch({ logo: '' })
                              setLogoError('')
                            }}
                            className="min-h-11 rounded-sm border border-line-grey bg-cream px-3 font-medium text-[14px] transition-colors hover:border-violet-700 hover:text-violet-700"
                          >
                            Remove logo
                          </button>
                        </div>
                      )}
                    </FormSection>
                  </div>
                </div>

                <div
                  role="tabpanel"
                  id="inv-tabpanel-client"
                  aria-labelledby="inv-tab-client"
                  hidden={activeTab !== 'client'}
                >
                  <h2 className="mb-4 text-[17px]">Client information</h2>
                  <FormSection legend="Bill to">
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="label" htmlFor="inv-to-name">
                          Client
                        </label>
                        <input
                          id="inv-to-name"
                          className="field"
                          type="text"
                          autoComplete="off"
                          value={draft.toName}
                          onChange={(e) => patch({ toName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="inv-to-address">
                          Client address
                        </label>
                        <textarea
                          id="inv-to-address"
                          className="field"
                          rows={3}
                          value={draft.toAddress}
                          onChange={(e) => patch({ toAddress: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="inv-to-email">
                          Client email
                        </label>
                        <input
                          id="inv-to-email"
                          className="field"
                          type="email"
                          autoComplete="off"
                          value={draft.toEmail}
                          onChange={(e) => patch({ toEmail: e.target.value })}
                        />
                      </div>
                    </div>
                  </FormSection>
                </div>

                <div
                  role="tabpanel"
                  id="inv-tabpanel-items"
                  aria-labelledby="inv-tab-items"
                  hidden={activeTab !== 'items'}
                >
                  <h2 className="mb-4 text-[17px]">Line items</h2>
                  {/* Rows always stack (description, then qty/rate, then
                      amount + delete) rather than a wide 4-column row — a
                      ~280px fields column cannot fit description, qty, rate,
                      amount and a delete button side by side and stay
                      legible, so this reuses the same stacked shape the old
                      layout already fell back to below the `sm` breakpoint. */}
                  <FormSection legend="Line items">
                    <div className="flex flex-col gap-4">
                      {draft.lines.map((line, index) => {
                        const amount = result.lineAmounts[index]
                        const lineError = amount?.error
                        const errorId = `inv-line-${line.id}-error`
                        const rowName = `Line ${index + 1}`
                        return (
                          <div
                            key={line.id}
                            className="rounded-sm border border-line-grey p-3"
                          >
                            <div className="flex flex-col gap-2">
                              <div>
                                <label
                                  className="sr-only"
                                  htmlFor={`inv-desc-${line.id}`}
                                >
                                  {rowName} description
                                </label>
                                <input
                                  id={`inv-desc-${line.id}`}
                                  ref={(el) => {
                                    if (el && lastAddedLineId.current === line.id) {
                                      el.focus()
                                      lastAddedLineId.current = null
                                    }
                                  }}
                                  className="field"
                                  type="text"
                                  autoComplete="off"
                                  placeholder={`Item ${index + 1}`}
                                  value={line.description}
                                  onChange={(e) =>
                                    patchLine(line.id, { description: e.target.value })
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label
                                    className="sr-only"
                                    htmlFor={`inv-qty-${line.id}`}
                                  >
                                    {rowName} quantity
                                  </label>
                                  <input
                                    id={`inv-qty-${line.id}`}
                                    className="field tabular-nums"
                                    type="text"
                                    inputMode="decimal"
                                    autoComplete="off"
                                    placeholder="1"
                                    value={line.quantity}
                                    onChange={(e) =>
                                      patchLine(line.id, { quantity: e.target.value })
                                    }
                                    aria-describedby={lineError ? errorId : undefined}
                                  />
                                </div>
                                <div>
                                  <label
                                    className="sr-only"
                                    htmlFor={`inv-rate-${line.id}`}
                                  >
                                    {rowName} rate
                                  </label>
                                  <input
                                    id={`inv-rate-${line.id}`}
                                    className="field tabular-nums"
                                    type="text"
                                    inputMode="decimal"
                                    autoComplete="off"
                                    placeholder="0.00"
                                    value={line.rate}
                                    onChange={(e) =>
                                      patchLine(line.id, { rate: e.target.value })
                                    }
                                    aria-describedby={lineError ? errorId : undefined}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[15px] text-ink tabular-nums">
                                  {lineError
                                    ? '—'
                                    : formatMoney(amount?.amount ?? 0, currency)}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => removeLine(line.id)}
                                  disabled={draft.lines.length <= 1}
                                  aria-label={`Remove ${rowName.toLowerCase()}`}
                                  className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-line-grey bg-cream transition-colors hover:border-violet-700 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-45"
                                >
                                  <Trash2 className="size-4" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                            {lineError ? (
                              <FieldError id={errorId}>{lineError}</FieldError>
                            ) : null}
                          </div>
                        )
                      })}

                      <div>
                        <button
                          type="button"
                          onClick={addLine}
                          disabled={draft.lines.length >= MAX_LINES}
                          className="btn-brutal btn-brutal-sm btn-white"
                        >
                          <Plus className="size-4" aria-hidden="true" />
                          Add line
                        </button>
                      </div>
                    </div>
                  </FormSection>
                </div>

                <div
                  role="tabpanel"
                  id="inv-tabpanel-taxes"
                  aria-labelledby="inv-tab-taxes"
                  hidden={activeTab !== 'taxes'}
                >
                  <h2 className="mb-4 text-[17px]">Tax &amp; discount</h2>
                  <FormSection legend="Tax & discount">
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="label" htmlFor="inv-tax-label">
                          Tax label
                        </label>
                        <input
                          id="inv-tax-label"
                          className="field"
                          type="text"
                          autoComplete="off"
                          placeholder="GST 18%"
                          value={draft.taxLabel}
                          onChange={(e) => patch({ taxLabel: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="inv-tax-rate">
                          Tax rate (%)
                        </label>
                        <input
                          id="inv-tax-rate"
                          className="field tabular-nums"
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          placeholder="18"
                          value={draft.taxPercent}
                          onChange={(e) => patch({ taxPercent: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Nested fieldset: the two kind toggles and the value belong to
                          one another, and a real <legend> beats role="group". */}
                    <fieldset className="mt-4">
                      <legend className="label px-0">Discount</legend>
                      <div className="flex flex-wrap items-start gap-2">
                        <SegmentButton
                          active={draft.discountKind === 'percent'}
                          onClick={() => patch({ discountKind: 'percent' })}
                          title="A percentage of the subtotal"
                        >
                          Percent
                        </SegmentButton>
                        <SegmentButton
                          active={draft.discountKind === 'flat'}
                          onClick={() => patch({ discountKind: 'flat' })}
                          title={`A flat amount in ${currency}`}
                        >
                          Flat amount
                        </SegmentButton>
                        <div className="w-32">
                          <label className="sr-only" htmlFor="inv-discount">
                            Discount value
                          </label>
                          <input
                            id="inv-discount"
                            className="field tabular-nums"
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            placeholder="0"
                            value={draft.discount}
                            onChange={(e) => patch({ discount: e.target.value })}
                            aria-describedby="inv-discount-hint"
                          />
                        </div>
                      </div>
                      <p className="hint mt-1.5" id="inv-discount-hint">
                        {draft.discountKind === 'percent'
                          ? 'A percentage of the subtotal, applied before tax.'
                          : `A flat amount in ${currency}, applied before tax.`}
                      </p>
                    </fieldset>
                  </FormSection>
                </div>

                <div
                  role="tabpanel"
                  id="inv-tabpanel-notes"
                  aria-labelledby="inv-tab-notes"
                  hidden={activeTab !== 'notes'}
                >
                  <h2 className="mb-4 text-[17px]">Notes &amp; payment details</h2>
                  <FormSection legend="Notes & payment details">
                    <label className="sr-only" htmlFor="inv-notes">
                      Notes and payment details
                    </label>
                    <textarea
                      id="inv-notes"
                      className="field"
                      rows={5}
                      value={draft.notes}
                      onChange={(e) => patch({ notes: e.target.value })}
                    />
                  </FormSection>
                </div>

                <div
                  role="tabpanel"
                  id="inv-tabpanel-branding"
                  aria-labelledby="inv-tab-branding"
                  hidden={activeTab !== 'branding'}
                >
                  <h2 className="mb-4 text-[17px]">Branding &amp; template</h2>
                  {/* No backing field on `InvoiceDraft` for a colour theme,
                      typography or table style — those live as disabled
                      "coming soon" controls in the right sidebar, next to the
                      template gallery they belong with. This tab stays a
                      lightweight summary rather than duplicating them. */}
                  <FormSection legend="Design">
                    <div className="flex items-center gap-3">
                      <div className="aspect-[210/297] w-16 shrink-0">
                        <TemplateThumbnail templateId={draft.template} />
                      </div>
                      <div>
                        <p className="font-semibold text-[14px] text-ink">
                          {currentTemplateLabel}
                        </p>
                        <p className="mt-0.5 text-[13px] text-ink-muted">
                          Change the design, colour theme and typography in the panel on
                          the right.
                        </p>
                      </div>
                    </div>
                  </FormSection>
                </div>

                <div
                  role="tabpanel"
                  id="inv-tabpanel-settings"
                  aria-labelledby="inv-tab-settings"
                  hidden={activeTab !== 'settings'}
                >
                  <h2 className="mb-4 text-[17px]">Invoice settings</h2>
                  <div className="flex flex-col gap-5">
                    <FormSection legend="Numbering & dates">
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="label" htmlFor="inv-number">
                            Invoice number
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              id="inv-number"
                              className="field"
                              type="text"
                              autoComplete="off"
                              spellCheck={false}
                              value={draft.invoiceNumber}
                              onChange={(e) => patch({ invoiceNumber: e.target.value })}
                              aria-describedby="inv-number-hint"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                patch({
                                  invoiceNumber: nextInvoiceNumber(draft.invoiceNumber),
                                })
                              }
                              className="min-h-11 rounded-sm border border-line-grey bg-cream px-3 font-medium text-[13px] text-ink transition-colors hover:border-violet-700 hover:text-violet-700 sm:min-h-9"
                            >
                              Next number
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="label" htmlFor="inv-issue-date">
                            Issue date
                          </label>
                          <input
                            id="inv-issue-date"
                            className="field"
                            type="date"
                            value={draft.issueDate}
                            onChange={(e) => patch({ issueDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="label" htmlFor="inv-due-date">
                            Due date
                          </label>
                          <input
                            id="inv-due-date"
                            className="field"
                            type="date"
                            value={draft.dueDate}
                            onChange={(e) => patch({ dueDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <p className="hint mt-1.5" id="inv-number-hint">
                        “Next number” advances the last digits and keeps your padding, so
                        INV-2026-001 becomes INV-2026-002 and 2026/09 becomes 2026/10.
                      </p>
                    </FormSection>

                    <FormSection legend="Currency & payment terms">
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="label" htmlFor="inv-currency">
                            Currency
                          </label>
                          <select
                            id="inv-currency"
                            className="field"
                            value={draft.currency}
                            onChange={(e) => {
                              const value = e.target.value
                              if (isCurrencyCode(value)) patch({ currency: value })
                            }}
                          >
                            {CURRENCIES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <span className="label">Payment terms</span>
                          <div className="mt-1.5 flex flex-wrap gap-2">
                            {TERM_DAYS.map((days) => (
                              <SegmentButton
                                key={days}
                                active={termDays === days}
                                onClick={() => applyTerm(days)}
                                title={`Due ${days} days after the issue date`}
                              >
                                Net {days}
                              </SegmentButton>
                            ))}
                          </div>
                        </div>
                      </div>
                    </FormSection>
                  </div>
                </div>
              </div>

              {/* "Quick add" — outside the tab switch, visible no matter which
                  tab is active. Only "Add item" has a real "add a blank row"
                  handler to call (`addLine`): tax, discount and notes are each
                  a single scalar field on `InvoiceDraft`, not a list, so there
                  is no equivalent row to add. Those three instead jump to the
                  right tab and focus the field you'd fill in — the closest
                  real equivalent, rather than a button that has to fake
                  "adding" something that structurally cannot repeat. */}
              <div className="mt-6 border-line border-t pt-4">
                <p className="px-0 font-bold text-[11px] text-ink-subtle uppercase tracking-[0.1em]">
                  Quick add
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <QuickAddButton
                    icon={Package}
                    label="Add item"
                    onClick={quickAddItem}
                  />
                  <QuickAddButton
                    icon={Percent}
                    label="Add tax"
                    onClick={() => quickAddFocus('taxes', 'inv-tax-rate')}
                  />
                  <QuickAddButton
                    icon={Tag}
                    label="Add discount"
                    onClick={() => quickAddFocus('taxes', 'inv-discount')}
                  />
                  <QuickAddButton
                    icon={FileText}
                    label="Add note"
                    onClick={() => quickAddFocus('notes', 'inv-notes')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 — the toolbar and the sheet itself. */}
          <div className="flex min-w-0 flex-1 flex-col border-line border-b lg:border-b-0">
            <div className="border-line border-b bg-offwhite">
              <ToolToolbar
                actions={
                  <>
                    {/* Desktop-only: below `lg` the fields column already
                        stacks full-width above the sheet, so there's
                        nothing to collapse and this button would be a
                        no-op — hidden rather than shown-but-inert. */}
                    <button
                      type="button"
                      onClick={() => setFieldsOpen((v) => !v)}
                      title={fieldsOpen ? 'Hide fields panel' : 'Show fields panel'}
                      className="hidden min-h-9 items-center gap-1.5 rounded-sm border border-line-grey bg-cream px-3 font-medium text-[13px] text-ink transition-colors hover:border-violet-700 hover:text-violet-700 lg:inline-flex"
                    >
                      {fieldsOpen ? (
                        <PanelLeftClose className="size-4" aria-hidden="true" />
                      ) : (
                        <PanelLeftOpen className="size-4" aria-hidden="true" />
                      )}
                      {fieldsOpen ? 'Hide fields' : 'Show fields'}
                    </button>
                    {/* Not the shared ToolbarAction here on purpose — that
                        component is neutral gray by design since it's
                        reused across every tool on the site, some of which
                        don't want a violet accent on every button. This
                        tool's own controls carry the brand accent
                        (violet-700 border/text) directly instead. */}
                    <button
                      type="button"
                      onClick={clearAll}
                      className="min-h-9 rounded-sm border border-line-grey bg-cream px-3 font-medium text-[13px] text-ink transition-colors hover:border-violet-700 hover:text-violet-700"
                    >
                      Clear
                    </button>
                    {/* The primary export entry point, moved up here from
                        the bottom bar so it's visible without scrolling —
                        opens a dialog with the live preview alongside every
                        template, not just a bigger look at the current one
                        (that's what the old "Preview" button did; this
                        replaces it, since choosing a template belongs at
                        the export moment, not buried in Column 4).
                        btn-brutal-sm — the site's real CTA treatment
                        (cta-yellow, shadow-brutal) — since this is the
                        single most important action on the page, not just
                        another toolbar utility. */}
                    <button
                      type="button"
                      onClick={() => {
                        setExportOpen(true)
                        trackToolEvent('invoice-generator', 'open_export')
                      }}
                      className="btn-brutal btn-brutal-sm border-black text-black hover:border-ink hover:text-ink"
                    >
                      <Printer className="size-4" aria-hidden="true" />
                      Export PDF
                    </button>
                  </>
                }
              >
                <ToolbarGroup label="Zoom">
                  <button
                    type="button"
                    onClick={decrementZoom}
                    disabled={zoom === ZOOM_LEVELS[0]}
                    aria-label="Zoom out"
                    title="Zoom out"
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-line-grey bg-cream text-ink transition-colors hover:border-violet-700 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-9 sm:min-w-9"
                  >
                    <Minus className="size-4" aria-hidden="true" />
                  </button>
                  <span
                    className="min-w-[3.5ch] text-center font-medium text-[13px] text-ink tabular-nums"
                    aria-live="polite"
                  >
                    {zoom}%
                  </span>
                  <button
                    type="button"
                    onClick={incrementZoom}
                    disabled={zoom === ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                    aria-label="Zoom in"
                    title="Zoom in"
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-line-grey bg-cream text-ink transition-colors hover:border-violet-700 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-9 sm:min-w-9"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </button>
                </ToolbarGroup>
              </ToolToolbar>
            </div>

            <section
              aria-label="Invoice preview"
              className="print-paper-ctx min-h-0 min-w-0 flex-1 bg-offwhite p-4 sm:p-6"
              style={{ '--inv-zoom': zoom / 100 } as React.CSSProperties}
            >
              {/* The box `ScaledSheet` fits into grows/shrinks with `--inv-zoom`;
                  `ScaledSheet` itself is untouched, so it still measures with
                  `offsetWidth`/`offsetHeight` and still never shows a
                  scrollbar at the 100% default, where the box height is
                  exactly what it always was.

                  46rem (736px) was tuned for a much shorter sheet than a
                  real multi-line invoice actually renders at 860px wide —
                  once the WIDTH fix above gave the sheet enough room, THIS
                  fixed height became the new binding constraint instead
                  (ScaledSheet's scale is Math.min(widthRatio, heightRatio)),
                  quietly re-shrinking it back down to ~0.68x. 72rem gives
                  enough headroom for a typical multi-line-item invoice to
                  clear the height check and let width be the real
                  constraint, without making the box unreasonably tall on
                  first load. */}
              <div className="h-[calc(30rem*var(--inv-zoom))] lg:h-[calc(72rem*var(--inv-zoom))]">
                {/* THE PRINTABLE REGION. PRINT_CSS targets this id — everything
                    else on the page is collapsed around it, so what you see here
                    is exactly and only what lands in the PDF. Only THIS instance
                    of the selected template may carry the id: the swatch grid
                    below and the "Preview invoice" modal both render additional
                    instances without one, since the print stylesheet's
                    `#invoice-sheet` selector would match every element that has
                    it and double (or worse) the PDF if more than one did. */}
                <ScaledSheet>
                  <SelectedTemplate
                    id="invoice-sheet"
                    draft={effectiveDraft}
                    result={result}
                    currency={currency}
                    taxLabel={taxLabel}
                  />
                </ScaledSheet>
              </div>
            </section>
          </div>

          {/* Column 4 — template gallery + design controls. A `<details>`,
              now genuinely toggleable on desktop too (it used to be locked
              open there via `lg:pointer-events-none`, one of the two
              fixed-width columns that left the sheet itself badly
              squeezed; see the fields column's own PanelLeftClose toggle
              for the other one).

              Defaults CLOSED (no `open` attribute) rather than open: this
              is a one-time "pick a template" decision, not something that
              needs to stay visible the whole time someone is editing an
              invoice, and starting closed hands its ~230px straight back
              to the sheet without the user having to discover and click
              anything — the sheet should look properly A4-sized on first
              paint, not just after a manual toggle. The chevron + label
              stay visible either way as the open affordance. */}
          <details
            // `<details>` only ever collapsed CONTENT height, never the
            // column's own width — lg:w-72 stayed fixed even closed, so
            // closing it on desktop wasted the space instead of returning
            // it to the sheet. `[&:not([open])]:lg:w-14` overrides the
            // width to a slim closed rail once this element itself loses
            // its `open` attribute, at the same breakpoint the fixed width
            // applies.
            className="group flex flex-col border-line border-t lg:w-72 lg:flex-none lg:border-t-0 lg:border-l [&:not([open])]:lg:w-14"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between p-3 [&::-webkit-details-marker]:hidden">
              {/* Hidden at the lg collapsed-rail width (56px, set above) —
                  there's no room for this label there, only the chevron.
                  Always visible on mobile, where summary width is never
                  the constraint. */}
              <span className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.1em] lg:hidden lg:group-open:inline">
                Design &amp; template
              </span>
              <ChevronDown
                className="size-4 text-ink-subtle transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <div className="flex flex-col">
              <section
                aria-label="Choose a template"
                className="border-line border-t p-3"
              >
                <div className="flex items-center justify-between px-0.5">
                  <p className="font-bold text-[11px] text-ink-subtle uppercase tracking-[0.1em]">
                    Template
                  </p>
                  {INVOICE_TEMPLATES.length > TEMPLATE_PREVIEW_COUNT ? (
                    <button
                      type="button"
                      onClick={() => setTemplatesExpanded((v) => !v)}
                      className="font-semibold text-[12px] text-violet-700 hover:underline"
                    >
                      {templatesExpanded ? 'Show fewer' : 'View all'}
                    </button>
                  ) : null}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {visibleTemplates.map((t) => {
                    const [shortLabel] = t.label.split(' — ')
                    return (
                      <TemplateSwatch
                        key={t.id}
                        templateId={t.id}
                        label={shortLabel ?? t.label}
                        active={draft.template === t.id}
                        onSelect={() => patch({ template: t.id })}
                      />
                    )
                  })}
                </div>
              </section>

              <div className="border-line border-t p-3">
                <p className="px-0.5 font-bold text-[11px] text-ink-subtle uppercase tracking-[0.1em]">
                  Document options
                </p>
                <div className="mt-2 flex flex-col gap-2 px-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-ink-muted">Show business logo</span>
                    <ToggleSwitch
                      checked={showLogo}
                      onChange={setShowLogo}
                      label="Show business logo on the invoice"
                      title={
                        draft.logo === ''
                          ? 'Add a logo on the Business tab first'
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>

        {notices.length > 0 ? (
          <ul className="flex flex-col gap-2 border-line border-t p-4 sm:p-6">
            {notices.map((notice) => (
              <li
                key={notice}
                className="flex items-start gap-2 rounded-sm border border-line-grey bg-tile-yellow p-3 text-[13px] text-ink-body leading-5"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{notice}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Bottom bar — autosave status on the left; "Copy total" on the
            right, a real, working feature with no other slot in this
            layout. The actual PDF export moved to the top-of-tool "Export
            PDF" button and its dialog — no duplicate download action down
            here competing with it. */}
        <div className="border-line border-t bg-offwhite">
          <ToolToolbar
            actions={
              <CopyButton
                text={formatMoney(result.total, currency)}
                label="Copy total"
                onCopy={() => trackToolEvent('invoice-generator', 'copy_total')}
              />
            }
          >
            <span className="text-[12px] text-ink-subtle">
              {savedAt !== 0 ? 'Draft saved' : 'Autosaves locally'}
            </span>
          </ToolToolbar>
        </div>

        <div className="bg-offwhite">
          <StatusBar
            state={
              lineErrorCount > 0
                ? 'invalid'
                : result.subtotal > 0 && reconciles
                  ? 'valid'
                  : 'neutral'
            }
            message={
              lineErrorCount > 0
                ? `${lineErrorCount} line ${lineErrorCount === 1 ? 'item needs' : 'items need'} a valid number`
                : result.subtotal === 0
                  ? 'Add a quantity and rate to a line item'
                  : reconciles
                    ? 'Ready to print — every column reconciles exactly'
                    : 'Totals do not reconcile — please report this'
            }
            stats={[
              { label: 'line items', value: String(draft.lines.length) },
              { label: 'total due', value: formatMoney(result.total, currency) },
              {
                label: 'payment term',
                value: termDays === undefined ? '—' : `Net ${termDays}`,
              },
            ]}
            privacyNote="Never uploaded — the PDF comes from your own browser, the draft stays on this device"
          />
        </div>
      </div>

      {/* Export dialog — the live sheet on the left (a second instance of
          the same template, deliberately WITHOUT the `invoice-sheet` id:
          see the inline Column-3 instance's own comment — this one is
          display-only and never a print target, `window.print()` below
          still isolates the real one via PRINT_CSS regardless of what's
          visually on top of it), every template as a picker on the right.
          Replaces the old plain "bigger look" preview modal — choosing a
          template belongs at the export moment, not only buried in Column
          4's collapsible gallery (which still exists, for picking a
          template before you're ready to export). */}
      {/* This scrim's onClick only fires setExportOpen when the click TARGET
          is the scrim itself (not bubbled from the dialog card inside it),
          so a tap anywhere on the dialog cannot dismiss it — no separate
          stopPropagation guard needed on the card wrapper below. */}
      {exportOpen ? (
        // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users already have Escape, wired in the effect above.
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setExportOpen(false)
          }}
          className="fixed inset-0 z-70 overflow-auto bg-ink/60 p-4 sm:p-10"
        >
          <div className="relative mx-auto w-full max-w-[1200px] rounded-panel bg-white p-4 sm:p-6">
            <button
              type="button"
              onClick={() => setExportOpen(false)}
              className="-top-12 sm:-top-4 absolute right-0 flex size-10 items-center justify-center rounded-full bg-white text-ink shadow-card transition-colors hover:text-violet-700 sm:-right-14"
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>

            <h2
              id="export-dialog-title"
              className="font-display font-semibold text-[19px] text-ink"
            >
              Export invoice
            </h2>

            {/* flex, not grid — an arbitrary grid-cols-[1fr_1.15fr] track
                has no minmax(0,...) floor the way Tailwind's own numbered
                grid-cols-N utilities do, so the second track was sizing to
                its content's shrink-to-fit width (~260px) instead of its
                fr share. flex-1/w-[26rem] on plain flex children doesn't
                have that gotcha, and it's the same pattern the fixed-width
                columns elsewhere in this file already use. */}
            <div className="mt-4 flex flex-col gap-6 lg:flex-row">
              {/* Live preview — ScaledSheet again, same auto-fit-to-box
                  logic the inline Column-3 sheet uses, just in a shorter
                  box sized for this dialog rather than the page. */}
              <div className="print-paper-ctx min-w-0 flex-1 rounded-md border border-line-grey bg-offwhite p-4">
                <div className="h-[50vh] lg:h-[65vh]">
                  <ScaledSheet>
                    <SelectedTemplate
                      draft={effectiveDraft}
                      result={result}
                      currency={currency}
                      taxLabel={taxLabel}
                    />
                  </ScaledSheet>
                </div>
              </div>

              {/* Template picker — every template, not just the first
                  TEMPLATE_PREVIEW_COUNT: this dialog IS the "view all"
                  moment, so there's no "Show fewer" toggle to reach for. */}
              <div className="flex flex-col lg:w-[26rem] lg:flex-none">
                <p className="font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
                  Choose a template
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 lg:max-h-[55vh]">
                  {INVOICE_TEMPLATES.map((t) => {
                    const [shortLabel] = t.label.split(' — ')
                    return (
                      <TemplateSwatch
                        key={t.id}
                        templateId={t.id}
                        label={shortLabel ?? t.label}
                        active={draft.template === t.id}
                        onSelect={() => patch({ template: t.id })}
                      />
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    trackToolEvent('invoice-generator', 'download_pdf', {
                      template: draft.template,
                    })
                    window.print()
                  }}
                  className="btn-brutal mt-4 justify-center"
                >
                  <Printer className="size-4" aria-hidden="true" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
