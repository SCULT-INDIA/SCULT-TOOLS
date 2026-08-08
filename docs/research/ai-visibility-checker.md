# AI Visibility Checker — research brief

> **Provenance.** Confirmed against live searches for "AI visibility checker free
> tool AEO grader", `"AI visibility checker" free check your website AI search`,
> and "llms.txt checker robots.txt AI crawler checker GPTBot blocked tool"
> (July 2026), plus direct fetches of HubSpot's grader, Ahrefs' checker, LLM
> Pulse's robots checker and the Nuxt SEO validator.
>
> **The plan's hypothesis was wrong about the shape of the market.**
> `docs/TOOL_REDESIGN_PLAN.md` §4 listed HubSpot AEO Grader, Otterly.ai, Peec AI,
> Profound and Scrunch as the competitive set. Four of those five are not
> competitors for this tool's intent at all — they are subscription monitoring
> platforms (€89–$250/mo) that measure brand *mentions* inside LLM answers. They
> never ask for a URL and never read robots.txt. Only HubSpot's grader is a free
> URL-in / score-out tool. The tools that actually do what ours does are a
> separate, less glamorous cluster of robots.txt/AI-crawler checkers, recorded
> below as Cluster B. Both clusters are listed because the table stakes and the
> honest USP come from different halves of them.

## Competitors

Cluster A — what actually ranks for "AI visibility checker" / "AEO grader":

1. HubSpot AEO Grader — https://www.hubspot.com/aeo-grader
2. Ahrefs AI Visibility Checker — https://ahrefs.com/ai-visibility-checker
3. Semrush AI Search Visibility Checker — https://www.semrush.com/free-tools/ai-search-visibility-checker/
4. Otterly.ai — https://otterly.ai/
5. Peec AI — https://peec.ai/

