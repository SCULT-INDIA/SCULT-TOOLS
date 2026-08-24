# Launch Checklist — Where tools.scult.in Actually Stands

Compares the "Technical Launch Master Checklist" PDF against the real codebase.
No code in this document — just what exists, what's missing, and how to close
each gap. Organized in the PDF's own 7 sections so you can read them side by side.

## The one thing to know before reading the rest

**This checklist assumes a pre-launch project. tools.scult.in is already live**,
with 15 tools, 1,170 prompts, 100 blog posts, and a mature SEO/analytics/security
layer. So most of this document isn't "build this" — it's "here's the gap, and
here's the smallest way to close it without adding infrastructure you don't need."

The PDF's "Data Pipeline" section (bulk CSV import, duplicate detection, import
reports) also doesn't map cleanly onto this app: content here is authored as
typed TypeScript, not imported from a spreadsheet. That turns out to be a
**stronger** guarantee than the PDF's process — a bad entry fails the build, not
a review queue — but it means several checklist items are answered differently
than the PDF expects. Each section below says so explicitly.

---

## 1. Scope, Architecture & Ownership

**Already done**
- Architecture is documented informally across `docs/PLAN.md`,
  `docs/AGENT_CONVENTIONS.md`, `docs/REDESIGN_CONVENTIONS.md` — real detail,
  just spread across files instead of one map.
- No database. Content lives in typed registries (`lib/tools`, `lib/prompts`,
  `lib/blog`, `lib/guides`), checked into git — git history *is* the audit
  trail and rollback record the PDF asks for.
- Staging vs. production: Vercel's preview deployments (one per branch/PR) are
  the staging environment already.
- Third-party dependencies are few and named: Google PageSpeed API (speed-test
  tool), SCULT Studio (feedback/request submissions + analytics), GA4,
  Microsoft Clarity, GitHub API (star count). No sprawl to document.
- CI (`.github/workflows/ci.yml`) already gates every push: lint, typecheck,
  tests, build, `npm audit --audit-level=high`. That's most of "repeatable
  release process" already automated, not just written down.

**Gaps**
- No single architecture map or diagram — the pieces exist, they're just not
  in one place.
- No named risk register or ownership list (reasonable for a small/solo team,
  but cheap to write once).
- No rollback note — the mechanism already exists (Vercel keeps every prior
  deployment one click from being promoted back to production), it's just
  not written down anywhere.

**Best approach**
- One new file, `docs/ARCHITECTURE.md`, with a Mermaid diagram (plain text,
  no new tool needed) showing: Next.js app → Vercel edge → the external
  dependencies (PageSpeed API, SCULT Studio, GA4/Clarity). Fold in a one-paragraph
  "how to roll back" note pointing at Vercel's deployment history — that's the
  whole rollback plan; no custom tooling required.
- Ownership: a five-line table (technical, content, SEO, analytics, incident)
  is enough for a small team. Don't over-build this.

---

## 2. Data, Tools, Prompts & Skills Pipeline

**Already done — and structurally stronger than the checklist assumes**
- Canonical typed schema per tool and prompt (`lib/tools/types.ts`,
  `lib/prompts/types.ts`): slug, category, title, description, keywords, etc.
- Registry tests (`lib/tools/registry.test.ts`, `lib/prompts/registry.test.ts`,
  plus blog/guides equivalents) enforce exactly what the PDF's "bulk
  ingestion" section wants — no duplicate slugs, no orphaned entries, no
  missing required fields, no dangling category references — as an automated
  CI gate instead of a manual review step. This is the PDF's "acceptance gate"
  table, just implemented as tests that fail the build rather than a report a
  human has to read.
- Content has been fact-checked against real tool behavior over this project's
  build-out, not generated speculatively.

**Gaps**
- No draft/review/verified/published/archived status field — everything
  merged is implicitly published. There's no staged-content workflow.
