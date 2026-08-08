# Website Speed Test — research brief

**Search run:** 30 July 2026, `website speed test` (primary keyword), plus
`test my website page speed core web vitals tool` as a secondary intent check.

**Provenance.** The competitor set below is from a real SERP, recorded with URLs.
Feature confirmation is mixed and is labelled per source: DebugBear and Uptrends
were fetched and their own copy quoted; GTmetrix and WebPageTest both return
**HTTP 403** to a non-browser fetch and Pingdom's page is JS-rendered (the fetch
returned a title and nothing else), so their features come from SERP snippets and
comparison articles rather than first-party copy. Where a trait rests only on
that weaker evidence, it says so.

One correction to the plan's §4 hypothesis: **PageSpeed Insights did not appear
in the organic results for either query.** It is the engine this tool calls, and
it is what everyone recommends in forum answers, but it is not what ranks for the
keyword. The five below are.

## Competitors

1. Pingdom Website Speed Test — https://tools.pingdom.com/
2. DebugBear Website Speed Test — https://www.debugbear.com/test/website-speed
3. Uptrends Website Speed Test — https://www.uptrends.com/tools/website-speed-test
4. WebPageTest — https://www.webpagetest.org/
5. GTmetrix — https://gtmetrix.com/

## Common traits (3+ of 5) — table stakes

| Trait | Evidence | Status |
|---|---|---|
| Mobile / desktop (or device) selection | DebugBear ships "Mobile + US East" / "Desktop + US East"; Uptrends offers "Select the size of the browser window"; GTmetrix and WebPageTest both expose device choice (snippet evidence) | **Shipped** — toolbar segmented toggle |
| Core Web Vitals reported | 5 of 5. Uptrends names "Google's Core Web Vitals"; DebugBear has a dedicated Core Web Vitals test page | **Shipped** — LCP, INP, CLS classified against Google's published thresholds |
| Field (real-user) vs lab distinction | DebugBear lists "Google CrUX Monitoring" and "Synthetic Monitoring" as separate things; GTmetrix advertises CrUX data; PSI itself splits them | **Shipped** — stated in words, per section, with the reason a page may have no field data |
| Prioritised improvement suggestions | DebugBear "opportunities to improve your page load time", "detects over 25 common performance issues"; Uptrends "Optimization suggestions you need to focus your efforts"; Pingdom and GTmetrix both grade and recommend | **Shipped** — top five, sorted by estimated saving |
| A shareable result | DebugBear links a sample report at a permanent URL; Uptrends has a "Share results button and copy a shareable link to your clipboard" | **Partly shipped** — see exclusions |
| Waterfall / request chart | 5 of 5 (DebugBear "Learn how to read a request waterfall"; Uptrends "waterfall report gives you the URL, the load progression, the request and response headers"; GTmetrix, Pingdom, WebPageTest all per snippet evidence) | **Excluded** — see below |
| Test-location choice | 5 of 5, though mostly gated: DebugBear "Sign up to test from 30+ test locations", Uptrends "choose from 10 worldwide locations", GTmetrix "if you register" | **Excluded** — see below |
| Page size / request count | Uptrends shows "the quantity and size of your page elements"; Pingdom and GTmetrix likewise | **Excluded** — see below |
| Scheduled tests / historical monitoring | GTmetrix schedules "daily, weekly, or monthly" with alerts; DebugBear "Lighthouse Score Monitoring"; Pingdom and Uptrends both sell monitoring | **Excluded** — see below |

## Individual standouts

- **DebugBear** — puts real-user CrUX data and its own lab test side by side in
  one report, so you can see where the lab disagrees with actual visitors.
- **WebPageTest** — depth and control: private instances via the API, CI
  integration, and custom scripts that can log into a site before testing it.
- **GTmetrix** — scheduling with alerts, so a regression finds you rather than
  waiting for you to re-run a test.
- **Uptrends** — breadth of vantage points for a free tool: 10 locations against
  229 checkpoints, and Chrome-vs-Edge comparison.
- **Pingdom** — the least intimidating report of the five; a single grade and a
  waterfall, with no account wall in the way of the basic run.

## Our USP

**Ours is the only one that answers the question you actually asked — "is this
page fast enough, and what do I fix first?" — as a sentence, before any numbers,
with every rating written as a word and nothing behind a login.**

Three parts, all load-bearing:

1. **A verdict, not a dashboard.** Every competitor's report is a surface to
   explore: a waterfall, 25+ detected issues, filmstrips, tabs. Useful if you are
   a performance engineer, useless if you are a marketer who needs to know
   whether to escalate. `summariseVerdict` reduces the run to one line — which of
   the three Core Web Vitals fail, and by how much against Google's stated
   boundary — and the fix list is capped at five, sorted by estimated saving.
2. **Nothing gated.** GTmetrix withholds full Core Web Vitals unless you are
   logged in; DebugBear requires signup for anything beyond one US-East location.
   There is no account here, no run limit tied to one, and no field hidden until
   you give an email address.
