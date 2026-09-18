'use client'

import { Download } from 'lucide-react'
import { TrackedLink } from '@/components/ui/TrackedLink'
import { trackSkillEvent } from '@/lib/analytics'
import { downloadBinaryFile } from '@/lib/download-file'
import { buildInstallMd, exportSkillAs } from '@/lib/skills/export'
import type { Skill } from '@/lib/skills/types'
import { createZip } from '@/lib/skills/zip'

/**
 * The skill's real content — download-only. This used to also show the
 * text inline (a code-block preview with a format-switcher and a "Copy"
 * button, mirroring `PromptCopyBlock`'s editor-card look). Removed at the
 * user's explicit, repeated request: the ZIP is now the only way to get a
 * skill's content off this page. Nothing that was in the on-page picker is
 * lost — every format it used to render (`SKILL.md`, Cursor's `.mdc`,
 * `AGENTS.md`) is bundled into the one ZIP instead of requiring a tab
 * click per shape.
 */
export function SkillCopyBlock({
  skill,
  licenseGated,
}: {
  skill: Skill
  licenseGated: boolean
}) {
  /**
   * The real "Skill Page → Download ZIP → Install/Use" flow. The skill's
   * own sync only ever stores one file (SKILL.md's body — see the `Skill`
   * type's docblock), so every other file here is a real re-formatting of
   * that same content (see lib/skills/export.ts), not invented structure —
   * plus a genuinely useful `INSTALL.md` this site generates.
   */
  function handleDownloadZip() {
    const zip = createZip([
      { name: 'SKILL.md', content: exportSkillAs(skill, 'skill-md') },
      { name: 'skill.mdc', content: exportSkillAs(skill, 'cursor-mdc') },
      { name: 'AGENTS.md', content: exportSkillAs(skill, 'agents-md') },
      { name: 'INSTALL.md', content: buildInstallMd(skill) },
    ])
    downloadBinaryFile(`${skill.slug}.zip`, zip, 'application/zip')
    trackSkillEvent(skill.category, skill.slug, 'download_zip')
  }

  if (licenseGated) {
    return (
      <div className="rounded-panel border border-ink bg-offwhite p-6 text-center">
        <p className="text-[15px] text-ink-muted leading-6">
          This skill's source license couldn't be confirmed as safe to mirror here, so it
          isn't inlined. View the full skill directly on its source repository.
        </p>
        <TrackedLink
          href={skill.sourceUrl}
          external
          event="skill_action"
          params={{
            category: skill.category,
            skill: skill.slug,
            action: 'open_repository',
            context: 'license-gated',
          }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-pill border border-ink bg-cta px-5 py-2 font-medium text-[14px] text-black shadow-[3px_3px_0_0_#000] transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-white hover:shadow-none"
        >
          View on GitHub
        </TrackedLink>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-panel border border-ink shadow-brutal-sm">
      <div className="flex items-center gap-2 border-[#2c2743] border-b bg-[#191527] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-cta" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-green" aria-hidden="true" />
        <span className="ml-2 font-bold font-mono text-[11px] text-white/50 uppercase tracking-[0.18em]">
          {skill.slug}.zip
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 bg-[#131020] px-6 py-10 text-center">
        <p className="max-w-[46ch] text-[14px] text-white/70 leading-6">
          Includes <span className="font-mono text-white/90">SKILL.md</span>,{' '}
          <span className="font-mono text-white/90">skill.mdc</span> (Cursor),{' '}
          <span className="font-mono text-white/90">AGENTS.md</span> (also works as
          Copilot instructions or{' '}
          <span className="font-mono text-white/90">.cursorrules</span>
          ), and an <span className="font-mono text-white/90">INSTALL.md</span> with exact
          install paths for this skill.
        </p>
        <button
          type="button"
          onClick={handleDownloadZip}
          className="flex min-h-[44px] items-center gap-2 rounded-pill border border-ink bg-cta px-6 py-2.5 font-medium text-[15px] text-black shadow-[3px_3px_0_0_#000] transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-white hover:shadow-none"
        >
          <Download className="size-4" aria-hidden="true" />
          Download ZIP
        </button>
      </div>
    </div>
  )
}
