# Photo Trends: the 1980s Bollywood retro wave (Sept 2026)

Research context for `lib/prompts/photo-trends/prompts.ts` — the first batch in
the `photo-trends` prompt category — and for the four launch blog posts under
`lib/blog/`. Kept here, not deleted after launch, because this category is a
**recurring format**: the saree trend, the polaroid-with-celebrity trend, the
3D-figurine trend and the 90s Bollywood trend all came before this one and all
reduce to the same prompt structure below. The next viral photo trend is an
append to `prompts.ts` plus a new section in `viral-ai-photo-trends-india`
(the evergreen hub post), not a new project — this doc is what makes that a
fifteen-minute job instead of a re-research.

## The trend

AI-generated 80s-retro portraits went viral on Instagram in India in
early September 2026; mainstream Indian press picked it up on 2026-09-09
(Business Today, NewsX, OneIndia). The India/Pakistan version skews
**Bollywood** — chiffon saree, Filmfare/Stardust magazine cover, Ambassador
car, Doordarshan-era living room, baraat wedding procession — not generic
Western retro, which is why it has more staying power here than in the US.
Both ChatGPT (GPT Image) and Gemini (Nano Banana) can run it; Gemini is
free, faster, and better at face retention.

## Who was ranking, and the gap

| Site | Shape | Weakness |
|---|---|---|
| lightxeditor.com | ~4,500 words, 42 prompts | Funnels to a paid editor; all 42 prompts share one boilerplate opening sentence; no "why" |
| sushilprompt.com | ~4,500 words, "21+" prompts | 4 duplicated prompts inside the 21; pastes Midjourney flags (`--ar 9:16 --v 6.1`) into prompts meant for ChatGPT — those do nothing there, read as literal text |
| News sites (Business Today, NewsX, OneIndia) | One prompt each | Thin, will decay, no library |
| facecast.app | Explains a 6-ingredient recipe | Best competitor conceptually, but few actual prompts |

**Nobody combined** a large verified prompt library, an explanation of *why*
a prompt holds the face, and correct per-model syntax. Also common across
competitors: their prompts mostly describe a person from scratch rather than
editing the uploaded photo, which is why so many published outputs don't
look like the person who ran them.

## Why prompts actually work — the mechanic

Face drift is the #1 failure mode. The fix is a fixed order, identity lock
first — the model weights early instructions most heavily when it re-renders
an uploaded image:

1. **Identity lock (always first)** — face, bone structure, skin tone, age,
   expression unchanged; name what MAY change (hair, clothes, pose,
   background, era). Group prompts (couples/family) need a headcount/position
   lock here too ("anchor each face to its counterpart by position") — the
   group-specific failure mode alongside plain face drift.
2. **Hair** — permed volume/crown height, feathered layers, side part,
   mullet, hairspray sheen.
3. **Wardrobe + props** — shoulder pads, high-waist denim, chiffon saree,
   oversized plastic earrings, aviators, boombox, Ambassador/Maruti 800.
4. **Light** — "direct on-camera flash, hot foreground, hard shadow behind
   the shoulder." This single line does most of the "looks like 1986" work;
   left unstated, models default to soft, flattering, contemporary lighting.
5. **Film stock** — soft grain, faded warm colour, slight halation, the
   look of a print that sat in an album. Optional: a red-orange date stamp.
6. **Backdrop** — mottled grey/blue studio canvas, pastel gradient, laser
   starburst, wood panelling.

Then two rules that apply across every block, not just one:

- **Exclusions must be positive statements** — neither ChatGPT nor Gemini has
  a negative-prompt field, so "no modern phone, no modern text, no logos"
  has to sit inside the same prose block as everything else.
- **Aspect ratio must be stated in words** ("vertical 9:16 portrait crop").
  `--ar`/`--v` are Midjourney-only flags; ChatGPT and Gemini read them as
  literal garbage text. This is the single most common mistake in the
  competing prompt lists above.

Group prompts run longer than solo ones (~320 words vs ~230) because they
carry rules solo portraits don't need: headcount locking, per-face position
anchoring, and age preservation across generations. That length is
load-bearing — it's what stops a family photo coming back with the wrong
headcount, or a grandmother rendered forty years younger.

## This site's technical shape (for the next trend batch)