Also in Cluster A and named in the plan: [Profound](https://www.tryprofound.com/)
(from $99/mo) and [Scrunch AI](https://www.scrunchai.com/) (from $250/mo;
acquired by Sitecore in June 2026). Neither is reachable without a plan, so
neither competes for "check my site now".

Cluster B — the functional competitors, i.e. tools that read your live
robots.txt and report per-AI-bot access, which is what this tool's centrepiece
does:

- Nuxt SEO Robots.txt Validator — https://nuxtseo.com/tools/robots-txt-validator
- LLM Pulse AI Robots.txt Checker — https://llmpulse.ai/robots-txt-checker
- Rank Prompt Free Robots.txt AI Checker — https://rankprompt.com/tools/free-robots-txt-ai-checker/
- NetworkCheckr AI Crawler Checker + llms.txt Validator — https://networkcheckr.com/ai-crawler-checker/
- MRS Digital AI Crawler Access Checker — https://mrs.digital/tools/ai-crawler-access-checker/

## Common traits (3+ of 5) — table stakes

Verified across Cluster A:

- **One field, one submit, a wait.** Every one of the five is a submit-step tool,
  not a live-as-you-type tool. Results in "under two minutes" (HubSpot), "in
  seconds" (Ahrefs).
- **A single headline score out of 100.** HubSpot (composite of five weighted
  dimensions), Semrush, Otterly, Peec. Ahrefs is the exception — it reports
  mention counts, not a score.
- **A per-engine breakdown.** All five split results by ChatGPT / Gemini /
  Perplexity / Copilot / AI Overviews rather than giving one undifferentiated
  number.
- **Prioritised recommendations.** HubSpot ("actionable recommendations"),
  Semrush, Otterly, Peec.
- **Gated output.** All five. HubSpot requires an "Unlock Your Report" form
  (company name, location, products/services, industry); Ahrefs shows a limited
  preview of the top 5 per section and sells the rest at $398–$699/mo; Semrush
  wants an account; Otterly and Peec are subscriptions. This is the trait whose
  *absence* is our advantage.
- **A report you can send to someone.** Cluster A all produce a report page or
  export. For a verdict whose whole purpose is to be handed to whoever owns the
  server, this is not optional.

From Cluster B:

- **A per-bot allowed/blocked table** covering GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, CCBot at minimum — present in all five.
- **llms.txt presence check** — NetworkCheckr, LLM Pulse, HarborByte.

### Shipped

| Trait | Status |
|---|---|
| One field, one submit | Yes — deliberately not live. It is a real fetch of a third-party site. |
| Headline score /100 | Yes — the existing weighted 40/20/20/10/10 score, now the largest element in the output pane |
| Per-engine breakdown | Yes, and finer than any competitor's: ten named crawlers, not four engine brands, because OpenAI alone ships three separate bots with three separate robots verdicts |
| Prioritised recommendations | Yes — six check cards, each with a `Fix:` line |
| Ungated | Yes. No email, no account, no preview cap |
| Shareable report | Yes — `?url=` permalink (re-runs on open, like PageSpeed Insights) plus a plain-text report on the clipboard for pasting into a ticket |
| Per-bot allowed/blocked table | Yes — the centrepiece, with the deciding rule quoted (see USP) |
| llms.txt check | Yes |

### Deliberately excluded

- **Prompting LLMs to count brand mentions** — the thing all five Cluster A
  tools actually do. Three reasons, in order of weight: it costs a paid API call
  per run against a ₹500/mo ceiling for this tool; it is non-deterministic, so
  two runs an hour apart disagree and neither is wrong; and it is unauditable —
  we could not show a user *why* the number is what it is, which is the exact
  quality this tool is built on. We measure the controllable, verifiable half of
  AI visibility and say plainly that it is half.
- **Competitor share-of-voice.** Same objection, plus it needs a competitor list
  the user has to supply.
- **Site-wide crawl.** One homepage is the honest scope for a free ungated
  endpoint; a crawl is a subscription product with a queue. Stated as a
  limitation on the page rather than quietly implied.
- **Email delivery of results** (LLM Pulse's model). That *is* the gate.
- **Running as you type.** Every keystroke would be an outbound request to
  someone else's server.
- **A verdict on whether you *should* allow AI bots.** Blocking GPTBot is a
  legitimate commercial decision. The tool reports state; it does not moralise.
  This is why `noai` is shown but excluded from the score.

## Individual standouts

- **HubSpot AEO Grader** — the clearest weighted-dimension breakdown of the five:
  sentiment 40 / presence 20 / recognition 20 / share of voice 10 / competition
  10, with the point allocation visible. Borrowed: we show the weight next to
  each check *before* you run, so the score is legible rather than magic.
- **Ahrefs** — the only Cluster A tool with no signup on the entry path, and it
  says so on the button. Borrowed: we say it too, and unlike Ahrefs there is no
  preview cap behind the promise.
- **Semrush** — tracks unlinked brand mentions, not just links.
- **Peec AI** — unlimited seats on every plan; the sanest team model in the set.
- **Nuxt SEO Robots.txt Validator** — reports the *matched* robots.txt rule per
  crawler rather than a bare verdict. The best idea in either cluster, and the
  one this tool is built around.

## Our USP

**Ours is the only ungated tool that scores AI visibility *and* shows the
robots.txt working behind every per-bot verdict — the rule that won, quoted, and
which User-agent group it came from.**

The claim is narrowed from the plan's version, and the narrowing is the point:

- ❌ **"Nobody else shows the matching rule" is not true.** Nuxt SEO's validator
  reports the matched rule per crawler, and LLM Pulse advertises "the exact lines
  responsible". Claiming this outright would have been false.
- ❌ **"Ungated" is not unique either** — Nuxt SEO and Ahrefs' entry path are
  both ungated. LLM Pulse is free but wants an email and mails you the result.
- ✅ **The combination is ours.** The tools that produce a score (HubSpot,
  Semrush, Otterly, Peec) never show you a robots rule. The tools that show you a
  robots rule (Cluster B) never score, never check schema, on-page basics or
  llms.txt, and mostly are not what a marketer searching "AI visibility checker"
  ever finds. Ours does both halves, for free, with no email.
- ✅ **Precedence is genuinely ours.** Every verdict names which group decided:
  a group naming that bot, the `User-agent: *` group, or no group at all. That
  distinction is the single most misread thing in robots.txt — people add
  `User-agent: GPTBot / Allow: /` under a blanket `Disallow: /` and assume the
  wildcard still applies, or the reverse. Showing which group won, plus the
  longest-match rule inside it, is the difference between a verdict and an
  explanation. No competitor found surfaces it.

Honest caveat kept on the page: crawlability is necessary, not sufficient. A
100/100 means AI engines *can* read you, not that they *will* cite you.

## Design decisions

- **Left pane is the request, right pane is the report.** The left states exactly
  what leaves our server — four URLs on your domain, once each, with the
  user-agent we send — so someone whose WAF might block us can whitelist it. The
  right pane before a run is the *legend*: the ten bots by name and company, and
  the six checks with their weights and one-line meanings. No sentence appears in
  both panes, and there is no second empty state — the pre-run right pane is the
  thing that teaches you to read the post-run right pane.
- **The per-bot table is a real `<table>`** with `<th scope="col">` per column and
  `<th scope="row">` on the bot name, because it is the centrepiece and it has to
  be navigable. Four columns: bot, company, access, deciding rule.
- **Access is a word and an icon, never a colour.** "Allowed" / "Blocked" in
  `text-ink`, paired with distinct glyph shapes (check in a circle vs cross in a
  circle) so it survives greyscale, colour blindness and a forced-colours theme.
- **The quoted rule is rendered as text, never markup**, and clamped to 120
  characters with the full value in `title`. It is third-party content from a
  stranger's robots.txt; a 100 KB `Disallow:` path is a cheap way to destroy a
  layout, and `dangerouslySetInnerHTML` appears nowhere in this tool.
- **Not `outputFirstOnMobile`.** Every other tool's result can be shown before
  you interact; this one cannot exist until you submit, so putting an
  explanation above the field you have to fill in would be backwards.
- **Toolbar holds what affects the output** — the "blocked only" table filter and
  the two share actions — never the submit button, which belongs with the field
  it validates so that Enter works.
- **Seeded, but with the seed we are allowed to fetch.** The workspace contract
  says paint with realistic sample data; a submit-step tool cannot paint a
  *result* without spending someone's bandwidth, so the field is seeded with
  `https://scult.in` — our own site — and the last URL you checked replaces it on
  the next visit. One click gives a real report without guessing at a stranger's
  domain.
- **One live region.** The StatusBar announces the staged progress while the
  fetch runs and the final "score / band" when it lands. The report itself is not
  a live region, so a screen-reader user gets one announcement rather than a
  hundred table cells.
- **`?url=` re-runs on open.** A link to a result is worthless if the recipient
  has to retype the domain; PageSpeed Insights set this expectation and the
  6-hour fetch cache on the route makes it cheap.
- **`logic.ts` and the API route were not touched apart from one append-only
  addition** (`formatReportText`). The RFC 9309 precedence logic and the SSRF
  gate are the two most security-critical and most-tested things in this
  repository, and the redesign was a UI problem.

## Later update: flagship positioning and a deeper on-page pass (2026-08)

This tool is being positioned as the site's flagship product — the one
result most likely to be the first thing a visitor runs and the one most
worth getting right. That status is why the FAQ got a content-depth pass
rather than a rewrite: the existing copy was accurate, so the work was
adding the specific, honest questions a real visitor would ask next (robots
precedence mistakes, noai versus a robots.txt block, why llms.txt only costs
half credit), not restating what was already there.

In parallel, a separate pass is deepening the on-page-signals half of
`logic.ts` — meta robots noindex/nofollow, Open Graph and Twitter Card tags,
canonical links, image alt-text coverage, named schema types, and thin-content
word counts are being added alongside the checks documented above. This
research brief and the tool's FAQ were written to describe the current check
list without over-specifying it, so that pass can land without leaving this
document stale. The 40/20/20/10/10 weighting and the crawler-access-dominates
rationale are unaffected — new on-page checks extend the existing "on-page
basics" weight rather than displacing it.
