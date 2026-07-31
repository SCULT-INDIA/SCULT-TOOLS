# Marketing ROI Calculator — research brief

Research run 2026-07-30 with live search. Every URL below was fetched and its
inputs/outputs read, so the trait table is recorded evidence rather than recall.

**The plan's §4 hypothesis was wrong and is corrected here.** `docs/TOOL_REDESIGN_PLAN.md`
guessed HubSpot / WebFX / Omni Calculator / Klipfolio / CoSchedule. In the actual
results for "marketing roi calculator", none of the last four appear, and
HubSpot's `roi-calculator/marketing` is not a campaign ROI calculator at all — it
estimates the ROI of *buying HubSpot Marketing Hub* from 299,000 customers'
aggregated data (inputs: visitors, deals, deal size; output: projected uplift
against a $12,600/yr licence). It is a sales instrument wearing a calculator's
clothes, so it is not a competitor for this keyword.

## Competitors

1. SE Ranking — https://seranking.com/free-tools/marketing-roi-calculator.html
2. American Marketing Association — https://www.ama.org/toolkits/online-advertising-roi-calculator/
3. Piwik PRO — https://piwik.pro/roi-calculator/
4. AgencyAnalytics — https://agencyanalytics.com/blog/marketing-roi-calculator
5. ClickUp — https://clickup.com/free-tools/marketing-roi-calculator

### Also fetched (they bear directly on the USP, so omitting them would be dishonest)

- **Swetrix** — https://swetrix.com/tools/roi-calculator — the *only* other tool
  found that asks for profit margin and derives break-even ROAS.
- **Solid HQ** — https://www.solidhq.com/tools/roi-calculator/ — optional COGS field.
- **HubSpot** — https://www.hubspot.com/roi-calculator/marketing — see note above.

## Common traits (3+ of 5) — table stakes

| Trait | Present in | Shipped |
|---|---|---|
| Spend/cost + revenue in, ROI % out | 5 of 5 | Yes |
| Net profit stated in currency, not only a ratio | SE Ranking, AgencyAnalytics, ClickUp, (Swetrix, Solid HQ) | Yes |
| The ROI formula printed on the page | SE Ranking, AgencyAnalytics, (Swetrix FAQ, Solid HQ) | Yes — and substituted with your own figures, see USP |
| No signup to see the result | SE Ranking, Piwik PRO, AgencyAnalytics, ClickUp | Yes |
| Results update without a submit step | SE Ranking, Piwik PRO, AgencyAnalytics, ClickUp | Yes — recomputed per keystroke |
| Multi-channel / multi-scenario comparison | SE Ranking (per-channel rows), AMA (per-campaign sheet), Piwik PRO (uplift grid) | **No — excluded, see below** |
| Cost per lead / per conversion | SE Ranking, AMA, (Swetrix CAC) | **No — excluded, see below** |

Two traits that are *not* table stakes despite looking like it: currency
selection (only SE Ranking, of the five) and gross margin as an input (only
Swetrix and, as optional COGS, Solid HQ). The second is the whole opening.

## Individual standouts

- **SE Ranking** — per-channel rows with a cost-vs-revenue chart, so you can see
  which channel is carrying the account. Also the only one of the five offering a
  currency switch (USD/EUR/GBP/JPY).
- **AgencyAnalytics** — the formula sits beside the calculator as a worked example
  (₹10k spend → ₹30k revenue → 200%), so the number is never a black box.
- **Piwik PRO** — a scenario grid: what ROI and CAC-payback look like if the
  conversion rate improves +10/20/30/50/75/100%. The best "so what do I do about
  it" of the set.
- **ClickUp** — the shortest path in existence: two fields, no sign-in, instant.
- **AMA** — ties activity cost to leads and closed deals in one sheet, so ROI and
  cost-per-lead come from a single set of numbers. Gated behind AMA membership.
- **Swetrix** *(also-checked)* — asks for profit margin and reports break-even
  ROAS plus a margin-of-safety figure.

## Our USP

**Ours is the only one that makes the break-even ROAS your margin demands the
headline rather than a footnote — and states in words whether that is a profit or
a loss.**

Precisely what is and isn't unique, because the claim has to survive scrutiny:

- **Four of the five ignore margin entirely.** SE Ranking, AMA, Piwik PRO,
  AgencyAnalytics and ClickUp all compute (revenue − cost) ÷ cost. That treats
  every rupee of revenue as a rupee kept, i.e. it assumes a 100% gross margin.
  Feed the ₹50,000 → ₹1,50,000 campaign into any of them and it reports **+200%
  ROI**. At a 25% margin the same campaign is **−25% ROI and ₹12,500 down**. The
  most common tool for the job is not slightly imprecise here; it has the sign
  wrong.
