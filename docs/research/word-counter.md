# Word Counter — research brief

> **Provenance.** Confirmed against a live search for "word counter online free
> character count tool" (July 2026). My hypothesis was **wrong on two counts**:
> Hemingway and Grammarly do not rank for this query (the intent is "count", not
> "edit"), and the privacy angle I assumed was ours is already the headline claim
> of a direct competitor. Corrections recorded below.

## Competitors (from the live SERP)

1. WordCounter.net — https://wordcounter.net/character-count
2. QuillBot Word Counter — https://quillbot.com/word-counter
3. wordcounter.io — https://wordcounter.io/
4. wordcounttool.com — https://www.wordcounttool.com/
5. wordcount.com — https://wordcount.com/

Also surfaced: [JustDone](https://justdone.com/word-counter),
[Character Count Online](https://www.charactercountonline.com/),
[Easy Word Count](https://easywordcount.com/) and
[ZeroGPT](https://www.zerogpt.com/word-counter).

## Common traits — table stakes

- Live counting as you type, no submit step
- Words, characters, characters-without-spaces, sentences, paragraphs
- Reading time, usually speaking time too
- Keyword density with common words excluded
- A large, comfortable writing area
- Nothing gated behind an account

### Shipped

| Trait | Status |
|---|---|
| Live counting | Yes — pure computation, recomputed on keystroke, no debounce |
| The five core counts | Yes |
| Reading + speaking time | Yes — at 238 and 130 wpm, both stated rather than hidden |
| Keyword density | Yes — single terms and two-word phrases, stopwords excluded |
| Large writing area | Yes — now fills the full pane height |
| Ungated | Yes |

### Deliberately excluded

- **Grammar and spelling checking.** Hemingway and Grammarly do this and it is the
  main reason people use them. Doing it properly needs a language model or a large
  rules corpus; doing it badly means confidently wrong advice. Out of scope for a
  counter, and pretending otherwise would be the worst option.
- **A Flesch / Gunning-Fog readability grade.** Every competitor shows one. They
  all depend on syllable counting, which is unreliable for English without a
  pronunciation dictionary, and a precise-looking "grade 9.4" built on a guess is
  worse than saying less. Replaced with mean sentence length — a figure we
  genuinely measure — plus a plain-language band and the longest sentence quoted
  back, which is the actionable part of a readability score anyway.
- **Ads and "related tools" rails.** wordcounter.net's are dense enough to shift
  the layout while you type.

## Individual standouts

- **wordcounter.net** — a word-count goal with visible progress. Taken.
- **charactercounttool.com** — per-platform limits (X, meta tags, and so on) rather
  than one abstract character count. Taken, and extended: ours shows characters
  *remaining* per platform and says "over by N" once you pass it.
- **Hemingway** — highlights the specific sentence that is too long rather than
  scoring the document. Taken in spirit: the longest sentence is quoted verbatim.
- **Grammarly** — the writing surface is the whole interface.
- **wordcounttool.com** — breadth of secondary statistics.

## Our USP

**Ours counts characters the way the platforms actually count them.**

Narrowed from what I first claimed. The corrections:

- ❌ **"Never uploaded" is NOT ours alone.** wordcount.com's own headline is
  "Instant & Private… text stays in your browser". Claiming privacy as the
  differentiator would have been false.
- ❌ **Platform limits are NOT unique either.** QuillBot already surfaces limits for
  Facebook posts and X. Ours goes further — characters *remaining* per platform,
  and "over by N" once you pass — but it is a better execution of an existing
  idea, not a new one.
- ✅ **Grapheme-accurate counting does appear to be ours.** `Intl.Segmenter` counts
  grapheme clusters, so a ZWJ family emoji is one character. A naive
  `String.length` calls it seven; `Array.from` calls it four.

**Verified, not asserted:** the seeded sample contains an emoji, and in the running
tool the character count reads 324 where a naive `.length` on the same text returns
325. The sample was chosen so this is demonstrable on first paint rather than being
a claim in prose.

That one-character difference is invisible until you are three characters from a
280-character limit — at which point a counter that disagrees with the platform is
worse than no counter. Since the limit badges are the main reason to open this
tool, the unit they are measured in is the whole product.

The draft autosaves to `localStorage` on this device only.

## Design decisions

- **Editor-shaped workspace.** Left pane is a writing surface filling the full
  height; right pane is the readout. Previously the stat tiles sat above a
  fixed-height textarea, so the numbers scrolled out of view exactly when the
  document got long enough to care about them.
- **Four counts get large type**, the rest go in a definition list. Words,
  characters, sentences, paragraphs are what people come for; average word length
  is a detail, and typography should say so.
- **Platform limits are their own block**, above the secondary statistics, because
  "does this fit" is a more common question than "how long is my average word".
- **Words / phrases is a toolbar toggle**, and bigram counting only runs when the
  phrases view is showing — it walks every sentence, so there is no reason to pay
  for it on each keystroke while the words view is up.
- **The goal lives in the toolbar** as a number input, with a native `<progress>`
  in the output pane. Native rather than a styled div: it is announced correctly
  with no ARIA of its own.
- **The density bar is `aria-hidden`.** The count and percentage beside it carry
  the information, so nothing depends on seeing the bar.
