# Scult CLI — implementation plan

> Goal: anyone can use the Prompt Library and Skills Library from a terminal
> (`npx scult-cli …` / `npm i -g scult-cli`), with anonymous usage insights
> (installs, commands, versions, OS, countries — never identity) flowing into
> SCULT Studio next to the existing MCP insights.

## 0. The shape of the system (why this design)

Three constraints decide the architecture:

1. **The CLI can never hold a secret.** Studio's ingest API is API-key
   authenticated (`scult_tools` key). An npm package is public, so the CLI
   must not talk to Studio directly.
2. **This exact problem is already solved once.** The MCP server on
   tools.scult.in reports usage server-side to Studio
   (`lib/mcp/studio-report.ts` → `POST studio.scult.in/api/v1/mcp/events` →
   `record_mcp_events` RPC → `mcp_events` table → `McpSection` in Studio's
   analytics dashboard). The CLI pipeline mirrors that proven path 1:1.
3. **CLI insights must be their own report.** Installs/OS/versions don't fit
   `mcp_events`, and mixing them would muddy both reports — so a sibling
   `cli_events` table + `CliSection`, not a bolt-on.

```
scult-cli (user machine, no secrets)
   │  GET /api/cli/v1/…            content (prompts, skills)
   │  POST /api/cli/v1/events      install ping (telemetry, opt-out honored)
   ▼
tools.scult.in (owns SCULT_STUDIO_API_KEY)
   │  every /api/cli/* request is measured server-side (command, version,
   │  os/arch/node from User-Agent, anonymous cid header, status, duration)
   │  → buffered → flushed after the response
   ▼
studio.scult.in  POST /api/v1/cli/events  (Bearer scult_tools key)
   │  geo (country/region/city) resolved from caller IP at ingest
   ▼
Supabase  record_cli_events → cli_events (RLS: admin read only)
   ▼
Studio dashboard  CliSection — installs, commands, versions, OS, countries, log
```

Server-side measurement is the canonical usage record (works even if a fork
strips telemetry); the only client-sent event is the one thing the server
can't see — the `install` first-run ping.

## 1. The CLI package (`cli/` in this repo, npm name `scult-cli`, bin `scult`)

Zero runtime dependencies (Node ≥ 18: global `fetch`, `node:crypto`,
`node:os`), plain `tsc` build to `dist/`. Commands:

| Command | Backing endpoint |
|---|---|
| `scult prompts search <query> [--category] [--limit]` | `GET /api/cli/v1/prompts/search` |
| `scult prompts get <slug> [--copy] [--json]` | `GET /api/cli/v1/prompts/<slug>` |
| `scult prompts categories` | `GET /api/cli/v1/prompts/categories` |
| `scult skills search <query> [--category] [--limit]` | `GET /api/cli/v1/skills/search` |
| `scult skills get <slug> [--format skill-md\|agents-md\|cursorrules\|copilot-instructions] [--save [dir]] [--copy]` | `GET /api/cli/v1/skills/<slug>` |
| `scult skills categories` | `GET /api/cli/v1/skills/categories` |
| `scult search <query>` | both search endpoints |
| `scult telemetry [on\|off\|status]` | local only |

Global flags: `--json`, `--no-color`, `--api <base>` (or `SCULT_CLI_API`
env, default `https://tools.scult.in`), `-v/--version`, `-h/--help`.

Telemetry (ethical defaults):
- `~/.scult-cli.json` holds `{ cid: <random uuid>, telemetry: boolean,
  firstRunAt }`. The cid is a random ID, never derived from anything
  identifying.
- First run prints one notice: what is collected (command names, CLI
  version, OS family, country-from-IP server-side), what is NOT (no
  usernames, no file contents, no queries' text beyond the server logs any
  HTTP service keeps), and the off switch.
- Off switch: `scult telemetry off` **or** `SCULT_TELEMETRY=0` **or**
  `--no-telemetry`. When off: no install ping, no `x-scult-cid` header.
  Content requests still carry `User-Agent: scult-cli/<version>` like any
  HTTP client.
