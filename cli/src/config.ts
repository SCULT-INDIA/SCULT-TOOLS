import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

/**
 * Local CLI state: one small JSON file in the user's home directory.
 *
 *   cid          — a RANDOM UUID minted on first run. Anonymous by
 *                  construction: derived from nothing (not hostname, not
 *                  MAC, not username), it only lets the analytics count
 *                  "unique installs" without knowing who anyone is.
 *   telemetry    — the opt-out switch (`scult telemetry off`).
 *   installPinged— whether the one-time install ping has been sent, so it
 *                  can never fire twice.
 */

export interface CliConfig {
  cid: string
  telemetry: boolean
  installPinged: boolean
  firstRunAt: string
}

const CONFIG_PATH = join(homedir(), '.scult-cli.json')

export function configPath(): string {
  return CONFIG_PATH
}

export function loadConfig(): CliConfig | null {
  try {
    if (!existsSync(CONFIG_PATH)) return null
    const raw = JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) as Partial<CliConfig>
    if (typeof raw.cid !== 'string') return null
    return {
      cid: raw.cid,
      telemetry: raw.telemetry !== false,
      installPinged: raw.installPinged === true,
      firstRunAt: typeof raw.firstRunAt === 'string' ? raw.firstRunAt : '',
    }
  } catch {
    return null
  }
}

export function saveConfig(config: CliConfig): void {
  try {
    mkdirSync(dirname(CONFIG_PATH), { recursive: true })
    writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
  } catch {
    // A read-only home directory must never break the CLI — state simply
    // doesn't persist (the install ping may repeat; the server rate-limits it).
  }
}

/** Loads the config, creating it on first run. `created` tells the caller
 * to print the one-time telemetry notice. */
export function ensureConfig(): { config: CliConfig; created: boolean } {
  const existing = loadConfig()
  if (existing) return { config: existing, created: false }
  const config: CliConfig = {
    cid: randomUUID(),
    telemetry: true,
    installPinged: false,
    firstRunAt: new Date().toISOString(),
  }
  saveConfig(config)
  return { config, created: true }
}

/** Environment kill-switches, checked at call time: SCULT_TELEMETRY=0 and
 * --no-telemetry both silence telemetry regardless of the saved setting. */
export function telemetryEnabled(config: CliConfig, argvNoTelemetry: boolean): boolean {
  if (argvNoTelemetry) return false
  const env = process.env.SCULT_TELEMETRY
  if (env === '0' || env === 'false' || env === 'off') return false
  return config.telemetry
}
