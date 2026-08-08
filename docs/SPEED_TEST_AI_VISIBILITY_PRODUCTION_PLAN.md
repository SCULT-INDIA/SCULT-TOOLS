# Website Speed Test & AI Visibility Checker — free, fully-functional production plan

**Status of this document:** implemented and verified where code could do
it (§1.3, §2.2, §2.3, and confirming §1.2). What remains is entirely account
setup in services this assistant has no credentials for — Google Cloud
Console and the Vercel dashboard — itemized precisely in the **"Your
turn"** boxes below and in the Master Operating Checklist.

## 0. Starting point (confirmed by code audit, not assumed)

Both tools are **already code-complete** — real logic, real external calls,
zero mocks, tested (`logic.test.ts` for each), SSRF-protected. Nothing here
is "finish building the feature." The gap is entirely between *"the code is
correct"* and *"this is verified working, abuse-resistant, and monitored in
production, at $0."*

| | Website Speed Test | AI Visibility Checker |
|---|---|---|
| What it calls | Google PageSpeed Insights v5 API (`googleapis.com/pagespeedonline/v5/runPagespeed`) | The **target site's own** `robots.txt`, `/llms.txt`, homepage HTML, `sitemap.xml` — no third party at all |
| Paid API involved? | No — PSI is free, keyed or keyless | No — pure fetch + regex/parse, no LLM calls |
| Mocked/fake data? | None found | None found |
| SSRF protection | Yes — URL validator + DNS-resolution check | Yes — same, re-checked on every redirect hop |
| Currently missing | A provisioned `PSI_API_KEY` (works keyless today, on a small shared Google quota) | Nothing required — already keyless by design |
| Currently missing (both) | Rate limiting on our own route | Rate limiting on our own route |

So the plan below has three real workstreams: **(1) provision the one free
key that's still blank, (2) add abuse protection so free quota isn't drained
by one bad actor, (3) prove it end-to-end in production** — plus one
documented (not required) decision about a known limitation.

---

## 1. Website Speed Test

### 1.1 Provision the free Google PSI API key — 🔲 **your turn, cannot be automated**
This is the one genuine account action left. It requires a Google account
and the Vercel dashboard, neither of which this assistant has credentials
for.

