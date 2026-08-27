# scult-cli

Search and use [tools.scult.in](https://tools.scult.in)'s **1,170+ verified AI
prompts** and **14,000+ real agent skills** from your terminal. Free, no
signup, no API key.

```bash
npm install -g scult-cli
# or one-off:
npx scult-cli prompts search "cold email"
```

## Commands

```bash
scult prompts search <query> [--category <slug>] [--limit <n>]
scult prompts get <slug> [--copy] [--json]
scult prompts categories

scult skills search <query> [--category <slug>] [--limit <n>]
scult skills get <slug> [--format skill-md|agents-md|cursorrules|copilot-instructions]
                        [--save [dir]] [--copy] [--json]
scult skills categories

scult search <query>          # prompts + skills together
scult telemetry [on|off|status]
```

### Examples

```bash
# Find and copy a prompt
scult prompts search "landing page" --limit 5
scult prompts get ads-landing-page-hero-variants --copy

# Drop a skill straight into your repo as .cursorrules
scult skills get deploy-checklist --format cursorrules --save .

# Script-friendly output
scult search "schema markup" --json
```

## Flags

| Flag | Meaning |
|---|---|
| `--category <slug>` | Scope a search to one category (`scult prompts categories` lists them) |
| `--limit <n>` | Max results, 1–50 (default 10) |
| `--format <f>` | Skill export format (default `skill-md`) |
| `--save [dir]` | Write the skill to its conventional filename (`SKILL.md`, `AGENTS.md`, `.cursorrules`, `copilot-instructions.md`) |
| `--copy` | Copy the prompt/skill body to the clipboard |
| `--json` | Raw JSON output |
| `--no-color` | Plain output (also honors `NO_COLOR`) |
| `--no-telemetry` | Disable telemetry for this invocation |
| `--api <base>` | Override the API base URL (also `SCULT_CLI_API`) |

## Telemetry — what's collected, what isn't

Anonymous usage stats only, with a real off switch:

- **Collected**: command names (never their arguments or query text), CLI
  version, OS family and CPU architecture, Node version, and a country
  derived server-side from the request IP. A random UUID identifies "a
  client" so unique-user counts work — it is minted locally and derived
  from nothing about you or your machine.
- **Never**: usernames, hostnames, file contents, prompt/skill text you
  fetched, or anything that identifies you.
- **Off switch**: `scult telemetry off` (persisted), `SCULT_TELEMETRY=0`
  (env), or `--no-telemetry` (per run). `scult telemetry status` shows the
  current state and the config file location (`~/.scult-cli.json`).

## Requirements

Node.js ≥ 18.17. No other dependencies — the published package is a few
kilobytes of plain JavaScript.

---

Built by [Scult](https://scult.in). The same catalogue is available as an
[MCP server](https://tools.scult.in/mcp) for AI agents, and on the web at
[tools.scult.in](https://tools.scult.in).