- No "last verified" date distinct from the sitemap's last-modified date (that
  date is git's last-commit date, not "someone re-checked this is still
  true").
- No recurring re-verification cadence — nothing prompts a periodic re-check
  of older content.

**Best approach**
- Don't build an import pipeline or CMS — that would be new infrastructure to
  replace something CI already does better. If a status field is wanted, it's
  one optional field added to the existing type, defaulting to `'published'`,
  not a new system.
- For re-verification cadence: a recurring calendar reminder or a scheduled
  GitHub issue is proportionate here. A whole workflow-automation system would
  be solving a problem this size of content library doesn't have yet.

---

## 3. Application UX, Search & Core Journeys

**Already done**
- All core journeys work: homepage, category browse, tool pages, prompt
  pages, blog, guides — verified live in-browser repeatedly this session.
- Site-wide search (tools + prompts) is real, ranked, and — as of the most
  recent change — loads its index lazily instead of shipping it on every page.
- Zero-result searches are already tracked (`trackSearch(..., { has_results:
  false })` to GA4) — this is a checklist line item, already shipped.
- 404 page has its own search box and category suggestions — the "no-result
  suggestions" the checklist asks for.
- Keyboard navigation follows the ARIA 1.2 combobox pattern properly (not a
  bare `<input>`), skip-to-content link present, Lighthouse Accessibility is
  currently 100.
- Dark mode was deliberately removed this project cycle — one visual mode
  halves the QA surface area for every future UI change.

**Gaps**
- No curated "search evaluation set" — a fixed list of queries with an
  expected top result, checked automatically so a future ranking tweak can't
  silently regress a query that matters.
- No typo tolerance or fuzzy matching — search is exact/substring/synonym
  today.
- No written ranking-logic doc separate from code comments.

**Best approach**
- The evaluation set is the highest-value, lowest-cost item here: a short list
  of representative queries (brand names, common typos, category terms) with
  their expected top hit, run as one more vitest test alongside the existing
  registry tests. No new tooling.
- On fuzzy search: the checklist's own advice applies directly — "measure
  relevance before adding semantic search." Current exact/substring matching
  is very likely sufficient for a tools+prompts directory where people mostly
  type real names. If typo tolerance is wanted later, a small client-side
  library (e.g. Fuse.js) keeps the existing zero-backend, all-client-side
  search model intact — avoid anything that would require a server-side
  search index or third-party search service; that would be new
  infrastructure for a problem not yet shown to exist.

---

## 4. Performance, Reliability & Security

**Already done — this is where the most work has concentrated**
- Major performance work this cycle: eliminated a 7.5MB client bundle
  regression, then found and removed a ~1MB search-index payload that was
  being embedded in every page's HTML (now served as its own cached asset,
  fetched only on search intent). Font loading, image formats (AVIF/WebP),
  and link-prefetch behavior have all been tuned and verified against real
  production measurements.
- Security headers are set site-wide in `next.config.ts` (Content-Type
  sniffing protection, clickjacking protection, referrer policy, permissions
  policy).
- All three API routes (`ai-visibility`, `speed-test`, `feedback`) are
  rate-limited (`lib/rate-limit.ts`).
- The AI Visibility Checker's server-side fetcher specifically defends against
  SSRF: rejects private/loopback addresses, caps redirects, caps response
  size, times out.
- The feedback route never exposes its email API key client-side, escapes
  user input before it reaches an email body, and has its own honeypot field
  against bots.
- CI already runs `npm audit --audit-level=high` on every push — dependency
  vulnerability review is automated, not a manual pre-launch task.
- No database means no backup/restore surface exists in the traditional
  sense — content changes are git commits, and Vercel's deployment history
  already provides instant rollback.

**Gaps**
- No incident runbook document.
- No error/uptime monitoring beyond Vercel's own dashboard and Vercel
  Analytics — no alerting if the site goes down or errors spike.
