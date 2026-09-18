'use client'

import { ArrowUpRight, Download, FileText } from 'lucide-react'
import { TrackedLink } from '@/components/ui/TrackedLink'
import { trackSkillEvent } from '@/lib/analytics'
import { downloadBinaryFile } from '@/lib/download-file'
import { buildInstallMd, exportSkillAs } from '@/lib/skills/export'
import type { Skill } from '@/lib/skills/types'
import { createZip } from '@/lib/skills/zip'

const ZIP_CONTENTS: readonly { file: string; purpose: string }[] = [
  { file: 'SKILL.md', purpose: 'The real skill — Claude Code reads it as-is' },
  { file: 'skill.mdc', purpose: 'Cursor project rule, for .cursor/rules/' },
  { file: 'AGENTS.md', purpose: 'Copilot instructions, .cursorrules, Codex, Gemini' },
  { file: 'INSTALL.md', purpose: 'Exact install paths for this skill' },
]

/**
 * The skill's one action: download it. Download-only at the user's explicit
 * request (no inline preview, no copy button); every format the page used to
 * render is bundled into the single ZIP instead. Styled as a cream brutal
 * card with the site's signature yellow `btn-brutal` — the same CTA register
 * as every other primary action on the site, replacing an earlier dark
 * "editor" card that read as a different design system.
 */
export function SkillCopyBlock({
  skill,
  licenseGated,
}: {
  skill: Skill
  licenseGated: boolean
}) {
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
      <div className="rounded-panel border border-ink bg-cream p-6 shadow-brutal-sm">
        <p className="font-display font-semibold text-[19px] text-ink tracking-normal">
          Available at the source
        </p>
        <p className="mt-2 text-[14.5px] text-ink-muted leading-6">
          This skill's license couldn't be confirmed as safe to mirror here, so it isn't
          bundled. Get it directly from its repository.
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
          className="btn-brutal btn-brutal-sm btn-white mt-5 w-full"
        >
          VIEW ON GITHUB
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </TrackedLink>
      </div>
    )
  }

  return (
    <div className="rounded-panel border border-ink bg-cream p-6 shadow-brutal-sm">
      <p className="font-display font-semibold text-[19px] text-ink tracking-normal">
        Download this skill
      </p>
      <p className="mt-1 font-mono text-[12px] text-ink-subtle">{skill.slug}.zip</p>

      <ul className="mt-4 flex flex-col gap-2">
        {ZIP_CONTENTS.map(({ file, purpose }) => (
          <li
            key={file}
            className="flex items-start gap-2.5 rounded-card border border-ink/10 bg-white px-3 py-2.5"
          >
            <FileText
              className="mt-0.5 size-4 shrink-0 text-violet-700"
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="block font-mono text-[13px] text-ink">{file}</span>
              <span className="block text-[12.5px] text-ink-subtle leading-5">
                {purpose}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={handleDownloadZip}
        className="btn-brutal btn-brutal-sm mt-5 w-full"
      >
        <Download className="size-4" aria-hidden="true" />
        DOWNLOAD ZIP
      </button>
    </div>
  )
}
