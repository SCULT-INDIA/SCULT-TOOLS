# Business Name Generator — research brief

> **Provenance.** Live search was run on **2026-07-30** for `business name
> generator`, `free business name generator check domain availability` and
> `Namelix vs Looka vs Shopify business name generator features`. The five
> competitors below are taken from those result sets and the URLs are the ones
> returned. Feature detail for Shopify and Namelix was read from the pages
> themselves; **Looka returned HTTP 403 to a fetch**, so its feature list comes
> from search snippets and third-party comparisons rather than the page — treated
> as weaker evidence and marked where it matters.
>
> Plan §4 hypothesised *Namelix, Shopify, Looka, NameMesh, Brandroot*. Namelix,
> Shopify and Looka confirmed. **NameMesh and Brandroot did not appear anywhere in
> the results** and have been replaced by what actually ranks.

## Competitors

1. Namelix — https://namelix.com/
2. Shopify Business Name Generator — https://www.shopify.com/tools/business-name-generator
3. Looka — https://looka.com/business-name-generator/
4. Squarespace — https://www.squarespace.com/tools/business-name-generator
5. businessnamegenerator.com — https://businessnamegenerator.com/

Also ranking, not taken into the top five: bizee.com, design.com, canva.com,
logo.com, instantdomainsearch.com, dreamhost.com, businessnamegenerator.net.
`alternativeto.net` appeared and was discarded as a directory, not a tool.

## Common traits (3+ of 5) — table stakes

- Free, and names visible without an account or email
- One keyword / short description field, then a generate action
- A large batch of results in one go (Shopify states 100)
- **Inline domain availability** shown next to each name
- Filters that shape the output — name length and/or naming style
- Save / favourite a name you like
- A logo or brand-kit upsell reached from the name you picked
- **No explanation of why any given name is good.** Present in 5 of 5 as an
  absence: Namelix, Shopify and Squarespace give a bare list; Looka gives a
  verdict without its working. This is the gap the tool is built into.

### Shipped

| Trait | Status |
|---|---|
| Free, ungated | Yes — nothing behind an email, no account, no watermark |
| Keyword input | Yes — two slots, so a second angle can be mixed in |
| Batch of results | Yes — 12 shown from a pool of 24, Regenerate for a fresh batch |
| Naming styles | Yes — five, each explaining its own strategy in the pane |
| Length filter | Yes — Any / ≤8 / ≤12 letters, in the toolbar |
| Save / favourite | Yes — starred shortlist, persisted to this device's localStorage |
| Copy | Yes — per name, plus copy-all for the batch and for the shortlist |
| Domain path | Yes, as an **outbound check** — see the exclusion below |
| Inline availability verdict | **No, deliberately** — see the exclusion below |

### Deliberately excluded

- **Inline domain availability.** The single most common feature in the set, and
  the one we will not fake. A page running in the visitor's tab cannot resolve
  DNS or query a registrar; the only ways to show a tick are a server proxy we
  do not run or a cached affiliate feed that is wrong the moment it goes stale.
  Being wrong here is expensive in a way that a wrong word count is not — someone
  prints signage on it. Every card instead links to Namecheap's public search,
  labelled `Check cofara.com`, and the pane states plainly that this page holds no
  availability data. That is the honest version of the feature, not a reduced one.
- **Social handle availability.** Same reason, same answer, and no free
  client-callable API exists for it either.
- **Logo generation / brand kit.** What Namelix (via Brandmark), Looka, design.com
  and logo.com are actually selling; the name generator is the funnel. We have
  nothing to upsell and no image backend, and a fake logo preview would be the
  worst of both.
- **AI / LLM generation.** Would need a server round-trip, so it would cost money
  per query, break offline use, and send the visitor's business idea to a third
  party. It would also destroy the USP: you cannot print the formation recipe for
  a name a model invented. Combinatorial generation is *why* the transparency is
  possible, not a compromise on the way to it.
- **Trademark / company-registry search.** No free, reliable, client-side API for
  the Indian trademark registry or MCA. The tool's stated limitations point at
  both registries instead of implying it has checked them.
- **100-name dumps.** Shopify's 100 unexplained names is volume standing in for
  judgement. Twelve names each carrying three measurements is more decision-ready,
  and Regenerate makes the pool effectively unbounded anyway.

## Individual standouts

