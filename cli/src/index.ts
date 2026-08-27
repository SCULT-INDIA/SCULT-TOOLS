#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import * as api from './api.js'
import { copyToClipboard } from './clipboard.js'
import { configPath, ensureConfig, saveConfig, telemetryEnabled } from './config.js'
import {
  bold,
  dim,
  fail,
  green,
  heading,
  listRow,
  printJson,
  setColorEnabled,
  violet,
  wrap,
  yellow,
} from './output.js'
import { VERSION } from './version.js'

/**
 * scult — the tools.scult.in CLI.
 *
 * Zero dependencies, no accounts, no API keys: every command is a plain
 * HTTPS GET against tools.scult.in's public CLI API. See README.md in this
 * directory for the command reference, and docs/CLI_PLAN.md at the repo
 * root for the architecture (including exactly what the anonymous
 * telemetry does and doesn't record).
 */

interface Flags {
  json: boolean
  copy: boolean
  noColor: boolean
  noTelemetry: boolean
  category?: string
  limit: number
  format: string
  save?: string
  api?: string
}

interface Parsed {
  positional: string[]
  flags: Flags
}

function parseArgs(argv: string[]): Parsed {
  const flags: Flags = {
    json: false,
    copy: false,
    noColor: false,
    noTelemetry: false,
    limit: 10,
    format: 'skill-md',
  }
  const positional: string[] = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === undefined) continue
    switch (arg) {
      case '--json':
        flags.json = true
        break
      case '--copy':
        flags.copy = true
        break
      case '--no-color':
        flags.noColor = true
        break
      case '--no-telemetry':
        flags.noTelemetry = true
        break
      case '--category':
        flags.category = argv[++i]
        break
      case '--limit': {
        const n = Number(argv[++i])
        if (!Number.isFinite(n) || n < 1 || n > 50) fail('--limit must be 1-50.')
        flags.limit = Math.floor(n)
        break
      }
      case '--format':
        flags.format = argv[++i] ?? 'skill-md'
        break
      case '--save':
        // Optional value: `--save` alone saves into the current directory.
        flags.save =
          argv[i + 1] !== undefined && !(argv[i + 1] ?? '').startsWith('-')
            ? (argv[++i] as string)
            : '.'
        break
      case '--api':
        flags.api = argv[++i]
        break
      case '-v':
      case '--version':
        process.stdout.write(`scult-cli ${VERSION}\n`)
        process.exit(0)
        break
      case '-h':
      case '--help':
        printHelp()
        process.exit(0)
        break
      default:
        if (arg.startsWith('-')) fail(`Unknown flag "${arg}". Run: scult --help`)
        positional.push(arg)
    }
  }
  return { positional, flags }
}

function printHelp(): void {
  process.stdout.write(`${bold('scult')} ${dim(`v${VERSION}`)} — 1,170+ verified AI prompts & 14,000+ real agent skills, from your terminal.

${bold('USAGE')}
  scult <command> [arguments] [flags]

${bold('COMMANDS')}
  prompts search <query>     Search the Prompt Library
  prompts get <slug>         Print one prompt in full
  prompts categories         List prompt categories with live counts
  skills search <query>      Search the Skills Library
  skills get <slug>          Print one skill (SKILL.md by default)
  skills categories          List skill categories with live counts
  search <query>             Search prompts and skills together
  telemetry [on|off|status]  Manage anonymous usage telemetry

${bold('FLAGS')}
  --category <slug>   Scope a search to one category
  --limit <n>         Max results (1-50, default 10)
  --format <f>        Skill export: skill-md | agents-md | cursorrules | copilot-instructions
  --save [dir]        Write the skill to its conventional filename in [dir]
  --copy              Copy the prompt/skill body to the clipboard
  --json              Raw JSON output (for scripts)
  --no-color          Plain output
  --no-telemetry      Disable telemetry for this invocation
  --api <base>        Override the API base (default https://tools.scult.in)
  -v, --version       Print the version
  -h, --help          This help

${bold('EXAMPLES')}
  scult prompts search "cold email" --limit 5
  scult prompts get sales-cold-email-first-line-personalization --copy
  scult skills search deploy --category devops
  scult skills get deploy-checklist --format cursorrules --save .
  scult search "landing page"

${dim('Free, no signup. Every prompt: https://tools.scult.in/prompts')}
`)
}

// ── Telemetry plumbing ──────────────────────────────────────────────────────

const FIRST_RUN_NOTICE = `${dim('─'.repeat(72))}
${bold('Anonymous usage stats:')} scult-cli reports which commands run (never
their text), its version, and your OS family; the server derives a country
from the request IP. No usernames, no file contents, no identity — the
client id is a random UUID. Turn it off any time:  ${yellow('scult telemetry off')}
${dim('─'.repeat(72))}
`

