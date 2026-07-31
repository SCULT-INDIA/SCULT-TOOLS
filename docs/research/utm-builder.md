# UTM Link Builder — research brief

> **Provenance.** Confirmed against a live search for "UTM builder campaign URL
> builder tool" (July 2026). My hypothesis was **mostly wrong**: of the five I
> guessed, only CampaignTrackly actually ranks. Google's own builder, UTM.io,
> Terminus and Effin Amazing did not appear for this query. Real set below.

## Competitors (from the live SERP)

1. CampaignTrackly — https://www.campaigntrackly.com/
2. Trackingplan UTM Builder — https://www.trackingplan.com/utm-builder-tool
3. Elementor UTM Builder — https://elementor.com/tools/utm-builder-tool/
4. Elsop Insights UTM Builder — https://www.elsop.com/utm-builder/
5. Attri UTM Builder — https://attri.io/tools/utm-builder/

Also surfaced: [Teamcamp](https://www.teamcamp.app/resources/utm-builder) and a
comparison listicle at [Analytify](https://analytify.io/best-utm-campaign-builder-tools/).

Google's own Campaign URL Builder remains the reference implementation everyone
imitates even though it did not rank for this phrasing — worth treating as a sixth
benchmark rather than ignoring because of one query's results.

## Common traits — table stakes

- The five UTM parameters with inline guidance on each
- Live assembled URL, no submit step
- One-click copy
- Base-URL validation
- Required-vs-optional marked (source, medium, campaign vs term, content)

### Shipped

| Trait | Status |
|---|---|
| Five parameters with hints | Yes — each field shows its own `utm_*` name inline |
| Live assembled URL | Yes, and it is the largest element in the output pane |
| Copy | Yes |
| URL validation | Yes — including preserving an existing query string and `#fragment` |
| Required/optional marked | Yes |

### Deliberately excluded

- **Link shortening.** Common in the link-management tier of this category. It
  requires a redirect service we would have to keep alive forever, and a UTM link
  whose parameters are hidden behind a shortener cannot be inspected by the person
  pasting it — the opposite of what this tool is for.
- **Saved campaign libraries and team sync.** CampaignTrackly's core paid offering;
  needs accounts and a backend. The local preset covers the actual repeated-use
  problem for one person without either, and is honest that it is per-device.
- **Bulk CSV generation.** A real need for large teams, but a different tool with a
  different interface. Better as its own thing than as a mode bolted onto this one.

## Individual standouts

**Scope limit, stated plainly:** what follows is drawn from SERP descriptions and
prior familiarity, not from a field-by-field walkthrough of each of the five
confirmed tools. The feature attributions below are therefore lower-confidence than
the competitor list above, and a proper pass should open each one.

- **Google's builder** (benchmark, not top-5 for this query) — the plainest
  explanation of each parameter, and the implementation everyone imitates.
- **CampaignTrackly** — link *management* at scale: bulk generation plus a library
  of previously built links, which is the paid-tier problem this category solves.
- **Trackingplan** — frames UTMs as a data-quality problem rather than a string-
  concatenation problem, which is the same diagnosis our USP rests on.
- **Elementor** — lowest friction: embedded in a tool people already have open.
- **Elsop / Attri** — the straightforward free-utility execution; the baseline to
  beat rather than a source of ideas.

The two ideas actually taken — persisted presets, and enforced casing — are
established in this category rather than novel. What is ours is making the casing
rule the **default** and explaining its consequence at the point of use.

## Our USP

**Ours normalises casing by default and shows you the GA4 consequence at the point
of use.**

Weaker than "the only one that…", deliberately: lowercase enforcement exists
elsewhere in this category, so claiming novelty would be false. What is defensible
is that it is **on by default** here, that the non-default choice is visible rather
than hidden in an unchecked box, and that the reason sits next to the output
instead of in a blog post.

GA4 compares dimension values byte-for-byte. `Spring Sale`, `spring sale` and
`spring-sale` are three separate campaigns in the report, and there is no way to
merge them after the clicks have landed. Most builders will happily hand you a URL
containing a capital letter and a space. Ours lowercases, converts whitespace runs
to single hyphens, and collapses repeated and edge hyphens — while deliberately
leaving underscores alone, because `paid_social` is an established value and
rewriting it would silently break an existing report.

Source, medium and the casing rule persist locally, so the next campaign is tagged
the same way without an account.

## Design decisions

- **The URL gets the emphasis.** It sits in a bordered lavender panel at 15px mono
  with copy in the pane header. Previously it was one row of a result list under
  the form — wrong emphasis for a tool whose entire output is one string.
- **Casing is a toolbar toggle with both states named** ("Enforce lowercase" /
  "Leave as typed") rather than a checkbox, so the non-default choice is visible
  rather than implied by an empty box.
- **Each field shows its own `utm_*` parameter name** next to the human label, so
  the mapping to what appears in GA4 is never a guess.
- **The parameters-applied list shows the normalised values**, which is how you see
  what the casing rule actually did.
- **The "why casing matters" note lives in the output pane**, next to the evidence,
  not in the prose below the tool where it would be read after the mistake.
