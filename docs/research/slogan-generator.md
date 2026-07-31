# Slogan Generator — research brief

## Provenance

Searched 2026-07-30 via WebSearch on three queries — `slogan generator`,
`tagline generator free online`, `best free slogan generator tool business
tagline maker 2026` — then fetched each candidate's own page to read its
documented feature set rather than assuming one.

The plan's §4 hypothesis named Shopify, Oberlo, Zyro, Ahrefs and Namify.
**Zyro, Ahrefs and Namify did not appear in any of the three result sets.** The
list below is what actually ranked; the hypothesis is corrected, not preserved.

Two pages returned **HTTP 403** to the fetcher (logo.com, Canva), so their
feature notes are marked unverified rather than filled in from memory.

## Competitors

Top 5 for the primary keyword `slogan generator`, in the order returned:

1. QuillBot AI Slogan Generator — https://quillbot.com/ai-writing-tools/ai-slogan-generator
2. Shopify Slogan Maker — https://www.shopify.com/tools/slogan-maker
3. Oberlo Slogan Generator — https://www.oberlo.com/tools/slogan-generator
4. Designhill Slogan Maker — https://www.designhill.com/tools/slogan-maker
5. logo.com Slogan Generator — https://logo.com/slogan-generator *(page fetch blocked, HTTP 403 — features unverified)*

Next in line, both of which ranked across more than one query, and one of which
stood in for logo.com when reading feature sets:

- Canva Slogan Generator — https://www.canva.com/slogan-generator/ *(fetch blocked, HTTP 403)*
- Copy.ai Slogan Generator — https://www.copy.ai/tools/slogan-generator *(fetched; used as the fifth verified data point)*

So feature extraction below rests on five pages actually read: QuillBot,
Shopify, Oberlo, Designhill, Copy.ai.

## Common traits (3+ of 5) — table stakes

| Trait | Seen in | Shipped |
|---|---|---|
| A single free-text seed field — a keyword or a one-line description | all 5 | Yes — keyword, plus an optional "what you do" noun that unlocks extra patterns |
| A batch of many candidates per press, not one | QuillBot, Oberlo, Designhill, Copy.ai | Yes — 10 per press |
| Free to generate, no cap that blocks the output | all 5 (Copy.ai meters at 2,000 words/month) | Yes — no cap, no account, no metering |
| Try again / regenerate in place | QuillBot, Shopify, Oberlo, Designhill | Yes — and it never repeats a line you have already been shown |
| Copy a chosen line out | Designhill documents a per-line copy icon; QuillBot, Shopify, Oberlo, Copy.ai only say "pick your favourite" | Yes — per line, plus copy-all for the batch and for the shortlist |
| Marketed as AI-powered | QuillBot, Shopify, Copy.ai explicit; Designhill applies it to its sibling logo tool; Oberlo says "built-in algorithm" | **Deliberately not** — see USP |

Three things **none of the five** documents, which is why they are our leverage
rather than our catch-up work:

- **User-selectable tone.** QuillBot lets you ask for a different tone in
  follow-up prose and Copy.ai spreads a batch across tones on its own, but no
  page exposes tone as a control you set before generating.
- **Character counts, or any relationship to ad limits.** Not mentioned on any
  of the five.
- **A shortlist.** No page documents saving or starring individual lines.

## Individual standouts

- **QuillBot** — the follow-up loop: refine in place and keep going until one
  lands, rather than starting the form again.
- **Shopify** — the lowest-friction entry of the five. One field, one button,
  nothing to configure before you see output.
- **Oberlo** — the only one of the five that describes its own mechanism
  honestly: a "built-in algorithm" drawing on "thousands of tried-and-true
  advertising slogans", with no AI claim attached.
- **Designhill** — the only one that documents the actual result-list mechanic
  (a copy icon on each line), rather than describing the feeling of the output.
- **Copy.ai** — deliberately spreads one batch across different angles
  (punchy, benefit-focused, aspirational) so a single press gives you range
  instead of five rewrites of the same idea.

## Our USP

**Ours is the only one that says plainly it is a curated template bank rather
than a language model — and the only one that prints each line's character
count against the Google Ads headline and description limits, so a slogan you
like is a slogan you can actually run.**