async function main(): Promise<void> {
  const { positional, flags } = parseArgs(process.argv.slice(2))
  if (flags.noColor) setColorEnabled(false)

  const { config, created } = ensureConfig()
  const telemetryOn = telemetryEnabled(config, flags.noTelemetry)
  const baseUrl = api.resolveBaseUrl(flags.api)
  const apiOptions: api.ApiOptions = {
    baseUrl,
    cid: telemetryOn ? config.cid : undefined,
  }

  if (created && !flags.json) process.stderr.write(FIRST_RUN_NOTICE)

  // One-time install ping — only with telemetry on, only ever once.
  if (telemetryOn && !config.installPinged) {
    const ok = await api.sendInstallPing(apiOptions)
    if (ok) saveConfig({ ...config, installPinged: true })
  }

  const [group, ...rest] = positional
  try {
    switch (group) {
      case undefined:
        printHelp()
        return
      case 'prompts':
        await promptsCommand(rest, flags, apiOptions)
        return
      case 'skills':
        await skillsCommand(rest, flags, apiOptions)
        return
      case 'search':
        await combinedSearch(rest, flags, apiOptions)
        return
      case 'telemetry':
        telemetryCommand(rest[0])
        return
      default:
        fail(`Unknown command "${group}". Run: scult --help`)
    }
  } catch (err) {
    if (err instanceof api.ApiError) {
      const retry = err.retryAfterSeconds ? ` Retry in ${err.retryAfterSeconds}s.` : ''
      fail(`${err.message}${retry}`)
    }
    throw err
  }
}

// ── prompts ────────────────────────────────────────────────────────────────

async function promptsCommand(
  rest: string[],
  flags: Flags,
  options: api.ApiOptions,
): Promise<void> {
  const [action, ...args] = rest
  switch (action) {
    case 'search': {
      const query = args.join(' ').trim()
      if (!query) fail('Usage: scult prompts search <query>')
      const { results } = await api.searchPrompts(
        options,
        query,
        flags.category,
        flags.limit,
      )
      if (flags.json) return printJson(results)
      if (results.length === 0) {
        process.stdout.write(`No prompts matched ${JSON.stringify(query)}.\n`)
        return
      }
      process.stdout.write(heading(`Prompts matching “${query}”`) + '\n\n')
      for (const hit of results) {
        process.stdout.write(
          `${listRow(hit.title, `${hit.category} · ${hit.slug}`, hit.description)}\n\n`,
        )
      }
      process.stdout.write(dim(`Full prompt:  scult prompts get <slug>\n`))
      return
    }
    case 'get': {
      const slug = args[0]
      if (!slug) fail('Usage: scult prompts get <slug>')
      const { prompt } = await api.getPrompt(options, slug)
      if (flags.json) return printJson(prompt)

      process.stdout.write(heading(prompt.title) + '\n')
      process.stdout.write(
        `${dim(`${prompt.categoryName} · verified against ${prompt.verifiedAgainst[0]?.tool ?? '—'} ${prompt.verifiedAgainst[0]?.version ?? ''} on ${prompt.verifiedAgainst[0]?.date ?? '—'}`)}\n\n`,
      )
      process.stdout.write(`${wrap(prompt.description, 78, '')}\n\n`)
      process.stdout.write(`${bold('── PROMPT ')}${dim('(copy from here)')}\n\n`)
      process.stdout.write(`${prompt.promptText}\n\n`)
      if (prompt.variables.length > 0) {
        process.stdout.write(`${bold('── VARIABLES')}\n`)
        for (const v of prompt.variables) {
          process.stdout.write(
            `  ${violet(`{{${v.name}}}`)}${v.required ? '' : dim(' (optional)')} — ${v.description}\n    ${dim(`e.g. ${v.example}`)}\n`,
          )
        }
        process.stdout.write('\n')
      }
      process.stdout.write(
        `${bold('── WHY THIS WORKS')}\n  ${wrap(prompt.whyItWorks, 76, '  ')}\n\n`,
      )
      process.stdout.write(dim(`${prompt.url}\n`))

      if (flags.copy) {
        const ok = await copyToClipboard(prompt.promptText)
        process.stdout.write(
          ok
            ? `${green('✓')} Prompt copied to clipboard.\n`
            : `${yellow('!')} Could not reach a clipboard utility — copy from the text above.\n`,
        )
      }
      return
    }
    case 'categories': {
      const data = await api.promptCategories(options)
      if (flags.json) return printJson(data)
      process.stdout.write(
        heading(`Prompt Library — ${data.total.toLocaleString()} prompts`) + '\n\n',
      )
      for (const group of data.groups) {
        const rows = data.categories.filter((c) => c.group === group.slug)
        if (rows.length === 0) continue
        process.stdout.write(`${bold(group.name)}\n`)
        for (const c of rows) {
          process.stdout.write(
            `  ${c.slug.padEnd(24)} ${String(c.count).padStart(4)}  ${dim(c.blurb)}\n`,
          )
        }
        process.stdout.write('\n')
      }
      return
    }
    default:
      fail('Usage: scult prompts <search|get|categories>')
  }
}

// ── skills ─────────────────────────────────────────────────────────────────