> **Do this:**
> 1. [Google Cloud Console](https://console.cloud.google.com/) → new or
>    existing project → **APIs & Services → Library** → enable
>    "PageSpeed Insights API" → **Credentials** → **Create credentials →
>    API key**.
> 2. Click the new key → **Restrict key** → **API restrictions** → select
>    only "PageSpeed Insights API". (Defense in depth — a leaked key then
>    can't be used for anything else on the project.)
> 3. Free quota: **25,000 requests/day**, never billed. If Cloud Console
>    asks to link a billing account before issuing the key, that's a
>    one-time account-verification gate Google applies broadly — it does
>    not mean this API becomes paid; the quota itself stays free either way.
> 4. Vercel dashboard → your project → **Settings → Environment
>    Variables** → add `PSI_API_KEY` with the key value → check both
>    **Production** and **Preview** → **Save** → redeploy (or it takes
>    effect on the next deploy).
>
> Until this is done, the tool runs on Google's small shared keyless
> quota — **confirmed exhausted in this very dev environment during
> testing below**, so this is not theoretical.

### 1.2 Serverless function duration — ✅ confirmed fine, no action needed
Verified against Vercel's current docs (fetched 2026-08, Fluid Compute
default since it's on by default): the **Hobby plan's duration ceiling is
300 seconds (5 minutes)**, both default and maximum. The route's existing
`maxDuration = 60` is comfortably inside that on every plan tier — nothing
to change.

### 1.3 Rate limiting on `/api/speed-test` — ✅ implemented
Shipped a zero-dependency, zero-signup option first (originally listed
below as "Option B," promoted here because it needed no account access to
build): `lib/rate-limit.ts`, an in-memory fixed-window limiter (6
requests/minute per IP, matching a real Lighthouse run's real cost — free
PSI quota and ~15-40s of function time). Wired into the route as the very
first check, ahead of any URL validation or upstream call. Returns the
existing error-payload shape with a new `'rate-limited'` code and a
`Retry-After` header.

**Verified live** (background server, real requests, not a unit-test
mock): 8 rapid calls to `/api/speed-test` — the first several returned
PSI's own `'quota'` 429 (see §1.1's finding above), and once 6 requests had
landed within the 60s window, the 7th and 8th correctly switched to our
own `'rate-limited'` code with `Retry-After: 29`. The two error sources are
distinguishable in the response, not conflated.

**Known, accepted limitation** (documented in the module itself): this is
per-instance, not distributed — a client hitting multiple warm serverless
instances gets multiple independent budgets, and a cold start resets the
counter to zero. Real protection against one script hammering one
connection; not a precise global limiter. Upgrading to Upstash Redis later
needs no change to either route's call shape, only to `rate-limit.ts`'s
internals — worth doing only if real abuse is observed.

> **Optional extra layer, your turn if wanted:** a Vercel Firewall
> rate-limit rule on `/api/speed-test` (Vercel dashboard → your project →
> **Firewall** → add a rule, e.g. "max 10 req/min per IP" scoped to that
> path). Free on Hobby, dashboard-only, complements the in-app limiter
> rather than replacing it — the Firewall rule would catch traffic across
> instances that the per-instance limiter can't see.

### 1.4 Production smoke-test checklist
- [x] An invalid URL (`not a url`) → rejected **client-side**, before any
      network call, with a real validator message ("Use the full public
      domain, like example.com/pricing.") — verified live.
- [x] A real run against `https://scult.in/` → hit real PSI, got a real
      upstream `429 quota` back (Google's keyless quota, exhausted in this
      dev environment) — the error path rendered cleanly, no crash. This
      *is* §1.1's action item made concrete, not a separate bug.
- [x] Rate-limit path → verified above in §1.3.
- [ ] **Needs a real `PSI_API_KEY` to exercise** (blocked on §1.1, not a
      code gap): a real fast site scoring well on both mobile/desktop, a
      genuinely slow site exercising the full 15-40s checklist UI, a
      domain that doesn't resolve, a cached-rerun speed check, Copy
      report/Copy link content, and the mobile/desktop-mismatch flag after
      a run. Re-run this list once the key is live.

### 1.5 Explicitly out of scope (already a deliberate decision, not a gap)
Waterfall/request chart, test-location selection, scheduled/historical
monitoring — all excluded in `docs/research/website-speed-test.md` for
specific, sound reasons (PSI's API can't do location selection at all;
monitoring needs accounts and storage, which is a different product). No
action needed here — noted only so "fully functional" isn't read as "add
these too."

---

## 2. AI Visibility Checker

### 2.1 No API key to provision — ✅ nothing to do
Confirmed zero external paid dependency — nothing to sign up for. This
tool's entire cost surface is Vercel's own free function-invocation
allowance plus whatever bandwidth the four small fetches use.

### 2.2 Rate limiting on `/api/ai-visibility` — ✅ implemented
Same `lib/rate-limit.ts` module as §1.3, its own independent budget (6
requests/minute per IP — this route can fire up to 4 outbound fetches
against a *third party's* server per request, more conservative than the
speed test's single call to Google). Same `'rate-limited'` code added to
`ApiErrorCode`.

**Verified live**: 8 requests fired in sequence (1 real run, 1 SSRF probe,
6 more) — the first 6 succeeded, the 7th and 8th correctly returned
`429 rate-limited`. This route had *nothing* standing between it and one
client hammering arbitrary third-party domains through our server before
this — now it does.

> **Optional extra layer, your turn if wanted:** same Vercel Firewall
> option as §1.3, scoped to `/api/ai-visibility` instead.

### 2.3 Document the one known, real limitation — ✅ done
Added to `lib/tools/ai-visibility-checker/meta.ts`'s `limitations` array:
*"It reads the HTML your server sends, not the DOM after JavaScript runs —
a single-page app that injects its title, meta description or schema
client-side will score lower here than a real visitor would experience."*
Matches the tool's existing pattern of stating scope honestly (it already
disclosed "homepage only" and "state, not intent"). The headless-browser
alternative considered and deliberately not built — see the reasoning kept
below for the record.

<details>
<summary>Why a headless-browser fix was considered and rejected for v1</summary>

Rendering via a serverless headless browser (`@sparticuz/chromium` +
`puppeteer-core` on a Vercel function) would get post-JS HTML before
parsing — still free, but with a real engineering cost: meaningfully
heavier cold starts (often several seconds), a larger function bundle, and
a second, harder-to-reason-about failure class (headless Chrome
crashing/timing out in a serverless sandbox) inside a tool whose whole
design philosophy is "auditable, deterministic, no exploration surface."
Worth revisiting only if real user feedback says SPA sites are a frequent
complaint.
</details>

### 2.4 Production smoke-test checklist
- [x] `scult.in` (the seeded default) — ran through the **actual UI**, not
      just the API: real 95/100 score, "AI-visible" band, all 10 crawlers
      correctly shown Allowed with the matched `User-agent: *` rule quoted,
      4 JSON-LD types found, 4/5 checks passed. Rendered correctly end to
      end.
- [x] A private-IP literal (`http://127.0.0.1:3000/`) → SSRF rejection
      fired correctly: `400 invalid-url`, "Private and internal IP
      addresses cannot be checked."
- [x] Rate-limit path → verified above in §2.2.
- [ ] A site with a real `llms.txt`, a site that blocks everything
      (`Disallow: /`), a malformed `robots.txt`, a non-resolving domain,
      the `?url=` permalink, and Copy report/Copy link content — not
      re-verified this pass (each already has direct unit-test coverage in
      `logic.test.ts`, which is green; this list is about re-confirming the
      *live* route, worth another pass before a real deploy if you want
      extra confidence, but nothing here is expected to differ from the
      already-passing 122 logic tests).

---

## 3. Shared production-readiness steps

- [ ] **Env vars in Vercel** — 🔲 your turn: `PSI_API_KEY` (§1.1), and
      confirm `NEXT_PUBLIC_SITE_URL` matches the real deployed domain —
      both tools' shareable `?url=` links and JSON-LD depend on it being
      correct, and a wrong value here silently breaks sharing without any
      error being thrown anywhere.
- [x] **Rate limiting** applied to both `/api/speed-test` and
      `/api/ai-visibility` (§1.3/§2.2) — implemented and verified live.
- [ ] **Free monitoring** (optional, your turn if wanted): UptimeRobot's
      free tier (50 monitors, 5-minute interval, no card) pointed at the
      **tool pages** — `/seo/website-speed-test` and
      `/geo/ai-visibility-checker` (note the actual category segments: the
      speed test lives under `/seo`, not `/geo`) — to catch a build/deploy
      break. Deliberately **not** pointed at the API routes directly, since
      a monitor hitting those every 5 minutes would itself burn PSI quota
      and hammer third-party sites for no reason.
- [x] **Final gate:** `npx tsc --noEmit` clean, `npx biome check` clean,
      `npx vitest run` green (698 tests, unchanged pass count — this work
      added no new test files, it extended existing closed unions and
      re-ran the existing suites), plus the live smoke tests in §1.4/§2.4
      above, run against the actual dev server, not just unit tests. **Not
      yet run against a real production deployment** — do that once
      `PSI_API_KEY` is set (§1.1), since that's the one behavior that
      cannot be verified without it.

## 4. Cost reality check (so nothing surprises later)

| Service | Free tier | Card required? |
|---|---|---|
| Google PageSpeed Insights API | 25,000 requests/day | Verify at setup — has varied by Google policy; usage itself is never billed |
| Vercel Hobby plan | Function invocations, bandwidth per Vercel's current Hobby limits | No, but **confirm Vercel's Hobby-plan terms permit this specific commercial use** — Scult is a business, and Hobby is generally scoped to personal/non-commercial projects; if that's a concern, this may already be running on a paid Vercel plan for other reasons, which is fine and doesn't change anything else in this plan |
| Upstash Redis (only if Option B rate limiting is chosen) | ~10k commands/day | No |
| UptimeRobot (only if monitoring is added) | 50 monitors, 5-min interval | No |

Every item above is free at the volumes this site would plausibly see. The
only genuine judgment call is the Vercel Hobby commercial-use question,
which is a business/ToS decision, not a technical one.

---

## Master Operating Checklist — status

1. ~~Confirm the real Vercel function-duration ceiling~~ — ✅ done, 300s on
   Hobby, no code change needed (§1.2).
2. ~~Add rate limiting to both API routes~~ — ✅ done, `lib/rate-limit.ts`,
   verified live on both routes (§1.3, §2.2).
3. ~~Add the SPA/JS-rendering limitation~~ — ✅ done,
   `lib/tools/ai-visibility-checker/meta.ts` (§2.3).
4. ~~Re-run `tsc`/`biome`/`vitest` as the final gate~~ — ✅ done, all green
   (§3).
5. **Provision `PSI_API_KEY`, set it in Vercel** — 🔲 **your turn** (§1.1).
   This is the only step left, and it needs an account this assistant
   cannot access.
6. (Optional, your turn) Add Vercel Firewall rate-limit rules as a second
   layer on both routes (§1.3/§2.2's "extra layer" note).
7. (Optional, your turn) Set up UptimeRobot on the two tool pages (§3).
8. Once step 5 is done: re-run the "not yet run" rows in §1.4's smoke-test
   checklist against the real deployment — that's the only behavior this
   session couldn't exercise locally.

### Files changed this pass
- `lib/rate-limit.ts` (new) — the in-memory rate limiter.
- `app/api/speed-test/route.ts` — wired in the limiter.
- `app/api/ai-visibility/route.ts` — wired in the limiter.
- `lib/tools/website-speed-test/logic.ts` — added `'rate-limited'` to
  `SpeedTestErrorCode` and `ERROR_CODES`.
- `components/tools/WebsiteSpeedTest.tsx` — added the matching
  `ERROR_GUIDANCE` entry.
- `lib/tools/ai-visibility-checker/logic.ts` — added `'rate-limited'` to
  `ApiErrorCode`.
- `lib/tools/ai-visibility-checker/meta.ts` — added the SPA/JS-rendering
  limitation sentence.

---