- URL: `/prompts/<category>/<slug>` — flat; groups never appear in the URL.
- Data: `lib/prompts/<category>/prompts.ts` exporting `readonly Prompt[]`.
- `PromptCategorySlug` (`lib/prompts/types.ts`) is a closed union — a new
  category needs edits in `types.ts`, `categories.ts`, and `registry.ts`
  (import + spread, in group order).
- `lib/prompts/registry.test.ts` gates global slug uniqueness and
  lowercase-kebab-case only. Category counts are ungated on purpose.
- `PromptExampleImage` (optional on `Prompt`) carries `src`, `alt`, and an
  optional `aspectRatio` (`'9:16' | '3:4' | '4:3' | '16:9'`) — added for this
  category, since a trend-prompt card with no picture does not convert.
  Card grids (`PromptCard`) always crop to a uniform 4:5; only the detail
  page (`PromptDetailShell`) sizes its box to the prompt's own stated ratio.
- `PromptCopyBlock`'s WhatsApp/Telegram share buttons (added for this
  category, but wired for every prompt in the library) always append the
  page's own URL to the shared text — the whole growth mechanic is the link
  in the shared message bringing a WhatsApp group back to the site. A share
  that carries only the prompt text leaks all of its traffic.

## Producing example images for a new trend batch

Every prompt in a visually-driven category like this one needs a real
example image, generated from the actual prompt — never reused from a
competitor's page (copyright problem, and it would show visitors a result
the prompt doesn't actually produce).

1. Open the Gemini app (free, fast, best face retention) or ChatGPT, upload
   a **consenting** subject's photo — a team member, a friend who agreed, or
   licensed stock. Never a customer photo, a photo found online, or anyone
   who hasn't seen and approved the output appearing on a public page. Keep
   a written note of who agreed to what.
2. Paste the prompt exactly as written — no edits — and save the result.
3. Judge it at full zoom, not thumbnail size: does the face still read as
   the same person? Does the period look real or like a filter? Any
   anachronism in frame (a phone, a flat-screen, an LED lamp)? For group
   prompts: is the headcount right, is every face attached to the right
   person, is nobody quietly de-aged?
4. **If a prompt fails twice, that's a signal about the prompt, not the
   model.** Hold it back rather than shipping a card whose picture
   doesn't match what the prompt does. Fewer working prompts beats more
   disappointing ones.
5. Export WebP, longest edge 1200px, quality ~80, under 200KB. Save to
   `public/prompt-images/<category>/<filename>.webp` using the exact
   filename in the prompt's `exampleImage.src`.