3. **Ratings are words, everywhere.** Every one of these tools leans on a
   red/amber/green number. This one prints "Good", "Needs improvement" or "Poor"
   next to every figure, and the pre-run pane shows the exact thresholds it will
   judge against — generated from the same `METRIC_THRESHOLDS` constant the
   classifier uses, so the reference cannot drift from the verdict.

**What is deliberately not claimed:** this is the one tool on the site that is
*not* client-side. Google's Lighthouse has to run the page, so the URL you test
goes to Google via our route handler. The site's privacy badge is switched off
for this tool (`runsInBrowser: false` in its meta) and the status bar says where
the test runs instead of implying it is local.

## Deliberately excluded

- **Waterfall / request chart** (5 of 5 have it). The PSI API returns
  `network-requests` as an audit table, so this is technically reachable — but a
  waterfall is an exploration surface, and shipping one would make this the
  60-metric dump the USP exists to avoid. It is also the single most expensive
  thing to render well; a bad waterfall is worse than none. Revisit as a
  collapsed, second-level dynamic import if evidence says people want it. (The
  third-party-cost and resource-breakdown-by-type additions below are compact
  single blocks derived from existing audits, not a per-request timeline — they
  do not reverse this exclusion.)
- **Test-location choice** (5 of 5). Not available: the PSI v5 API takes no
  location parameter — Google picks the data centre. Offering a location control
  that silently did nothing would be a lie. Noted rather than faked.
- **Page size / request count.** Available from the audits, excluded on the same
  grounds as the waterfall: neither number is actionable on its own, and both
  invite comparing yesterday's total against today's instead of reading the
  verdict.
- **A hosted permanent report URL.** DebugBear and Uptrends both give you one.
  Doing it properly means storing every result server-side, keyed and public by
  default — a database, a retention policy, and a decision about whether someone
  else's audit of their staging site is now indexable. Instead: **Copy report**
  puts the whole verdict on the clipboard as plain text (paste into Slack, a
  ticket, an email), and **Copy link** produces a link that prefills the URL and
  device so the recipient can reproduce the run. Deliberately prefills rather
  than auto-runs, so a shared link can never be used to make someone's browser
  fire a 40-second test on load.
- **Scheduled tests, alerts, historical trend.** All four monitoring products
  sell this. It requires accounts and stored history, which is a product, not a
  tool.
- **Filmstrip / load video.** DebugBear, WebPageTest and GTmetrix have it. PSI
  does return screenshot thumbnails, but a filmstrip diagnoses *what* renders
  slowly, which is the engineer's question, not the verdict question.

## Design decisions

- **The submit step stays.** This is the only tool on the site that does not
  compute as you type, and that is correct: a PSI run is 15–40 seconds of real
  Chrome. Auto-running would burn quota on every keystroke and make the page feel
  broken. The convention "results update as you type" explicitly exempts
  genuinely expensive work.
- **The pre-run output pane is the threshold reference**, not an empty state. It
  shows exactly what will be measured and the boundary each rating sits on,
  derived from `METRIC_THRESHOLDS`. That is information someone might come for on
  its own, so the pane is never dead space and the two panes never say the same
  thing.
- **The wait is narrated as a checklist**, not a spinner. Four stages, each
  marked Done / Now / Waiting in words, on timers that roughly track what PSI is
  doing. Below it, the threshold reference stays visible — so the 40 seconds has
  something to read rather than something to watch. The staged text also goes
  through the status bar, which is the tool's one polite live region, so a screen
  reader hears the progress without a second announcer competing.
- **Cancel is real.** An `AbortController` per run, plus a monotonic run id: the
  fetch is aborted, the stage timers are cleared, and any late response from a
  superseded run is dropped instead of overwriting the current one. A second
  submit can never race the first.
- **Device toggle lives in the toolbar**, per the layout contract, and the result
  headline states the device *the report was produced for* rather than whatever
  is currently selected — so flipping the toggle after a run cannot silently
  mislabel a report. If the two disagree the left pane says so and points at the
  run button.
- **The score is never a bare coloured number.** 0–100 in `text-ink`, with the
  band written out beside it and an icon. The per-metric track behind each value
  is `aria-hidden` decoration; the value, the rating word and the threshold are
  all text.
- **The form stays put after a run.** Re-testing the same page after a fix is the
  normal second action, and PSI's 6-hour cache means a repeat is instant.

## Later update: flagship positioning and a deeper-signals pass (2026-08)

This tool and the AI Visibility Checker are being positioned as the site's
two flagship products — the results most likely to be the first thing a
visitor runs and the ones most worth getting right. That status is why the
FAQ got a content-depth pass rather than a rewrite: the existing copy was
accurate, so the work was adding the specific, honest questions a real
visitor would ask next (why field data is sometimes missing, what
third-party scripts actually cost), not restating what was already there.

In parallel, a separate pass is deepening `logic.ts` with signals PSI's
audits already return but this tool did not yet surface: third-party script
cost, a resource breakdown by type, and server response time (TTFB). These
land as compact, single-block summaries alongside the existing top-five
opportunities — not a waterfall or a per-request table, which stays excluded
per the section above. The verdict-first shape, the five-opportunity cap and
the mobile/desktop toggle are unaffected; the new signals extend the report
that already exists rather than replacing any part of it.
