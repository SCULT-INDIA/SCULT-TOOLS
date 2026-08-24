import {
  ArrowUpRight,
  BadgeCheck,
  History,
  Lightbulb,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { BrandIcon, brandForTool, categoryBrand } from '@/components/ui/BrandIcon'
import { Icon } from '@/components/ui/Icon'
import { PromptCard } from '@/components/ui/PromptCard'
import { RequestButton } from '@/components/ui/RequestButton'
import { getPromptsByCategory } from '@/lib/prompts/registry'
import type { Prompt, PromptCategory } from '@/lib/prompts/types'
import { getTool } from '@/lib/tools/registry'
import { resolveServiceLink } from '@/lib/tools/service-links'
import { HowToUseButton } from './HowToUseButton'
import { PromptCopyBlock } from './PromptCopyBlock'
import { StaleVerificationNotice } from './StaleVerificationNotice'

const TILE_BG: Record<PromptCategory['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/**
 * The prompt detail page. Design language: the category's pastel tile as a
 * neo-brutalist hero panel (hard ink border + offset shadow, fixed across
 * themes like every other tile/brand element on the site), the official
 * brand mark of the target tool on a white chip, the prompt itself as a
 * dark editor card (PromptCopyBlock), and Scult's signature yellow
 * btn-brutal CTAs throughout.
 */
export function PromptDetailShell({
  prompt,
  category,
}: {
  prompt: Prompt
  category: PromptCategory
}) {
  const related = getPromptsByCategory(prompt.category)
    .filter((p) => p.slug !== prompt.slug)
    .slice(0, 4)
  const relatedTool = prompt.relatedToolSlug ? getTool(prompt.relatedToolSlug) : undefined
  const service = resolveServiceLink(
    prompt.serviceTarget ?? category.serviceTarget,
    prompt.slug,
  )
  const latestVerification = prompt.verifiedAgainst[0]
  // For brand-less categories the hero mark falls back to the VERIFICATION
  // tool's brand, not the first targetTools entry — the mark sits directly
  // above "Verified against <tool>", and showing e.g. OpenAI's logo over
  // "Verified against Claude" reads as a mistake.
  const heroBrand =
    categoryBrand(category.slug) ??
    (latestVerification ? brandForTool(latestVerification.tool) : null)

  return (
    // `relative z-[45]`: the first fix for this page only raised the
    // prompt/customize section above the fixed WhatsApp/Scult buttons in
    // components/ui/FloatingActions.tsx (z-40) — but every OTHER section on
    // this page (Why this works, What you get back, Verified against,
    // Changelog, the related-tool card, the closing CTA) is exactly as tall
    // and exactly as likely to scroll through the same bottom-corner zone,
    // confirmed live in a follow-up recording showing the WhatsApp icon
    // sitting on top of the "Why this works" panel. Elevating the whole
    // article once, here, covers all of it in one place instead of
    // chasing each section individually. Scoped to prompt detail pages only
    // — this does not touch `<main>` in app/layout.tsx, so no other route on
    // the site is affected. Still safely below the sticky header's z-50
    // (verified previously) and below the "How to use" / "Request a prompt"
    // dialogs' z-70.
    <article className="container-site relative z-[45] max-w-[50rem] pt-8 pb-20">
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex flex-wrap items-center gap-2 text-[13px] text-ink-subtle">
          <li>
            <Link href="/" className="hover:text-violet-600">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/prompts" className="hover:text-violet-600">
              Prompts
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/prompts/${category.slug}`} className="hover:text-violet-600">
              {category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-muted">
            {prompt.title}
          </li>
        </ol>
      </nav>

      {/* Hero — the category's pastel tile as a brutal panel. Text inside is
          always ink-on-pastel (tiles never adapt per theme). */}
      <header
        className={`rounded-panel border border-ink p-6 shadow-brutal md:p-9 ${TILE_BG[category.tile]}`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-ink/10 bg-white shadow-[0_2px_8px_rgb(0_0_0/0.08)]">
            {heroBrand ? (
              <BrandIcon brand={heroBrand} size={30} />
            ) : (
              <Icon name={category.icon} className="size-7 text-violet-700" />
            )}
          </span>
          <div>
            <Link
              href={`/prompts/${category.slug}`}
              className="font-bold text-[12px] text-black/60 uppercase tracking-[0.14em] hover:text-violet-700"
            >
              {category.name}
            </Link>
            {latestVerification ? (
              <p className="mt-0.5 flex items-center gap-1 font-medium text-[13px] text-black/70">
                <BadgeCheck className="size-4 text-green" aria-hidden="true" />
                Verified against {latestVerification.tool} · {latestVerification.date}
              </p>
            ) : null}
          </div>
        </div>

        <h1 className="mt-5 text-[30px] text-black leading-[1.08] tracking-[-1px] md:text-[40px]">
          {prompt.title}
        </h1>
        <p className="mt-4 max-w-[60ch] text-[16px] text-black/70 leading-7 md:text-[17px]">
          {prompt.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {prompt.targetTools.map((tool) => {
            const toolBrand = brandForTool(tool)
            return (
              <span
                key={tool}
                className="flex items-center gap-1.5 rounded-pill border border-ink/15 bg-white px-3 py-1.5 font-medium text-[12.5px] text-black"
              >
                {toolBrand ? <BrandIcon brand={toolBrand} size={14} /> : null}
                {tool}
              </span>
            )
          })}
          {prompt.variables.length > 0 ? (
            <span className="flex items-center gap-1.5 rounded-pill border border-ink/15 bg-white px-3 py-1.5 font-medium text-[12.5px] text-black">
              <SlidersHorizontal
                className="size-3.5 text-violet-700"
                aria-hidden="true"
              />
              {prompt.variables.length} fillable{' '}
              {prompt.variables.length === 1 ? 'variable' : 'variables'}
            </span>
          ) : null}
        </div>
      </header>

      {category.contentBoundary ? (
        <div className="mt-6 flex items-start gap-3 rounded-card border border-line-grey bg-offwhite p-4 text-[13px] text-ink-muted leading-5">
          <TriangleAlert
            className="mt-0.5 size-4 shrink-0 text-ink-subtle"
            aria-hidden="true"
          />
          <span>
            <strong className="text-ink-body">Scope for this category:</strong>{' '}
            {category.contentBoundary}
          </span>
        </div>
      ) : null}

      {/* Full-bleed breakout: the prompt/customize workspace is the one part
          of this page that benefits from real width — a code-style editor
          and a multi-field form both cramp hard inside the article's 50rem
          reading column, which is tuned for prose, not for a split-pane
          layout. `w-screen` + the negative-margin centering trick escapes
          that 50rem parent out to the viewport; `container-site` then takes
          over exactly as it does everywhere else on the page (the header,
          the hero), capping it at the SAME 1160px and applying the SAME
          `padding-inline` — so this section lands on precisely the same
          left/right edges as every other full-width component on the page,
          not an independently-chosen width that would misalign against
          them. (An earlier version capped at 1440px against the raw
          viewport instead of the site's own container, which read as
          wider than and out of step with everything above and below it —
          this is the fix.) Safe against the scrollbar-width mismatch
          `100vw` carries — see `overflow-x: hidden` on `html` in
          globals.css, added for exactly this pattern.

          `z-[45]` HERE, not (only) on the inner Customize panel that needs
          it: `-translate-x-1/2` is a `transform`, and any transformed
          element creates its own CSS stacking context — every z-index set
          on a descendant is compared only against siblings INSIDE that
          context, never against anything outside it. The Customize panel's
          own z-45 (see PromptCopyBlock.tsx) was consequently trapped in
          here and never actually competed against
          `components/ui/FloatingActions.tsx`'s fixed `z-40` WhatsApp/Scult
          corner buttons, which live outside this transformed section
          entirely — confirmed live via `document.elementFromPoint()` at
          the exact overlap coordinates: the FAB was still winning despite
          the panel's own z-45. Setting it on this section too raises the
          WHOLE transformed context's priority, which is what actually
          lets the panel's content win the comparison.

          `w-[calc(100vw/var(--page-zoom))]`, not `w-screen` (100vw): this
          page renders under `app/globals.css`'s site-wide `zoom:
          var(--page-zoom)` (1.1), and `100vw` is a viewport-absolute
          reference that zoom does NOT scale down to compensate — it stays
          the real device width as a CSS length, then gets rendered 10%
          bigger by the zoom, same as everything else. The header and hero
          never hit this because they use plain `container-site` (`width:
          100%`), a percentage that's zoom-safe by construction (it
          resolves against its already-zoomed parent). `100vw` has no
          parent to resolve against, so it needs the same 10% divided back
          out first, landing on the true device width once zoom re-applies
          it. Confirmed live: with plain `w-screen` at a 1078px viewport,
          this section's own rendered box (`getBoundingClientRect`) came out
          ~108px wider than the viewport — clipped asymmetrically by
          `overflow-x: hidden` on `html` into a visibly shifted, misaligned
          strip instead of a clean edge-to-edge section, exactly what showed
          up as broken alignment. See the fuller writeup on `zoom` itself in
          globals.css. */}
      <section
        aria-labelledby="prompt-text"
        className="container-site relative z-[45] left-1/2 mt-12 w-[calc(100vw/var(--page-zoom))] -translate-x-1/2"
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="prompt-text" className="text-[24px] tracking-[-0.5px] md:text-[28px]">
            The prompt
          </h2>
          <p className="text-[13px] text-ink-subtle">
            Ready to copy —{' '}
            <span className="underline decoration-[3px] decoration-cta underline-offset-2">
              highlighted
            </span>{' '}
            parts are example details you can swap.
          </p>
        </div>

        {/* Two small text-link actions, not a second row of loud CTAs — the
            one button that matters on this page is "Copy prompt" inside the
            editor below, and these two stay visually quiet so they don't
            compete with it. */}
        <div className="mb-5 flex flex-wrap items-center gap-5">
          <HowToUseButton
            category={prompt.category}
            promptSlug={prompt.slug}
            targetTools={prompt.targetTools}
            hasVariables={prompt.variables.length > 0}
          />
          <RequestButton
            defaultKind="prompt_request"
            affectedTool={category.name}
            trackContext={prompt.slug}
            triggerLabel="Request a prompt"
          />
        </div>

        <PromptCopyBlock
          category={prompt.category}
          promptSlug={prompt.slug}
          promptText={prompt.promptText}
          variables={prompt.variables}
        />
      </section>

      <section aria-labelledby="why-it-works" className="mt-10">
        {/* bg-violet-50 is theme-fixed light — text on it must be literal
            black, never adaptive ink (which flips near-white in dark mode). */}
        <div className="rounded-panel border border-line bg-violet-50 p-6 md:p-7">
          <h2
            id="why-it-works"
            className="flex items-center gap-2.5 font-display font-semibold text-[19px] text-black tracking-normal"
          >
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-violet-700">
              <Lightbulb className="size-4.5 text-white" aria-hidden="true" />
            </span>
            Why this works
          </h2>
          <p className="mt-3.5 text-[14.5px] text-black/70 leading-[1.7]">
            {prompt.whyItWorks}
          </p>
        </div>
      </section>

      {prompt.exampleOutput ? (
        <section aria-labelledby="example-output" className="mt-10">
          <h2
            id="example-output"
            className="flex items-center gap-2 font-bold text-[13px] text-ink-subtle uppercase tracking-[0.1em]"
          >
            <Sparkles className="size-4 text-violet-700" aria-hidden="true" />
            What you get back
          </h2>
          <div className="mt-3 rounded-card border border-line-grey border-dashed bg-cream p-5">
            <p className="whitespace-pre-wrap text-[14px] text-ink-muted leading-6">
              {prompt.exampleOutput}
            </p>
          </div>
        </section>
      ) : null}

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <section
          aria-labelledby="verified"
          className="rounded-card border border-line-grey bg-offwhite p-5"
        >
          <h2
            id="verified"
            className="flex items-center gap-2 font-bold text-[13px] text-ink-subtle uppercase tracking-[0.1em]"
          >
            <BadgeCheck className="size-4 text-green" aria-hidden="true" />
            Verified against
          </h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {prompt.verifiedAgainst.map((v) => {
              const vBrand = brandForTool(v.tool)
              return (
                <p
                  key={`${v.tool}-${v.version}`}
                  className="flex items-center gap-2 text-[14px] text-ink-muted"
                >
                  {/* White disc: this card's bg-offwhite flips near-black in
                      dark mode, where a mono brand mark would vanish. */}
                  {vBrand ? (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[7px] bg-white ring-1 ring-black/5">
                      <BrandIcon brand={vBrand} size={14} />
                    </span>
                  ) : null}
                  <span>
                    <span className="font-medium text-ink">{v.tool}</span> {v.version}
                    <span className="text-ink-subtle"> · {v.date}</span>
                  </span>
                </p>
              )
            })}
            <StaleVerificationNotice latestDate={latestVerification?.date} />
          </div>
        </section>

        {prompt.changelog.length > 0 ? (
          <section
            aria-labelledby="changelog"
            className="rounded-card border border-line-grey bg-offwhite p-5"
          >
            <h2
              id="changelog"
              className="flex items-center gap-2 font-bold text-[13px] text-ink-subtle uppercase tracking-[0.1em]"
            >
              <History className="size-4 text-violet-700" aria-hidden="true" />
              Changelog
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {prompt.changelog.map((entry) => (
                <li key={entry.date} className="text-[13px] text-ink-subtle leading-5">
                  <span className="font-medium text-ink-muted">{entry.date}</span> —{' '}
                  {entry.note}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {relatedTool ? (
        <section className="mt-6">
          <Link
            href={`/${relatedTool.category}/${relatedTool.slug}`}
            className="chip-tool p-4 text-[14px]"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-violet-100">
              <Wrench className="size-4 text-violet-700" aria-hidden="true" />
            </span>
            <span className="text-ink-muted">
              Pairs with our free{' '}
              <span className="font-semibold text-violet-700">{relatedTool.title}</span> —
              no signup, runs in your browser.
            </span>
            <ArrowUpRight className="ml-auto size-4 shrink-0" aria-hidden="true" />
          </Link>
        </section>
      ) : null}

      <section
        aria-labelledby="prompt-next"
        className={`mt-12 rounded-panel border border-ink p-7 text-center shadow-brutal md:p-10 ${
          category.tier === 1 ? 'bg-violet-900' : 'bg-cream'
        }`}
      >
        <h2
          id="prompt-next"
          className={`font-display font-semibold text-[22px] tracking-normal md:text-[27px] ${
            category.tier === 1 ? 'text-white' : ''
          }`}
        >
          {category.tier === 1
            ? 'Building this for real?'
            : 'Need this built into your business?'}
        </h2>
        <p
          className={`mx-auto mt-2.5 max-w-[46ch] text-[14.5px] leading-6 ${
            category.tier === 1 ? 'text-white/75' : 'text-ink-muted'
          }`}
        >
          {category.tier === 1
            ? `This is a free starting point. If you'd rather have ${service.label} built and running for your business, that's Scult's day job.`
            : `If a prompt isn't enough — ${service.label}, built and maintained for you — that's Scult's day job.`}
        </p>
        <a href={service.href} className="btn-brutal btn-brutal-sm mt-6 inline-flex">
          EXPLORE {service.label.toUpperCase()}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="related-prompts" className="mt-14">
          <h2
            id="related-prompts"
            className="font-bold text-[13px] text-ink-subtle uppercase tracking-[0.1em]"
          >
            More {category.name} prompts
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <PromptCard key={p.slug} prompt={p} category={category} />
            ))}
          </div>
          <Link
            href={`/prompts/${category.slug}`}
            className="mt-5 inline-flex items-center gap-1.5 font-medium text-[15px] text-violet-700 underline decoration-1 underline-offset-4 hover:text-violet-600"
          >
            All {category.name} prompts
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      ) : null}
    </article>
  )
}