6. Once every image is in, correct `verifiedAgainst.date` (and the
   `version` string, if the model version differs from what's on record) to
   the day it was actually tested — running all N prompts to produce the
   images **is** the verification pass. There is no separate QA session to
   schedule.

### 80s batch — the 40-image checklist

Every filename below still needs the actual photo generated per the process
above; the code and copy are complete and waiting on this. `public/prompt-images/photo-trends/` exists in the repo with a `.gitkeep`
placeholder for the destination.

**Men (8)**

| Filename | Prompt slug | Ratio | Subject |
|---|---|---|---|
| `80s-angry-young-man-studio.webp` | `photo-trends-80s-angry-young-man-studio` | 9:16 | Rust-brown corduroy blazer, 1986 Hindi film studio portrait, mottled grey canvas |
| `80s-ambassador-car-lean.webp` | `photo-trends-80s-ambassador-car-lean` | 9:16 | Leaning against a white Hindustan Ambassador, Indian roadside, late afternoon |
| `80s-doordarshan-living-room.webp` | `photo-trends-80s-doordarshan-living-room` | 9:16 | Floral sofa, wood-panelled 1986 drawing room, boxy television, direct flash |
| `80s-disco-dancer-stage.webp` | `photo-trends-80s-disco-dancer-stage` | 9:16 | Silver sequinned blazer, hazy 1987 stage, laser starburst, hot rim light |
| `80s-filmfare-magazine-cover.webp` | `photo-trends-80s-filmfare-magazine-cover` | 3:4 | 1986 Indian film magazine cover star, masthead over hair, cover lines |
| `80s-college-campus-denim.webp` | `photo-trends-80s-college-campus-denim` | 9:16 | Denim jacket, shaded college corridor, flat faded 1985 snapshot |
| `80s-baraat-groom.webp` | `photo-trends-80s-baraat-groom` | 9:16 | Cream sherwani and turban, white horse, 1986 night wedding procession, hard flash |
| `80s-government-office-portrait.webp` | `photo-trends-80s-government-office-portrait` | 9:16 | 1984 government office, wooden desk, steel almirah, green fluorescent light |

**Women (10)**

| Filename | Prompt slug | Ratio | Subject |
|---|---|---|---|
| `80s-chiffon-saree-hillside.webp` | `photo-trends-80s-chiffon-saree-hillside` | 9:16 | Pale lilac chiffon saree, backlit hillside, golden hour, pallu lifting in wind |
| `80s-terrace-golden-hour.webp` | `photo-trends-80s-terrace-golden-hour` | 9:16 | Mustard salwar kameez, Indian rooftop terrace, low sun, water tanks and antennas |
| `80s-studio-portrait-blue-canvas.webp` | `photo-trends-80s-studio-portrait-blue-canvas` | 9:16 | Classic 1986 studio portrait, mottled blue canvas, backcombed hair, gold earrings |
| `80s-stardust-cover-diva.webp` | `photo-trends-80s-stardust-cover-diva` | 3:4 | 1987 film gossip magazine cover star, fuchsia sequinned top, period makeup |
| `80s-college-girl-salwar-kameez.webp` | `photo-trends-80s-college-girl-salwar-kameez` | 9:16 | Pink floral salwar kameez, long plait, books, shaded 1985 college corridor |
| `80s-wedding-reception-kanjeevaram.webp` | `photo-trends-80s-wedding-reception-kanjeevaram` | 9:16 | Deep maroon Kanjeevaram silk, temple jewellery, 1986 wedding reception stage |
| `80s-boombox-denim-street.webp` | `photo-trends-80s-boombox-denim-street` | 9:16 | Big permed hair, high-waisted denim, twin-deck boombox, faded painted wall |
| `80s-chetak-scooter-portrait.webp` | `photo-trends-80s-chetak-scooter-portrait` | 9:16 | Teal cotton saree, 1980s step-through scooter, sunlit residential lane |
| `80s-kitchen-steel-utensils.webp` | `photo-trends-80s-kitchen-steel-utensils` | 9:16 | Faded green cotton saree, 1985 Indian kitchen, single window, steel dabbas |
| `80s-cabaret-stage-glam.webp` | `photo-trends-80s-cabaret-stage-glam` | 9:16 | Gold sequinned gown, mid-movement, hazy dark 1988 stage, hot coloured rim light |

**Couples (7)**

| Filename | Prompt slug | Ratio | Subject |
|---|---|---|---|
| `80s-couple-studio-portrait.webp` | `photo-trends-80s-couple-studio-portrait` | 9:16 | Coordinated jewel-tone 1986 formalwear, studio portrait, mottled blue canvas |
| `80s-couple-film-poster.webp` | `photo-trends-80s-couple-film-poster` | 3:4 | Hand-painted 1987 Hindi film poster, two large painted faces, action vignette |
| `80s-couple-honeymoon-hills.webp` | `photo-trends-80s-couple-honeymoon-hills` | 9:16 | Woollen sweaters, misty hill-station viewpoint railing, cold flat light |
| `80s-couple-mandap-wedding.webp` | `photo-trends-80s-couple-mandap-wedding` | 9:16 | Cream sherwani, red Banarasi silk, mandap, 1986, hard flash + warm firelight |
| `80s-couple-ambassador-drive.webp` | `photo-trends-80s-couple-ambassador-drive` | 4:3 | Through the wound-down window of a white Ambassador, Indian highway, 1986 |
| `80s-couple-living-room-sofa.webp` | `photo-trends-80s-couple-living-room-sofa` | 4:3 | Floral-print sofa, 1986 drawing room, flash-lit, two hard shadows on the wall |
| `80s-couple-rain-song-frame.webp` | `photo-trends-80s-couple-rain-song-frame` | 16:9 | Backlit 1987 film rain sequence, lit rain streaks, hard front key light |

**Family (7)**

| Filename | Prompt slug | Ratio | Subject |
|---|---|---|---|
| `80s-family-studio-portrait.webp` | `photo-trends-80s-family-studio-portrait` | 4:3 | Family in tiers, 1986 studio group portrait, mottled blue canvas |
| `80s-family-ambassador-outing.webp` | `photo-trends-80s-family-ambassador-outing` | 4:3 | Family posed around a white Ambassador, Indian street, bright 1986 morning |
| `80s-family-doordarshan-sunday.webp` | `photo-trends-80s-family-doordarshan-sunday` | 4:3 | Family around a boxy television, 1987, faces lit by the screen's cool glow |
| `80s-family-joint-family-grandparents.webp` | `photo-trends-80s-family-joint-family-grandparents` | 4:3 | Three generations, house verandah, 1985, grandparents seated, family standing |
| `80s-family-park-picnic.webp` | `photo-trends-80s-family-park-picnic` | 4:3 | Cotton sheet under a tree, Indian park, 1986, steel tiffin boxes, dappled light |
| `80s-family-diwali-night.webp` | `photo-trends-80s-family-diwali-night` | 4:3 | Front steps, Diwali night 1986, lit by clay oil lamps, one sparkler burning |
| `80s-family-hill-station-holiday.webp` | `photo-trends-80s-family-hill-station-holiday` | 4:3 | Woollen sweaters and caps, misty hill-station railing, flat overcast 1987 light |

**Friends & Groups (4)**

| Filename | Prompt slug | Ratio | Subject |
|---|---|---|---|
| `80s-friends-college-steps.webp` | `photo-trends-80s-friends-college-steps` | 4:3 | Arms over each other, stone steps, 1985, one crouched at front, open shade |
| `80s-friends-hostel-room.webp` | `photo-trends-80s-friends-hostel-room` | 4:3 | Bunk bed, cluttered 1986 hostel room, poster wall, single bare hanging bulb |
| `80s-friends-gully-cricket.webp` | `photo-trends-80s-friends-gully-cricket` | 4:3 | After a gully cricket match, narrow Indian lane, 1986, chalk wicket, long shadows |
| `80s-friends-restaurant-table.webp` | `photo-trends-80s-friends-restaurant-table` | 4:3 | Rexine restaurant booth, 1987, hard direct flash, nearest faces brightest |

**Kids & Parents (4)**

| Filename | Prompt slug | Ratio | Subject |
|---|---|---|---|
| `80s-birthday-party-1986.webp` | `photo-trends-80s-birthday-party-1986` | 4:3 | Candlelit cream cake, 1986 home birthday party, paper hats, crepe streamers |
| `80s-school-photo-day.webp` | `photo-trends-80s-school-photo-day` | 3:4 | 1985 school photo day, white shirt, striped tie, navy pullover, grey-blue canvas |
| `80s-father-and-child-portrait.webp` | `photo-trends-80s-father-and-child-portrait` | 3:4 | Parent on a stool, child leaning against their knee, 1986 studio, mottled blue |
| `80s-mother-daughter-doorway.webp` | `photo-trends-80s-mother-daughter-doorway` | 3:4 | Cream and pale blue sarees, painted doorway, soft 1986 morning light |

### A deliberate trade worth knowing about

The two magazine-cover prompts and the film-poster prompt explicitly
instruct the model **not to attempt Devanagari** script. Real Indian film
magazines of the era carried Hindi type; this trades a little authenticity
for a usable image, since non-Latin script is where current image models
fail hardest and garbled Devanagari would be more damaging than English-only
lettering. Reversible in three prompts if that trade ever looks wrong.

## Sources

- <https://www.businesstoday.in/technology/news/story/instagram-80s-photo-trend-goes-viral-how-to-create-your-own-retro-photo-using-chatgpt-554148-2026-09-09>
- <https://www.lightxeditor.com/blog/80s-chatgpt-prompt/>
- <https://www.newsx.com/offbeat/1980-photo-prompt-chatgpt-want-viral-80s-retro-look-here-are-chatgpt-prompts-to-transform-your-instagram-photos-269824/>
- <https://www.oneindia.com/artificial-intelligence/what-is-the-80s-ai-trend-going-viral-on-social-media-from-piyush-goyal-to-kumar-vishwas-joining-th-8200141.html>
- <https://facecast.app/chatgpt-80s-photo-prompt/>
- <https://sushilprompt.com/chatgpt-new-trend-80s-photo-prompts/>
- <https://ai.google.dev/gemini-api/docs/image-generation>
- <https://techcrunch.com/2025/09/17/india-leads-the-way-on-googles-nano-banana-with-a-local-creative-twist>
