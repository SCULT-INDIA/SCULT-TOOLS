import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { getTotalSkillCount } from '@/lib/skills/db'

/**
 * Homepage spotlight for the Skills Library — the site's third catalogue,
 * given the same billing as tools and prompts.
 *
 * 2026 redesign: this section and PromptLibrarySpotlight used to be visual
 * twins (same panel, same two columns, same 12-logo wall) — back-to-back
 * they read as one section repeated by mistake. The layout is now MIRRORED
 * (visual left, copy right on desktop) and the visual is what a skill
 * actually is: a SKILL.md file, shown in a terminal frame — because "a real
 * file synced from a public repo" lands faster when you can see one. The
 * logo wall survives as a compact "works with" strip under the terminal.
 *
 * The panel is a fixed pastel tile (theme-fixed light), so everything on it
 * is literal black / violet-700, never adaptive ink; the terminal is fixed
 * near-black with literal light text for the same reason.
 */

/** Agents every real SKILL.md already works with — the open standard. */
const AGENTS = ['claude-code', 'cursor', 'github-copilot', 'chatgpt', 'gemini'] as const

export async function SkillLibrarySpotlight() {
  const total = await getTotalSkillCount()

  return (
    <section aria-labelledby="skill-library" className="container-site py-16">
      <div className="rounded-panel border border-ink bg-tile-green p-7 shadow-brutal md:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            {/* Terminal mockup of a SKILL.md file — decorative; the copy
                beside it carries the accessible version of every claim. */}
            <div
              aria-hidden="true"
              className="overflow-hidden rounded-lg border border-black/85 bg-[#111113] shadow-[5px_5px_0_0_rgb(0_0_0/0.9)]"
            >
              <div className="flex items-center justify-between border-white/10 border-b px-4 py-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-white/20" />
                  <span className="size-2 rounded-full bg-white/20" />
                  <span className="size-2 rounded-full bg-white/20" />
                </span>
                <span className="font-mono text-[11px] text-white/50">SKILL.md</span>
              </div>
              <div className="p-5 font-mono text-[12.5px] leading-6">
                <p className="text-white/40">---</p>
                <p>
                  <span className="text-cyan">name:</span>{' '}
                  <span className="text-white/85">deploy-checklist</span>
                </p>
                <p>
                  <span className="text-cyan">description:</span>{' '}
                  <span className="text-white/85">
                    Pre-deploy checks for a Next.js app
                  </span>
                </p>
                <p className="text-white/40">---</p>
                <p className="mt-2 text-white/75">1. Run the full test suite first.</p>
                <p className="text-white/75">2. Check the build for route errors.</p>
                <p className="text-white/75">3. Diff the env vars against prod…</p>
                <p className="mt-3">
                  <span className="text-green">➜</span>{' '}
                  <span className="text-white/85">synced from a public repo</span>{' '}
                  <span className="text-white/40">· updated today</span>
                </p>
              </div>
            </div>

            <p className="mt-5 mb-2 text-center font-semibold text-[11px] text-black/50 uppercase tracking-[0.12em]">
              Works natively with
            </p>
            <ul
              aria-label="Agents the skills library works with"
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {AGENTS.map((brand) => (
                <li key={brand}>
                  <span className="flex size-10 items-center justify-center rounded-xl border border-black/10 bg-white shadow-[0_2px_8px_rgb(0_0_0/0.06)]">
                    <BrandIcon brand={brand} size={22} />
                  </span>
                </li>
              ))}
              <li>
                <span className="flex h-10 items-center rounded-xl border border-black/10 bg-white px-3 font-semibold text-[12px] text-black/60 shadow-[0_2px_8px_rgb(0_0_0/0.06)]">
                  + any SKILL.md agent
                </span>
              </li>
            </ul>
          </div>

          <div className="order-1 lg:order-2">
            <p className="eyebrow text-violet-700">Free agent skills library</p>
            <h2
              id="skill-library"
              className="mt-3 max-w-[18ch] text-[32px] text-black leading-[1.1] tracking-[-1px] md:text-[44px]"
            >
              {total.toLocaleString()} real AI agent skills, synced daily
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
