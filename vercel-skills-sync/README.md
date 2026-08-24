# Skills Library sync-worker

A standalone Vercel project. Its only job is calling skills.sh's official,
paginated `/api/v1/*` API (which requires a Vercel OIDC token — something
only a project actually deployed on Vercel can obtain) and writing real
skills into the same Supabase database the main tools.scult.in app (on
Railway) reads from.

## Deploy

1. `vercel link` inside this directory (or import it as a new project in
   the Vercel dashboard, with **Root Directory** set to `vercel-skills-sync`
   if deploying from the same GitHub repo as the main app).
2. In the new project's Settings → Environment Variables, set:
   - `SUPABASE_URL` — same value as the main app's `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` — the Supabase **service_role** key (never
     the anon key — this key needs to bypass Row Level Security to write).
     **This key must never be set on the main app** — it belongs only here.
   - `CRON_SECRET` — any long random string you generate yourself. Also
     put this same value in the main repo's GitHub Actions secrets as
     `SKILLS_SYNC_SECRET` (see `.github/workflows/sync-skills-worker.yml`).
3. In Settings → OIDC Federation, enable OIDC for this project (this is
   what makes `getVercelOidcToken()` in `api/sync.js` return a real,
   usable token instead of failing).
4. Deploy (`vercel --prod` or push to the connected branch).

## How it makes progress toward the full registry

skills.sh's official API paginates the whole registry, and `api/sync.js`
can only run for `maxDuration` seconds per invocation (see `vercel.json`).
So each call processes a bounded number of pages and records where it left
off (`skills_sync_meta.cursor_page` in Supabase) rather than trying to sync
everything in one shot.

- **Baseline**: the `vercel.json` `crons` entry calls `/api/sync` once a
  day on its own (Hobby-plan-compatible).
- **Real throughput**: `.github/workflows/sync-skills-worker.yml` in the
  main repo is the actual loop driver — it calls this endpoint repeatedly
  for hours at a stretch (GitHub Actions jobs can run far longer than any
  serverless function), which is what lets cumulative progress toward
  ~600k happen in a realistic timeframe rather than one page a day.

## Testing it manually

```bash
curl -X POST https://<your-worker>.vercel.app/api/sync \
  -H "Authorization: Bearer <CRON_SECRET>"
```

Returns `{ processed, failed, cursorPage, cursorDone, curatedDone, rescanTriggered, totalSkills, errors }`.
`cursorDone: true` means it has reached the end of the leaderboard as it
currently stands — new skills still get added to skills.sh over time, so
this isn't a permanent "finished" state.

## Staying current after the first full pass

Once `cursorDone` and `curatedDone` are both `true`, the handler resets
them back to `false` (and `cursorPage` to `0`) the first time it's called
more than 20 hours after the last completed sync — `rescanTriggered: true`
on that response confirms it fired. This is a full re-scan from page 0,
not a resume from the old cursor: the leaderboard is ranked, so a newly
popular skill can outrank the old cutoff instead of only appending past
it, and only a fresh pass is guaranteed to catch that. The 20-hour gate
exists so the two daily triggers (this project's own `vercel.json` cron
and the GitHub Actions loop driver, which calls this endpoint many times
in quick succession within one run) don't restart the scan on every call
— only the first call after a real day has passed does.
