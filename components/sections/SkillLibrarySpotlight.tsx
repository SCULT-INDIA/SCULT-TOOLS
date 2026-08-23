import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { getTotalSkillCount } from '@/lib/skills/db'

/**
 * Homepage spotlight for the Skills Library — the site's third catalogue,
 * given the same billing as tools and prompts (see `PromptLibrarySpotlight`,
 * which this mirrors structurally). Unlike that component, the count here
 * is live (Supabase-backed, growing daily), so this is an async component
 * rather than reading a static registry.
 */

/** A skill isn't tied to one AI model the way a prompt is — the wall mixes
 * the agents every real SKILL.md already works with (the open standard)
 * and the real tech stacks skills.sh's registry actually covers. */
const WALL = [
  'claude-code',
  'cursor',
  'github-copilot',
  'chatgpt',
  'gemini',
  'react',
  'python',
  'docker',
  'postgresql',
  'typescript',
  'kubernetes',
  'nextjs',
] as const

export async function SkillLibrarySpotlight() {
  const total = await getTotalSkillCount()

  return (
    <section aria-labelledby="skill-library" className="container-site py-16">
      <div className="rounded-panel border border-ink bg-tile-green p-7 shadow-brutal md:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-violet-700">New — free agent skills library</p>
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

          <ul
            aria-label="Agents and tech stacks covered by the skills library"
            className="grid grid-cols-3 gap-3 sm:grid-cols-4"
          >
            {WALL.map((brand) => (
              <li key={brand}>
                <span className="flex aspect-square items-center justify-center rounded-2xl border border-ink/10 bg-white shadow-[0_2px_10px_rgb(0_0_0/0.07)]">
                  <BrandIcon brand={brand} size={34} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
