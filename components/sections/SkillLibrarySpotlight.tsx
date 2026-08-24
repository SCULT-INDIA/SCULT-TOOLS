import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { getTotalSkillCount } from '@/lib/skills/db'

/**
 * Homepage spotlight for the Skills Library — the site's third catalogue,
 * MIRRORED against PromptLibrarySpotlight (visual left, copy right) so the
 * two panels read as siblings, not one section repeated by mistake.
 *
 * The visual is what a skill actually is: a SKILL.md file in a violet-900
 * "terminal" (the brand's own dark tone, not a neutral black) tilted like a
 * sticker, with a Permanent Marker annotation and a live count in a rotated
 * white highlight box. Panel is a fixed pastel tile: literal black text.
 */

/** Agents every real SKILL.md already works with — the open standard. */
const AGENTS = ['claude-code', 'cursor', 'github-copilot', 'chatgpt', 'gemini'] as const

export async function SkillLibrarySpotlight() {
  const total = await getTotalSkillCount()

  return (
    <section aria-labelledby="skill-library" className="container-site py-16">
      <div className="rounded-panel border border-ink bg-tile-green p-7 shadow-brutal md:p-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            {/* SKILL.md terminal mockup — decorative; the copy beside it
                carries the accessible version of every claim. violet-900 is
                the palette's dark tone (AAA for white text). */}
            <div aria-hidden="true" className="relative">
              <p className="-top-4 absolute left-4 z-10 -rotate-3 rounded-pill border border-ink bg-cta px-3.5 py-1 font-display font-semibold text-[14px] text-black italic shadow-brutal-sm">
                a real file, not a listicle
              </p>
              <div className="rotate-1 overflow-hidden rounded-lg border border-ink bg-violet-900 shadow-brutal transition-transform duration-200 hover:rotate-0">
                <div className="flex items-center justify-between border-white/15 border-b bg-black/20 px-4 py-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full border border-white/30 bg-tile-green" />
                    <span className="size-2.5 rounded-full border border-white/30 bg-cta" />
                    <span className="size-2.5 rounded-full border border-white/30 bg-white" />
                  </span>
                  <span className="font-mono text-[11px] text-white/60">SKILL.md</span>
                </div>
                <div className="p-5 font-mono text-[12.5px] leading-6">
                  <p className="text-white/40">---</p>
                  <p>
                    <span className="text-cta">name:</span>{' '}
                    <span className="text-white/90">deploy-checklist</span>
                  </p>
                  <p>
                    <span className="text-cta">description:</span>{' '}
                    <span className="text-white/90">
                      Pre-deploy checks for a Next.js app
                    </span>
                  </p>
                  <p className="text-white/40">---</p>
                  <p className="mt-2 text-white/80">1. Run the full test suite first.</p>
                  <p className="text-white/80">2. Check the build for route errors.</p>
                  <p className="text-white/80">3. Diff the env vars against prod…</p>
                  <p className="mt-3">
                    <span className="text-green">➜</span>{' '}
                    <span className="text-white/90">synced from a public repo</span>{' '}
                    <span className="text-white/45">· updated today</span>
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 mb-2 text-center font-semibold text-[11px] text-black/50 uppercase tracking-[0.12em]">
              Works natively with
            </p>
            <ul
              aria-label="Agents the skills library works with"
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {AGENTS.map((brand) => (
                <li key={brand}>
                  <span className="flex size-10 items-center justify-center rounded-xl border border-ink/60 bg-white shadow-[2px_2px_0_0_rgb(0_0_0/0.75)]">
                    <BrandIcon brand={brand} size={22} />
                  </span>
                </li>
              ))}
              <li>
                <span className="flex h-10 items-center rounded-xl border border-ink/60 bg-white px-3 font-semibold text-[12px] text-black/60 shadow-[2px_2px_0_0_rgb(0_0_0/0.75)]">
                  + any SKILL.md agent
                </span>
              </li>
            </ul>
          </div>

          <div className="order-1 lg:order-2">
            <p className="eyebrow text-violet-700">Free agent skills library</p>
            <h2
              id="skill-library"
              className="mt-4 max-w-[18ch] text-[32px] text-black leading-[1.15] tracking-[-1px] md:text-[44px]"
            >
              <span className="mr-1 inline-block rotate-1 rounded-md border border-ink bg-white px-3 py-0.5 shadow-brutal-sm">
                {total.toLocaleString()}
              </span>{' '}
              real AI agent skills, synced daily
            </h2>
            <p className="mt-5 max-w-[52ch] text-[17px] text-black/70 leading-7">
              A curated, daily-growing directory of real, public `SKILL.md` files —
              organized by the task you're doing, not by which AI tool you use. Works
              natively with Claude Code, Cursor, Codex CLI, and Copilot:
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-[15px] text-black/80">
              {[
                'Every skill is a real file synced from a public repo, never invented',
                'Copy as-is, or export as AGENTS.md, .cursorrules, or Copilot instructions',
                'Organized by task — testing, debugging, deployment — not by AI brand',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <BadgeCheck
                    className="mt-0.5 size-4.5 shrink-0 text-green"
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/skills"
              className="btn-brutal mt-8 border-black text-black hover:border-ink hover:text-ink"
            >
              BROWSE THE SKILLS LIBRARY
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
