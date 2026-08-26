import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'dalle-ad-creative-hero-image-with-headline-space',
    category: 'dalle',
    title: `Generate a paid-social ad hero image with the headline already legible inside the frame`,
    description: `A hero-image brief for GPT Image that treats the ad's headline as text rendered directly into the pixels, not a caption bolted on after export, plus a conversational follow-up step for spinning off square, 4:5, and Story-ratio crops from the same approved image instead of re-rolling each one from scratch.`,
    promptText: `PRODUCT OR OFFER
{{product_or_offer}}

HERO VISUAL
{{hero_visual_description}}

HEADLINE TO RENDER ON THE IMAGE
Render this exact line of text directly into the image, not as a caption you describe afterward: "{{headline_text}}". Set it in a bold, high-contrast sans-serif, large enough to stay readable at thumbnail size in a phone feed, and keep it to this one line — do not paraphrase it, shorten it, or add a second line the brief didn't ask for.

WHERE THE TEXT SITS
{{text_placement}}. Leave this area of the frame genuinely clear of busy detail before the text goes in — a headline dropped over a cluttered background is the single most common reason on-image ad text ends up unreadable, and no amount of bolding the type fixes a background that was never cleared for it.

BRAND COLOR AND MOOD
{{brand_color_and_mood}}

WHAT TO KEEP OUT OF FRAME
No second product, no competitor-style logo, no stock-photo watermark, no small print or fine-print text anywhere else in the image — one headline, rendered once, is the only text this image should contain.

FIRST PASS
Generate this as one image at {{primary_aspect_ratio}}.

FORMAT VARIANTS (do this after the first image is approved, in the same conversation)
Once the hero image above looks right, ask for that same approved image re-cropped and re-composed — not regenerated from a fresh description — into {{additional_formats}}. Reference "the image above" explicitly rather than re-typing the brief as a new prompt; re-describing it as a fresh generation risks a different product angle, a different headline placement, or a shifted color grade landing in the second format even though nothing about the ad was supposed to change.

OUTPUT
One primary hero image with the headline legible inside the frame, followed by the additional format variants generated as in-conversation edits of that same approved image rather than independent re-generations.`,
    variables: [
      {
        name: 'product_or_offer',
        description: `The product or promotion this ad is actually selling.`,
        example: `A 3-month specialty-coffee subscription box, first box 50% off`,
        required: true,
      },
      {
        name: 'hero_visual_description',
        description: `The core scene or object the ad is built around.`,
        example: `an overhead shot of a steaming ceramic mug of pour-over coffee beside a torn-open kraft-paper shipping box with beans spilling out`,
        required: true,
      },
      {
        name: 'headline_text',
        description: `The exact headline copy to render into the image, verbatim.`,
        example: `Your first box is half price`,
        required: true,
      },
      {
        name: 'text_placement',
        description: `Where on the frame the headline should sit, and what's near it.`,
        example: `upper third of the frame, over the plain wood tabletop to the left of the mug, not over the beans or the box`,
        required: true,
      },
      {
        name: 'brand_color_and_mood',
        description: `The color palette and emotional register the ad should carry.`,
        example: `warm terracotta and cream tones, soft morning light, cozy rather than corporate`,
        required: true,
      },
      {
        name: 'primary_aspect_ratio',
        description: `The main format to generate first.`,
        example: `1:1, for an Instagram feed post`,
        required: true,
      },
      {
        name: 'additional_formats',
        description: `The extra crops or aspect ratios to pull from the approved image afterward.`,
        example: `a 4:5 feed crop and a 9:16 Story/Reels crop, with the headline repositioned so neither platform's UI overlay covers it`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT Image)`],
    tags: [
      `ad-creative`,
      `paid-social`,
      `gpt-image`,
      `on-image-text`,
      `aspect-ratio-variants`,
    ],
    whyItWorks: `GPT Image generates text as part of the same native image-token stream as the rest of the picture rather than compositing it on afterward the way older diffusion-only pipelines effectively had to, which is the specific reason a short, exact headline string rendered directly into the frame comes back legible far more often than it did on prior-generation DALL·E models that reliably garbled anything beyond a couple of words — but that reliability drops fast once the surrounding composition is already busy where the text needs to sit, which is why the brief clears that area explicitly rather than trusting the model to find clean space on its own after the fact. The format-variant instruction leans on a specific mechanical difference between an in-conversation follow-up and a brand-new prompt: asking ChatGPT to re-crop "the image above" conditions the next generation on the actual approved pixels already in the thread, carrying forward the exact product angle, color grade, and headline styling that were just signed off, whereas typing a fresh description of the same ad into a new generation call has nothing to anchor it to that specific result and will re-synthesize the whole scene from language alone — close to the original, but rarely identical, and identical is the entire point once one version has already been approved for use. Naming everything that must stay out of the frame matters because GPT Image, trained on a huge corpus of real ad and product photography where competing badges, watermarks, and secondary products are common, will add one of those elements on its own initiative more often than a brief-writer expects unless it's told explicitly not to.`,
    exampleOutput: `A warm, morning-lit product shot with the exact line "Your first box is half price" rendered crisply over the clear tabletop area, followed by two additional crops of that same approved image in 4:5 and 9:16 with the headline nudged to stay clear of each platform's UI chrome.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image (2026 release)', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT Image (2026 release).`,
      },
    ],
  },
  {
    slug: 'dalle-app-ui-concept-multi-screen-consistency',
    category: 'dalle',
    title: `Design a multi-screen app UI concept that keeps its own design system straight across screens`,
    description: `A phased UI-concept brief that locks a design system in the first generated screen — corner radius, type scale, accent color — and carries it into follow-up screens as in-conversation continuations instead of restating the whole brief and risking a different design system on every screen.`,
    promptText: `PHASE 1 — ESTABLISH THE SCREEN AND THE DESIGN SYSTEM

APP CONCEPT
{{app_concept}}

SCREEN TO DESIGN FIRST
{{first_screen}}

DESIGN SYSTEM TO ESTABLISH
{{design_system_tokens}}. State these as fixed rules for every screen this conversation goes on to produce, not a style suggestion for this one image — corner radius, type scale, spacing rhythm, and the specific accent color should read as deliberate, repeatable system choices, not a one-off illustration style that happened to look good once.

DEVICE FRAME
{{device_frame}}

Generate this first screen now as a clean, high-fidelity concept render — real-looking UI chrome (status bar, navigation, buttons) with legible label text rendered directly in the image, not lorem-ipsum blocks standing in for text.

PHASE 2 — ADD SCREENS THAT REUSE THE SAME SYSTEM (same conversation, after Phase 1 is approved)
{{additional_screens}}. For each one, explicitly instruct: reuse the exact type scale, corner radius, spacing, and accent color from the approved first screen — reference "the same design system as the screen above" rather than restating the whole design-system description again, so the follow-up generation anchors to what was already approved instead of independently reinterpreting a generic app style for each new screen.

PHASE 3 — CATCH DRIFT BEFORE IT COMPOUNDS
After each new screen comes back, check it against the first screen specifically for: the accent color hasn't shifted hue, the corner radius on cards and buttons matches, the type weight and hierarchy match. If any screen drifts, correct it as an in-context edit ("match the button corner radius to the first screen exactly") rather than accepting the drift and hoping the next screen self-corrects — small inconsistencies compound across a multi-screen set faster than they get noticed one screen at a time.

WHAT NOT TO DO
Do not ask for all screens in one single combined image — a single generation asked to render several different app screens at once reliably shrinks each one down toward illegibility and blends their UI chrome together. Request one screen per generation, in sequence, in this same conversation.

OUTPUT
One high-fidelity concept image per screen, delivered in sequence, each one visibly sharing the same type, color, and shape system as the first.`,
    variables: [
      {
        name: 'app_concept',
        description: `What the app does, in one sentence.`,
        example: `A budgeting app for freelancers that tracks irregular income against fixed monthly bills`,
        required: true,
      },
      {
        name: 'first_screen',
        description: `The single screen to design and approve before any others.`,
        example: `the home dashboard, showing this month's income so far against upcoming bills`,
        required: true,
      },
      {
        name: 'design_system_tokens',
        description: `The specific, reusable visual rules the whole app should follow.`,
        example: `rounded 20px corners on cards, a single teal accent (#1F8A70) used only for primary actions and the income number, generous whitespace, a clean geometric sans for numbers and a softer sans for labels`,
        required: true,
      },
      {
        name: 'device_frame',
        description: `What device mockup the screens should be shown inside.`,
        example: `a modern iPhone frame, portrait orientation, shown as a realistic device mockup rather than a flat rectangle`,
        required: true,
      },
      {
        name: 'additional_screens',
        description: `The next screens to generate once the first is approved.`,
        example: `the bill-list screen and the add-income screen`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT Image)`],
    tags: [`app-ui-concept`, `ui-mockup`, `design-system`, `gpt-image`, `product-design`],
    whyItWorks: `Within one ChatGPT conversation, a follow-up image request can condition on the actual pixels of the previously generated screen rather than only on language describing it, which is the mechanical reason anchoring Phase 2's screens to "the same design system as the screen above" holds a specific accent hex and a specific corner radius steady in a way that re-typing "teal, rounded corners" into an independent new prompt cannot — a fresh generation has no rendered reference to match against and can only approximate the same words again, which is exactly where a second screen's teal drifts a few degrees off the first screen's teal without anyone asking for that. Explicitly naming the design-system tokens up front matters because GPT Image, like any general image model, defaults to whatever generic mobile-app visual style is statistically common in its training data unless told otherwise, and that default look is not guaranteed to repeat identically across two separate generations even for the same stated app concept. The instruction against combining several screens into one image targets a documented compositional limit: a single frame asked to fit multiple distinct UI screens divides its available detail and legible-text budget across all of them, so each individual screen's labels and controls render smaller and less crisply than the same screen would generated on its own — sequencing one screen per generation keeps every screen's UI text at a size the model can actually render cleanly.`,
    exampleOutput: `A high-fidelity iPhone-framed dashboard screen with rounded teal-accented cards and legible labels, followed by a bill-list screen and an add-income screen generated afterward in the same thread, each one carrying the identical corner radius, teal accent, and type pairing established in the first screen.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image (2026 release)', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT Image (2026 release).`,
      },
    ],
  },
  {
    slug: 'dalle-album-cover-genre-mood-with-rendered-typography',
    category: 'dalle',
    title: `Get an album cover with the artist name and title actually spelled correctly on it`,
    description: `A genre-and-mood album cover brief built around GPT Image's on-image text rendering, with an explicit letter-for-letter check on the artist name and title, plus a targeted-correction path for when a word comes back garbled instead of a full regenerate.`,
    promptText: `ARTIST AND ALBUM TITLE TO RENDER
Render this text directly on the cover, spelled and capitalized exactly as written — artist name "{{artist_name}}" and album title "{{album_title}}". Treat these as fixed strings to reproduce letter-for-letter, not a rough approximation; re-check the rendered text against these two strings before treating the image as done.

GENRE AND MOOD
{{genre_and_mood}}

CENTRAL IMAGE
{{central_image_description}}

TYPOGRAPHY STYLE
{{typography_style}}. Keep the artist name and title as the only text on the cover — no track listing, no label logo, no parental-advisory sticker, unless one of those was specifically asked for above.

FORMAT
Square, 1:1, {{format_notes}}.

TEXT PLACEMENT DISCIPLINE
Reserve genuinely clear space for both text elements before any texture, smoke, particles, or background detail gets added there — the artist name and title need to sit on the calmest part of the composition, not the busiest, or the letters will fight the artwork behind them for legibility.

IF THE TEXT COMES BACK MISSPELLED OR GARBLED
This is a text-rendering slip, not a composition problem — treat it as a text-only correction, not a full regenerate: ask specifically to fix just the misrendered word or letters while keeping everything else in the image exactly as it is, the way you'd ask for one word fixed in a document rather than rewriting the whole page.

OUTPUT
One square album cover with both the artist name and album title rendered correctly and legibly, matching the genre and mood described above.`,
    variables: [
      {
        name: 'artist_name',
        description: `The exact artist name to render on the cover.`,
        example: `Marlowe Grey`,
        required: true,
      },
      {
        name: 'album_title',
        description: `The exact album title to render on the cover.`,
        example: `Static Bloom`,
        required: true,
      },
      {
        name: 'genre_and_mood',
        description: `The musical genre and emotional register the artwork should evoke.`,
        example: `dream-pop / shoegaze, hazy and nostalgic, slightly overexposed like a sun-faded photograph`,
        required: true,
      },
      {
        name: 'central_image_description',
        description: `The main visual scene or subject of the cover art.`,
        example: `a lone figure standing in a field of oversized, slightly wilted paper flowers at dusk, back to camera`,
        required: true,
      },
      {
        name: 'typography_style',
        description: `The lettering style for the artist name and title.`,
        example: `a thin, slightly irregular serif for the title, small tracked-out caps for the artist name beneath it`,
        required: false,
      },
      {
        name: 'format_notes',
        description: `Any extra constraint on the cover format.`,
        example: `no visible spine or back panel, front cover artwork only`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT Image)`],
    tags: [`album-cover`, `on-image-text`, `typography`, `gpt-image`, `cover-art`],
    whyItWorks: `GPT Image's most consequential change over earlier DALL·E generations is native, token-level text generation trained jointly with the image itself rather than a diffusion model with no real supervision on legible glyphs, which is why a short, exact artist-and-title string now renders correctly far more often — but "far more often" is not "always," especially on less common names or longer titles, so the brief asks for an explicit letter-for-letter self-check rather than assuming success. Reserving clear space for the text before any texture or particle effects is added addresses the same interaction problem seen in busy hero-image and product-shot briefs: a model rendering text into an already-detailed region has to fight the existing composition for visual priority, and the artwork usually wins that fight, leaving legible-but-cramped or partially obscured lettering. The targeted-correction instruction for a garbled word matters mechanically because a conversational edit in ChatGPT can condition on the specific image already in the thread and change only the flagged region, which preserves an otherwise-successful composition, lighting, and mood exactly as approved — asking for a full regenerate instead re-samples the entire scene from the text description again, which risks losing a composition that was already right in every way except one misrendered word.`,
    exampleOutput: `A hazy dusk-lit square cover showing a lone figure in a field of oversized paper flowers, with "Static Bloom" set in a thin irregular serif across the calm upper-sky portion of the frame and "Marlowe Grey" in small tracked caps beneath it, both legible and correctly spelled.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image (2026 release)', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT Image (2026 release).`,
      },
    ],
  },
  {
    slug: 'dalle-book-cover-genre-trade-dress-wraparound-extension',
    category: 'dalle',
    title: `Design a genre-accurate front cover, then extend it into a full wraparound with spine and back panel`,
    description: `A front-cover art brief that bakes in genre-specific shelf conventions from the start, followed by a conversational second pass that extends the same approved artwork sideways into spine text and a back-panel copy area instead of generating the whole wrap cold in one shot.`,
    promptText: `BOOK GENRE AND COMP TITLES
{{genre_and_comps}}

TITLE AND AUTHOR NAME TO RENDER
Render "{{book_title}}" as the title and "{{author_name}}" as the author name, spelled exactly as given. {{title_hierarchy}}

COVER IMAGE
{{cover_image_description}}

GENRE TRADE-DRESS CONVENTIONS TO FOLLOW
{{trade_dress_conventions}}. A reader browsing this genre makes a split-second shelf judgment based on whether a cover matches these visual conventions before they ever read a summary — drifting far from them, even with a technically striking image, reads as off-genre rather than distinctive.

FORMAT — FRONT COVER ONLY, FIRST PASS
2:3 portrait, front panel only, no spine or back cover yet.

WHAT NOT TO DO
Do not add a review blurb, a series-numbering badge, or an award sticker unless specifically requested above — these are things a publisher adds late in production, and generating fake versions of them now just means having to remove invented text later.

SECOND PASS — EXTEND TO A FULL WRAPAROUND (after the front cover above is approved, same conversation)
Once the front panel is approved, ask to extend that same approved image sideways into a full wraparound: a spine of {{spine_width_note}} carrying the title and author in a vertical or stacked treatment that stays legible at true spine width, and a back panel with {{back_panel_content}}. Anchor this request to the already-approved front artwork explicitly — the art on the spine and back needs to be a continuation of the same scene's color, light, and texture, not a fresh piece of art that happens to share a palette; asking as a follow-up edit of the existing image keeps that continuity, where a fresh generation from a text description of "the same cover, but wider" tends to reinterpret the scene rather than literally extend it.

OUTPUT
Pass one: a front-cover-only image, genre-accurate, with title and author rendered legibly. Pass two, once approved: the same artwork extended into a full wraparound with a legible spine and a back panel reserved for cover copy.`,
    variables: [
      {
        name: 'genre_and_comps',
        description: `The book's genre and, if useful, a comparable tone or vibe.`,
        example: `adult literary thriller, comparable in tone to a slow-burn psychological suspense novel`,
        required: true,
      },
      {
        name: 'book_title',
        description: `The exact title text to render on the cover.`,
        example: `The Quiet Room`,
        required: true,
      },
      {
        name: 'author_name',
        description: `The exact author name text to render on the cover.`,
        example: `Elena Voss`,
        required: true,
      },
      {
        name: 'title_hierarchy',
        description: `Relative sizing or placement priority between title and author name.`,
        example: `Title should dominate the top two-thirds of the cover; author name smaller, bottom third.`,
        required: false,
      },
      {
        name: 'cover_image_description',
        description: `The core visual scene for the front cover art.`,
        example: `a single lit window in an otherwise dark house at night, seen from across an overgrown garden`,
        required: true,
      },
      {
        name: 'trade_dress_conventions',
        description: `The genre's visual shelf conventions to follow.`,
        example: `moody desaturated palette, a single small human-scale detail rather than a full figure, generous negative sky space above for the title to sit in`,
        required: true,
      },
      {
        name: 'spine_width_note',
        description: `The approximate spine width to design for.`,
        example: `roughly a 1-inch trade paperback spine`,
        required: false,
      },
      {
        name: 'back_panel_content',
        description: `What the back panel should reserve space for.`,
        example: `a plain darker panel with clear empty space for back-cover copy and a barcode block in the lower right corner, no actual blurb text yet`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT Image)`],
    tags: [`book-cover`, `trade-dress`, `gpt-image`, `cover-art`, `publishing-design`],
    whyItWorks: `GPT Image has no built-in knowledge of book-industry shelf conventions as a distinct constraint from general aesthetic quality — trained on broad web image data, it defaults toward a generically striking illustration rather than the specific desaturated-palette, negative-space-above-the-title look that signals a particular genre to a browsing reader, so those conventions have to be stated as explicit rules rather than assumed to follow from naming the genre alone. Splitting the wraparound into two passes exploits the same conversational-editing mechanic used for the ad-format variants above: extending an already-approved front-cover image sideways conditions the spine and back panel on the actual pixels, lighting, and color grade of the artwork just signed off, while asking for a full wraparound cold in one description forces the model to imagine the spine and back scene independently, which routinely produces a spine or back panel that shares a rough palette with the front but doesn't actually look like the same lit scene continuing around the book. The explicit ban on review blurbs, series badges, and award stickers matters because GPT Image, trained on a large corpus of real published book covers where these elements are extremely common, tends to add a plausible-looking one uninvited — harmless on a cover meant only for internal review, but exactly the kind of invented detail that has to be manually removed before the image can be used anywhere real.`,
    exampleOutput: `A moody 2:3 front cover showing a single lit window across an overgrown dark garden, with "The Quiet Room" set large across the top two-thirds and "Elena Voss" in smaller type near the bottom, followed by a second-pass wraparound extending the same scene onto a legible one-inch spine and a plain back panel with space reserved for copy and a barcode.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image (2026 release)', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT Image (2026 release).`,
      },
    ],
  },
]