- The install ping fires once (flag persisted), fire-and-forget, 2s timeout,
  never blocks or errors a command.

## 2. tools.scult.in — CLI API + server-side measurement

New, versioned, GET-only JSON endpoints (thin wrappers over the same
registries/db the site and MCP already use — no new content source):

- `app/api/cli/v1/prompts/search/route.ts` — same scoring as MCP
  `search_prompts` (extracted to `lib/cli/prompt-search.ts` so MCP and CLI
  share one implementation).
- `app/api/cli/v1/prompts/[slug]/route.ts` — full prompt (registry lookup).
- `app/api/cli/v1/prompts/categories/route.ts` — groups + categories + live counts.
- `app/api/cli/v1/skills/search/route.ts` — `searchSkills()` (Supabase).
- `app/api/cli/v1/skills/[slug]/route.ts` — `getSkill()` + all four export
  renderings via `exportSkillAs` (license-gated skills return source URL
  instead of body, same rule as the site).
- `app/api/cli/v1/skills/categories/route.ts` — categories + live counts.
- `app/api/cli/v1/events/route.ts` — POST; accepts only `{type:'install'}`
  events from the CLI, validates hard, forwards into the same reporter.

Cross-cutting (`lib/cli/…`):
- `studio-report.ts` — clone of the MCP reporter aimed at
  `https://studio.scult.in/api/v1/cli/events` (overridable via
  `SCULT_STUDIO_CLI_EVENTS_URL` for tests), same buffer/flush/timeout/never-throw
  contract.
- `track.ts` — `withCliTracking(command, handler)`: rate limit (60/min/IP via
  the existing token bucket), parse `scult-cli/<v> (<os>; <arch>) node/<n>`
  from User-Agent + optional `x-scult-cid`, time the handler, enqueue a
  `command` event, flush after response. Non-CLI callers (no UA match) still
  get content but are recorded with nulls — the endpoints are public either way.

## 3. SCULT Studio — ingest, storage, dashboard

- `supabase/migrations/0041_cli_events.sql` — `cli_events` table
  (event_type `install|command`, command, cli_version, node_version, os,
  arch, cid, status, error_message, duration_ms, ip, country, region, city,
  created_at), admin-only RLS, `record_cli_events` (API-key gated, batch ≤ 50,
  every field length-capped/sanitized like `record_mcp_events`), plus read
  RPCs `get_cli_summary`, `get_cli_breakdown` (command | version | os |
  country), `get_cli_log`.
- `src/app/api/v1/cli/events/route.ts` — mirror of the MCP ingest route
  (same `requireApiKey('scult_tools')`, rate limit, `lookupGeo`, RPC call).
- `src/components/analytics-dashboard.tsx` — `CliSection` rendered beside
  `McpSection` for the `scult_tools` site: stat cards (Installs, Commands
  run, Unique clients, Success rate), breakdowns (Top commands, Versions,
  OS, Countries), full event log dialog.

## 4. E2E test plan

1. `cd cli && npm run build` — tsc clean.
2. Against the local dev server (`--api http://localhost:3000`):
   categories/search/get for prompts and skills, `--json`, `--format
   agents-md`, unknown-slug error paths, rate-limit path.
3. Telemetry: first run writes config + fires install ping (server logs a
   `cli_event`); `scult telemetry off` stops the cid header; `SCULT_TELEMETRY=0`
   equivalent.
4. Reporter: `lib/cli/studio-report.test.ts` + `lib/cli/track.test.ts`
   (vitest, fetch mocked) — batch shape, key-unset inertness, UA parsing.
5. Studio: typecheck + lint; migration reviewed against `0038_mcp_events.sql`
   conventions. Applying the migration + deploying Studio is a user step
   (Supabase `db push` / SQL editor), documented in the PR description.

## 5. Out of scope (deliberate)

- Publishing to npm (needs the owner's npm account; package is ready to
  `npm publish` from `cli/`).
- Auth/accounts, favorites, submitting prompts from the CLI.
- Tracking command *arguments* or query text in Studio (privacy: only the
  command name is recorded).