async function skillsCommand(
  rest: string[],
  flags: Flags,
  options: api.ApiOptions,
): Promise<void> {
  const [action, ...args] = rest
  switch (action) {
    case 'search': {
      const query = args.join(' ').trim()
      if (!query) fail('Usage: scult skills search <query>')
      const { results } = await api.searchSkills(
        options,
        query,
        flags.category,
        flags.limit,
      )
      if (flags.json) return printJson(results)
      if (results.length === 0) {
        process.stdout.write(`No skills matched ${JSON.stringify(query)}.\n`)
        return
      }
      process.stdout.write(heading(`Skills matching “${query}”`) + '\n\n')
      for (const hit of results) {
        process.stdout.write(
          `${listRow(
            hit.name,
            `${hit.category} · ${hit.slug} · ${hit.installs.toLocaleString()} installs`,
            hit.description,
          )}\n\n`,
        )
      }
      process.stdout.write(dim('Full skill:  scult skills get <slug>\n'))
      return
    }
    case 'get': {
      const slug = args[0]
      if (!slug) fail('Usage: scult skills get <slug>')
      const { skill } = await api.getSkill(options, slug, flags.format)
      if (flags.json) return printJson(skill)

      if (skill.licenseGated || !skill.content) {
        process.stdout.write(heading(skill.name) + '\n')
        process.stdout.write(`${wrap(skill.description, 78, '')}\n\n`)
        process.stdout.write(
          `${yellow('!')} ${wrap(skill.note ?? 'Body withheld.', 74, '  ')}\n  ${skill.sourceUrl}\n`,
        )
        return
      }

      if (flags.save !== undefined) {
        const target = join(resolve(flags.save), skill.filename ?? 'SKILL.md')
        writeFileSync(target, skill.content, 'utf8')
        process.stdout.write(`${green('✓')} Saved ${bold(target)}\n`)
      } else {
        process.stdout.write(`${skill.content}\n`)
      }

      if (flags.copy) {
        const ok = await copyToClipboard(skill.content)
        process.stdout.write(
          ok
            ? `${green('✓')} Skill copied to clipboard.\n`
            : `${yellow('!')} Could not reach a clipboard utility.\n`,
        )
      }
      return
    }
    case 'categories': {
      const data = await api.skillCategories(options)
      if (flags.json) return printJson(data)
      process.stdout.write(
        heading(`Skills Library — ${data.total.toLocaleString()} skills, synced daily`) +
          '\n\n',
      )
      for (const c of data.categories) {
        process.stdout.write(
          `  ${c.slug.padEnd(24)} ${String(c.count).padStart(6)}  ${dim(c.blurb)}\n`,
        )
      }
      return
    }
    default:
      fail('Usage: scult skills <search|get|categories>')
  }
}

// ── combined search ────────────────────────────────────────────────────────

async function combinedSearch(
  rest: string[],
  flags: Flags,
  options: api.ApiOptions,
): Promise<void> {
  const query = rest.join(' ').trim()
  if (!query) fail('Usage: scult search <query>')
  const limit = Math.min(flags.limit, 5)
  const [prompts, skills] = await Promise.all([
    api.searchPrompts(options, query, undefined, limit),
    api.searchSkills(options, query, undefined, limit),
  ])
  if (flags.json) return printJson({ prompts: prompts.results, skills: skills.results })

  process.stdout.write(heading(`Prompts (${prompts.results.length})`) + '\n\n')
  for (const hit of prompts.results) {
    process.stdout.write(`${listRow(hit.title, hit.slug, hit.description)}\n\n`)
  }
  if (prompts.results.length === 0) process.stdout.write(dim('  none\n\n'))

  process.stdout.write(heading(`Skills (${skills.results.length})`) + '\n\n')
  for (const hit of skills.results) {
    process.stdout.write(`${listRow(hit.name, hit.slug, hit.description)}\n\n`)
  }
  if (skills.results.length === 0) process.stdout.write(dim('  none\n\n'))

  process.stdout.write(
    dim('Details:  scult prompts get <slug>   ·   scult skills get <slug>\n'),
  )
}

// ── telemetry management ───────────────────────────────────────────────────

function telemetryCommand(action: string | undefined): void {
  const { config } = ensureConfig()
  switch (action) {
    case 'off':
      saveConfig({ ...config, telemetry: false })
      process.stdout.write('Telemetry is now OFF. Nothing will be reported.\n')
      return
    case 'on':
      saveConfig({ ...config, telemetry: true })
      process.stdout.write('Telemetry is now ON (anonymous usage stats only).\n')
      return
    case 'status':
    case undefined: {
      const envOff = ['0', 'false', 'off'].includes(process.env.SCULT_TELEMETRY ?? '')
      const effective = config.telemetry && !envOff
      process.stdout.write(
        [
          `Telemetry: ${effective ? green('on') : yellow('off')}${envOff ? dim(' (forced off by SCULT_TELEMETRY)') : ''}`,
          `Config:    ${configPath()}`,
          `Client id: ${dim(config.cid)} (random — carries no identity)`,
          'Recorded:  command names, CLI version, OS family, country (from IP, server-side).',
          'Never:     query text, file contents, usernames, machine names.',
        ].join('\n') + '\n',
      )
      return
    }
    default:
      fail('Usage: scult telemetry [on|off|status]')
  }
}

main().catch((err) => {
  fail(err instanceof Error ? err.message : String(err))
})