- **Swetrix is the one honest exception** — it asks for profit margin and does
  compute break-even ROAS. But it reports it as one tile among thirteen (CAC, CPC,
  CPM, CTR, conversion rate, margin of safety…) with no verdict and no working.
  Ours puts your ROAS *directly against* the break-even ROAS, states the gap in
  words ("1.00× short of break-even"), and names the outcome — *Losing money* —
  in text, never by colour alone.
- **The working is shown with your figures in it.** AgencyAnalytics prints a
  generic worked example; SE Ranking prints the ROMI formula. Neither substitutes
  your numbers. "Show the maths" here walks all seven steps with your inputs
  filled in, which is what makes the number defensible in a meeting where someone
  else's dashboard says +200%.
- **The verdict cannot contradict the figures.** `logic.ts` computes in integer
  paise and basis points and derives the verdict from the same rounded
  net-profit paise it displays. No floating-point money, so ₹0.00 net profit
  never reads as "Profitable".
- Client-side and ungated, which the four free web tools also are — so this is
  parity, not an advantage, and is not claimed as one. Against AMA (membership
  wall) and HubSpot (a licence pitch) it is an advantage.

## Deliberately excluded

- **Multi-channel comparison** (3 of 5 have it). It multiplies the input surface
  by N and turns a single-scenario decision tool into a spreadsheet — and a table
  of per-channel ROI computed *without* margin, which is what SE Ranking and AMA
  actually give you, is a table of wrong signs. The three toolbar example
  scenarios do the comparison that matters: two of them are the **same 3× ROAS**
  at 25% and 80% margin, with opposite verdicts. Worth revisiting only once a
  per-channel row could carry its own margin.
- **Cost per lead / per conversion / CAC** (3 of 5). Needs a conversions input and
  new tested logic, and it answers a different question (efficiency of buying a
  lead) from the one this tool exists to answer (whether the money came back).
  Adding it would dilute the single insight the page is built on. Noted as a
  follow-up rather than a silent omission.
- **Currency selection** (1 of 5). The site is India-facing, the FAQ is
  GST-denominated and `formatInr` deliberately uses Indian digit grouping
  (₹1,50,000, not ₹150,000). A currency dropdown that kept lakh grouping for
  dollars would be worse than not offering one; doing it properly means a locale
  and a grouping convention per currency, which is real work in `logic.ts`.
- **Conversion-rate uplift scenarios** (Piwik PRO's best idea). Genuinely good,
  but projecting revenue from an assumed uplift is forecasting, and this tool's
  claim is that it does not flatter you. Break-even revenue is the honest version
  of the same answer: "here is the revenue that makes ROI zero", measured rather
  than assumed.
- **Customer lifetime value.** Already argued in the tool's own FAQ: a generous
  enough LTV multiplier makes every campaign look profitable.

## Design decisions

- **Left pane is the form, right pane is the verdict** — the workspace's
  form-shaped variant, same as UTM Builder. Previously the result sat in a
  `ResultPanel` in a second column with the "why margin matters" explainer
  competing for the same space.
- **The break-even comparison is the second thing you see**, directly under the
  verdict, on a bordered lavender panel with two bars on a shared scale. It was
  previously row four of a seven-row definition list — the tool's entire reason
  to exist, formatted as trivia. The bars are `aria-hidden`; the figures beside
  them carry the information.
- **Verdict never depends on colour.** The pastel behind it changes
  (mint/yellow/peach), but the words "Profitable", "Break-even", "Losing money" and
  the sentence underneath ("Gross profit … does not cover the … it cost") state the
  outcome, and an arrow icon reinforces it. Readable in greyscale, correct to a
  screen reader.
- **Toolbar carries the three example scenarios**, because loading one changes
  both panes. Two share a 3× ROAS and disagree on the verdict, which teaches the
  point faster than any paragraph.
- **Margin gets quick-pick buttons** (30/50/80%) inside its fieldset, since "what
  margin should I use" is the question that stalls this form. They are
  `aria-pressed` toggles adjacent to the field they fill, not toolbar controls.
- **Break-even ROAS covers ad spend only** — `1 ÷ margin` says nothing about
  agency fees. When other costs are non-zero the panel says so explicitly and
  points at break-even *revenue* instead, so the ROAS comparison can never be read
  as contradicting the verdict.
- **"Show the maths" stays a native `<details>`** — keyboard-operable with no ARIA
  of its own, and it is the page's E-E-A-T asset: seven steps, your numbers, no
  hand-waving.
- **`tabular-nums` on every figure**, so digits do not shift width as you type.
- **Status bar is the only live region**, carrying the verdict wording plus ROI,
  ROAS and break-even ROAS. `ResultPanel` was dropped partly because it ships its
  own `aria-live`, which would have made two.