Both halves are load-bearing.

1. **Honesty as the feature, not a disclaimer.** Three of the five verified
   pages sell an AI model; Oberlo describes an algorithm over a slogan corpus,
   which is a template engine by another name. Saying so out loud is what buys
   the properties people actually came for: results appear in the same frame as
   the keystroke, there is no queue, no rate limit, no account, no prompt
   leaving the tab, and no cost to us that would eventually have to be
   recovered from the visitor. An honest template bank is a *smaller* claim and
   a *better* product for this job. The copy therefore never says AI-powered,
   AI-assisted, smart, or intelligent — including in the places where it would
   be easy filler.
2. **Character counts against real ad limits.** Google Ads allows 30 characters
   per headline and 90 per description line. A tagline of 34 characters is not
   a tagline you can run as a headline, and none of the five tells you that —
   you find out later, in the ads editor, when you have already put the line on
   a landing page. Every line here carries its count and a worded verdict, and
   the toolbar can filter the batch down to only the lines that clear 30.

## Deliberately excluded

- **LLM generation.** The entire point. An API call would add a key to protect,
  a per-generation cost, a rate limit, a spinner, and a round-trip that carries
  the visitor's unreleased brand name to a third party — trading away every
  property listed above for output that is longer, not better, at this length.
- **"Hundreds of slogans" (Oberlo, Designhill).** A wall of 200 near-duplicates
  is a scroll, not a shortlist; the reading is the work, and it gets pushed onto
  the visitor. Ten per press with guaranteed-no-repeat regeneration reaches the
  same lines while keeping the page readable, and the remaining count is shown
  so the finiteness is stated rather than hidden.
- **Logo / store / domain upsell (Shopify, Designhill, logo.com).** A slogan
  tool whose job is to route you into a paid logo builder optimises for the
  handoff, not for the slogans. There is no upsell in the workspace.
- **Trademark or availability checking.** It needs a registry round-trip, which
  contradicts the client-side claim, and a wrong "available" is far worse than
  no claim at all. Stated as a limitation in the prose below the tool instead.
- **A free-text "describe your brand" box (QuillBot, Copy.ai).** It only pays
  off with a model behind it. With template banks it would collect input the
  tool cannot use, which is a worse lie than a short form.

## Design decisions

- **Left pane holds the whole brief — keyword, what you do, tone, shortlist.**
  Tone lives here rather than in the toolbar because it is a statement about the
  brand alongside the other two, and because each tone earns a line describing
  what it sounds like, which a toolbar row cannot hold. The toolbar keeps what
  acts on the *view and the batch*: the ad-fit filter, the primary Generate, and
  Load sample / Clear.
- **The right pane is the batch and nothing else.** Ten cards, each with the
  line, its character count, its ad verdict, copy, and star.
- **Ad fit is a filter, not just a badge.** "Headline-ready" narrows the batch to
  lines of 30 characters or fewer, which turns the standout from a label you read
  into a decision you can act on.
- **The shortlist sits in the left pane.** It is a session-spanning collection,
  not part of this batch, and it fills height the input side would otherwise
  waste. Starring keeps the line in the batch, marked, so nothing jumps.
- **First paint is seeded and deterministic.** A fixed seed feeds the shuffle, so
  the server HTML and the first client render are identical and there is no
  hydration mismatch. `Math.random` is touched only inside the Generate handler.
- **Typing rewrites the batch in place rather than reshuffling it.** The seed is
  held in state, so changing the keyword re-renders the same ten patterns with
  the new word instead of throwing away a list you were halfway through reading.
- **Regenerate never repeats, across the whole session.** Every line shown is
  accumulated into a seen set that is passed to the generator as an exclusion,
  so batch four cannot resurface a line from batch one. When the tone's bank is
  exhausted the Generate button disables and the status bar says so, rather than
  quietly serving the same lines again.
- **Colour is never the only signal.** An over-limit line is worded — "too long
  for a headline", "too long for ad copy" — with the count next to it and an
  icon, so the verdict survives greyscale and a screen reader.