- **Namelix** — the learning loop: it remembers which names you liked and biases
  later batches towards them. Cleanest interface in the set.
- **Shopify** — the shortest path from name to owned domain, and the only one that
  advertises "no sign-up required" on the page itself.
- **Looka** — checks social handles as well as domains, and previews the name
  inside a logo so you see it as a brand rather than as text *(from snippets and
  comparisons — the page blocked a direct read)*.
- **Squarespace** — generates for anyone, no account, and immediately offers the
  site the name would sit on.
- **businessnamegenerator.com** — sheer output volume with filters layered over it.

## Our USP

**Ours is the only one that prints the measurements behind every name — letter
count and band, a pronounceability check, and the syllable split — and the only
one that refuses to tell you a domain is available when it cannot actually look.**

Both halves are load-bearing:

1. **The working is shown.** Each card carries the formation recipe (`root "cof-"
   of "coffee" + invented "-ara"`) and three measured chips. Namelix hands over a
   name with no rationale; Looka reports a verdict without its inputs. Naming is a
   decision someone has to defend to a co-founder, and "it scored 87" does not
   help them. "Six letters, easy to say, three syllables — and here is how it was
   built" does. It is also the honest description of what the tool is: curated
   word banks recombined deterministically, which is exactly why it is instant and
   why nothing typed here leaves the tab.
2. **No fabricated availability.** Everyone else's green tick is a claim about the
   world made from a cache. Ours is a labelled outbound check, and the tool says
   in plain words that it has no availability data. Ordering is honest for the
   same reason: "Best first" sorts by the two figures printed on the card, so the
   ranking is auditable rather than a hidden score.

## Design decisions

- **Names occupy the whole right pane.** Previously the keyword fields, five style
  buttons and Regenerate filled the first screen and the twelve names — the entire
  point of the tool — began below the fold. The grid is now level with the
  controls that produce it.
- **Style lives in the input pane, not the toolbar.** Deliberate divergence from
  the usual "mode toggle goes in the toolbar" habit: with only two text fields the
  left pane would sit near-empty against a twelve-card grid, and the style
  selector needs its explanatory blurb next to it. The toolbar keeps the controls
  that reshape an existing batch — length and order — plus Regenerate.
- **A pool of 24, twelve shown.** A length filter over exactly twelve names either
  does nothing or empties the grid. Measured before choosing: 24 costs 1.7 ms per
  batch on the slowest style and under 0.7 ms on the rest, so it stays on the main
  thread and recomputes on every keystroke. Raising it to 36 buys nothing — only
  the brandable style can fill a pool that large.
- **Filtering and ordering are memoised apart from generation**, so a toolbar
  toggle re-sorts an existing array instead of regenerating the batch.
- **"Best first" has no third tiebreak.** Caught in testing, not in review: an
  alphabetical tiebreak was tried first, and because brandable names are nearly
  all five or six letters and all easy to say, alphabetical order dominated — two
  different batches opened with the same three names, so Regenerate looked broken.
  Dropping the tiebreak leaves `Array.prototype.sort`'s stability to preserve
  generation order within a rank, and the top of the list now visibly changes.
- **An emptied filter is not an error.** If nothing clears the ceiling the pane
  says which style ran long and why, gives the shortest length actually in the
  batch, and offers one button back to "Any" — rather than reporting a failure the
  visitor did not cause.
- **Evidence as chips, tinted *and* worded.** `great length` / `good length` / `on
  the long side` and `easy to say` / `tricky consonant run` read identically in
  greyscale; the pastel tint is a second signal, and the tricky chip also carries
  a warning icon. Chip text is `ink-body` — the tints are pastels, where white and
  `violet-500` both fail contrast.
- **Shortlist moved into the input pane.** It used to be a full-width band between
  the controls and the results, which is precisely the layout fault the shared
  workspace exists to remove. Each entry's remove button names the name it
  removes, and each card's star is an `aria-pressed` toggle that does too.
- **One live region — the status bar.** The old version had its own `aria-live`
  paragraph announcing batch changes; the workspace's status bar already is one,
  so the second was removed. It reports the batch number, how many names are
  shown, how many are easy to say, and the shortlist size.
- **Deterministic first paint.** The seed is a plain counter, so the server and
  client render the same twelve names; no `Math.random()` or `Date.now()` during
  render, and the ordering tiebreak avoids `localeCompare` because ICU collation
  differs between Node and the browser.