- No documented, repeatable cross-device/slow-connection test procedure (this
  cycle's mobile-performance verification was real but ad hoc, not a
  checklist someone else could repeat).
- CORS policy has never been explicitly reviewed and written down (Next.js
  API routes are same-origin by default, which is almost certainly already
  correct — it just hasn't been stated as a decision).

**Best approach**
- Incident runbook: pure documentation — a short `docs/RUNBOOK.md` with "site
  is down → check Vercel status → redeploy previous deployment → notify."
  No new tooling required.
- Monitoring: Vercel's dashboard already covers deployment/function health.
  If real-time error alerting is wanted, Sentry's free tier has a first-party
  Next.js/Vercel integration and is the standard low-effort choice — but treat
  this as optional. A static/no-accounts site carries much lower blast radius
  from an unnoticed error than one holding user data, so this is a P2, not a
  launch blocker.
- Repeatable test procedure: write down the exact PageSpeed Insights / Chrome
  DevTools device-emulation steps already used this cycle as a short
  checklist in `docs/RUNBOOK.md`, so the next person doesn't have to
  rediscover the process.

---

## 5. SEO, Analytics & Discoverability

**Already done — this section is close to fully complete**
- Per-route metadata (unique titles, descriptions, canonical URLs) via
  `generateMetadata`, deliberately *not* set at the root layout to avoid
  every page silently inheriting the homepage's canonical.
- `sitemap.xml` and `robots.txt` both exist and cover every content type
  (tools, prompts, blog, guides, static pages) — plus `llms.txt` and
  `llms-full.txt`, which go beyond what the checklist even asks for (explicit
  AI-crawler discoverability).
- Open Graph and Twitter Card metadata are set site-wide (an inheritance bug
  here was found and fixed this cycle).
- Structured data (JSON-LD) is in place for the organization, breadcrumbs,
  articles, and FAQs.
- Deliberate internal cross-linking between tools, prompts, blog posts, and
  guides was built out this cycle specifically to strengthen topical
  authority and crawl paths.
- GA4 and Microsoft Clarity are both wired up, and both deliberately deferred
  until first user interaction so analytics never costs performance.
- Tracked events already cover most of the checklist's list: page views, tool
  interaction, prompt interaction, CTA clicks, search (including zero-result
  searches specifically), and outbound-link UTM attribution to the parent
  agency site.
- The privacy page explicitly discloses Clarity's session-recording masking
  mode — a real, specific disclosure, not boilerplate.

**Gaps**
- Google Search Console verification is an *account-side* action outside the
  codebase — it needs to be confirmed done (or done) directly in Search
  Console; nothing here can verify or complete it.
- No cookie/consent mechanism — GA4 and Clarity currently load for every
  visitor by default. Whether this is a real compliance gap depends on which
  markets are being targeted (EU/UK visitors specifically expect a consent
  choice; this is worth a deliberate decision either way, not silence).
- No single dashboard combining GA4 + Clarity — they're two separate views
  today, not a unified "launch dashboard."

**Best approach**
- Search Console: a five-minute manual task, not an engineering task —
  confirm the domain is verified and the sitemap is submitted.
- Consent: the existing `DeferredAnalyticsScripts` component already gates
  GA4/Clarity behind "has the visitor interacted yet." A consent choice can
  hook into that exact same gate — this is a small addition to something
  that already exists, not a new subsystem. Don't reach for a heavyweight
  consent-management platform for a site this size; a simple stored
  yes/no choice is proportionate.
- Dashboard: GA4 alone already supports a simple custom report covering the
  events already being sent — no new tool needed, just configuration inside
  GA4 itself.

---

## 6. QA, Soft Launch & Release Freeze

**Already done**
- CI is a real, automated release gate on every single push and PR — lint,
  types, tests, build, and a dependency-vulnerability check all have to pass.
  That covers a large share of what this section is asking for structurally.
- 800+ automated tests across registries, components, and tool logic.
- This cycle's changes were each verified live in a real browser against
  production before being pushed — not just unit-tested.

**Gaps**
- No formal, repeatable cross-browser/device test matrix (desktop
  Chrome/Edge/Safari, Android Chrome, iPhone Safari, tablet) — verification
  this cycle used one browser automation tool, not the full matrix.
- The site is already public, so there's no "soft launch to a limited
  audience" step left to take in the traditional sense.
- No release-tagging or changelog discipline tied to actual deploys (a
  changelog page exists in the app, but whether it's kept current alongside
  every release is a process question, not a code question).

**Best approach**
- Full manual cross-browser matrix testing (via BrowserStack or similar) is
  disproportionate for a small team's regular release cadence — reserve it
  for major redesigns, not every push, since CI already catches most
  regressions structurally.
- Since the site is live, treat the *next* meaningful milestone — e.g. an
  open-source announcement, a Product Hunt / Hacker News post, a major
  redesign — as the "soft launch" this section describes, and apply its
  discipline (freeze scope, watch metrics closely for the first 24–48 hours)
  to that event specifically, rather than to routine work.

---

## 7. Launch-Day Runbook & 30-Day Stabilization

**Gap — this whole section is genuinely unbuilt, and that's fine to say plainly**

This section is a live-operations discipline for a launch event, not something
that exists as "done" or "not done" in code. Since the site is already live,
there's no launch day to run this against yet — but the *next* major public
moment (open-source announcement, big feature push, a promotional campaign)
is exactly when this section becomes useful.

**Best approach**
- Write it once, as a short document, timed to the *next* significant public
  event rather than as a general-purpose document sitting unused: a
  T-24h / T-1h / T0–T+6h / Days 1–7 / Days 8–30 checklist, reusing the
  monitoring and rollback pieces from Section 4. This is pure documentation —
  no tooling decision needed, just discipline at the moment it matters.

---

## Best practices worth keeping (and one worth adopting)

**Keep doing this — it's working:**
- **Content as typed code, not a CMS or database.** It gives compile-time and
  CI-enforced correctness the PDF's whole "bulk ingestion" section is trying
  to achieve through process. Don't replace this with a CMS to satisfy a
  checklist line item that this architecture already answers differently and
  more strongly.
- **CI as the release gate**, not a manual pre-launch checklist run by a
  person. Every new "must be true before launch" rule from this document
  should become a CI check where it can, the same way slug-uniqueness and
  dependency vulnerabilities already are.
- **Measure before optimizing** — this cycle's biggest wins (the 7.5MB bundle,
  the 1MB embedded search index) were both found by measuring real production
  output, not by guessing. Keep doing that before reaching for a new library
  or service.

**Worth adopting:**
- **Write decisions down once, in `docs/`, instead of re-deciding them.**
  Several gaps above (CORS is same-origin, rollback is "promote a previous
  Vercel deployment", the ranking approach is deliberately simple) are
  already correct decisions — they just haven't been written down, which
  means they get silently re-litigated later. A handful of short docs
  (`ARCHITECTURE.md`, `RUNBOOK.md`) fixes that cheaply.

---

## If you can only do five things next

In the order they'd matter most:

1. Decide the consent/cookie question for GA4 + Clarity, and implement it via
   the existing `DeferredAnalyticsScripts` gate. This is the one item with
   real compliance exposure.
2. Confirm Google Search Console is verified and the sitemap submitted
   (five-minute account check, not engineering work).
3. Write `docs/RUNBOOK.md`: how to check site health, how to roll back via
   Vercel, and the device/network test steps already used this cycle.
4. Add a small curated search-evaluation test so future ranking changes can't
   silently break a query that matters.
5. Consolidate the architecture into one `docs/ARCHITECTURE.md` with a
   Mermaid diagram, so the next person (including future-you) isn't
   reassembling it from five files.

Everything else in this document is real, but lower-stakes than these five —
proportionate to close whenever there's spare time, not before the next push.
