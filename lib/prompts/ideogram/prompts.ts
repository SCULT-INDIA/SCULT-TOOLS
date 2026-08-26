import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'ideogram-v3-poster-with-legible-text',
    category: 'ideogram',
    title: 'Put legible headline text on a poster with Ideogram V3',
    description:
      "A layout-and-typography brief that leans on Ideogram's core differentiator — reliably rendering the exact text you specify instead of garbled placeholder glyphs — for a real promotional poster.",
    promptText:
      'A {{poster_style}} poster design, large bold headline text that reads "{{headline_text}}", smaller subtext below that reads "{{subtext}}", {{visual_motif}}, color palette of {{color_palette}}, {{layout_note}}',
    variables: [
      {
        name: 'poster_style',
        description: 'The overall design genre/era of the poster.',
        example: 'retro mid-century travel',
        required: true,
      },
      {
        name: 'headline_text',
        description: 'The exact large headline text — keep it short (a few words).',
        example: 'SUMMER SALE',
        required: true,
      },
      {
        name: 'subtext',
        description: 'The exact smaller supporting line.',
        example: 'Up to 40% off, this weekend only',
        required: true,
      },
      {
        name: 'visual_motif',
        description: 'A graphic element that fills out the composition.',
        example: 'a stylized sun rising over minimalist wave shapes',
        required: true,
      },
      {
        name: 'color_palette',
        description: 'The dominant colors.',
        example: 'burnt orange, cream, and teal',
        required: true,
      },
      {
        name: 'layout_note',
        description: 'Where each element sits in the frame.',
        example:
          'headline centered in the top two-thirds, subtext in a clean sans-serif band along the bottom',
        required: false,
      },
    ],
    targetTools: ['Ideogram V3'],
    tags: ['ideogram', 'text-in-image', 'poster-design', 'typography'],
    whyItWorks:
      "Ideogram's headline strength relative to Midjourney, Flux, and Nano Banana is specifically legible in-image text — most diffusion image models historically mangle typography (extra or missing letters, warped glyphs, words that are almost-but-not-quite right), and Ideogram was trained with that specific failure mode as a target to fix. Putting the exact copy in quotation marks is the documented convention for telling Ideogram what should render verbatim, as distinct from everything else in the prompt, which it treats as scene and style description rather than text to draw. Keep the quoted copy short — a headline plus one short subtext line, not a paragraph — because even Ideogram's improved text engine degrades on longer strings.",
    exampleOutput:
      "A poster where the specified headline and subtext render as legible, largely-correct text sitting inside a stylized illustrated background — spot-check the spelling before shipping, since verbatim accuracy is Ideogram's strength but isn't a 100% guarantee on every generation.",
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-07-30' }],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Ideogram V3 for in-image text accuracy.',
      },
    ],
  },
  {
    slug: 'ideogram-v3-logo-icon-concept',
    category: 'ideogram',
    title: 'Sketch a logo and wordmark concept with Ideogram V3',
    description:
      'A descriptor-stacked logo-concepting brief for Ideogram V3, pairing its text-rendering strength (a legible wordmark) with a simple flat icon mark — early-stage creative direction, not a production-ready vector file.',
    promptText:
      'Minimalist flat vector logo design for a brand called "{{brand_name}}", {{icon_concept}}, paired with clean sans-serif wordmark text that reads "{{brand_name}}" beside the icon, {{color_palette}}, {{style_descriptor}}, on a plain white background, no gradients, no drop shadows',
    variables: [
      {
        name: 'brand_name',
        description: 'The exact brand name to render as the wordmark.',
        example: 'Northfold',
        required: true,
      },
      {
        name: 'icon_concept',
        description: 'What the icon mark depicts, described concretely.',
        example:
          'a simple geometric mark of a folded paper map corner forming an abstract mountain peak',
        required: true,
      },
      {
        name: 'color_palette',
        description: 'The palette the mark and wordmark should use.',
        example: 'deep forest green and warm sand',
        required: true,
      },
      {
        name: 'style_descriptor',
        description: 'The visual style/weight of the linework.',
        example: 'modern, geometric, single-weight line work',
        required: false,
      },
    ],
    targetTools: ['Ideogram V3'],
    tags: ['ideogram', 'logo-design', 'icon-concept', 'branding', 'wordmark'],
    whyItWorks:
      "This uses classic descriptor-stacking — icon concept, then the explicit wordmark instruction, then color, then style, then background/negative-space constraints as a flat itemized list — because a logo brief benefits from unambiguous, itemized specification more than the flowing natural-language phrasing that works for a Midjourney V7 portrait. Ideogram is the right tool for the wordmark specifically because it's the model family that most reliably keeps a short brand name legible instead of turning it into abstract squiggles, which is where most other image models fall apart on logo work. Treat the output as concept direction and moodboard input, not a deliverable: no current text-to-image model outputs a clean, infinitely-scalable vector file, so a designer still needs to rebuild the winning direction in real vector software before it goes anywhere near production.",
    exampleOutput:
      'A flat, poster-like logo concept combining an icon mark and a mostly-legible wordmark on a plain background — useful for picking a creative direction with a client, not as a final logo asset.',
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Ideogram V3 for wordmark legibility in logo concepts.',
      },
    ],
    relatedToolSlug: 'business-name-generator',
  },
  {
    slug: 'ideogram-social-carousel-cover-with-hook-text',
    category: 'ideogram',
    title: `Design a scroll-stopping social carousel cover with a legible hook line in Ideogram V3`,
    description: `A single-frame brief for the cover slide of an Instagram or LinkedIn carousel, built so the hook text actually renders correctly instead of turning into decorative gibberish.`,
    promptText: `Bold {{platform_format}} social media graphic, flat {{background_treatment}} background, large punchy headline text centered that reads "{{hook_line}}", small tag or category label in a rounded pill shape that reads "{{label_text}}", {{supporting_graphic}}, {{color_palette}} color scheme, generous negative space around the text so it stays readable when scaled down to a feed thumbnail, no watermarks, no extra text beyond what is quoted above`,
    variables: [
      {
        name: 'platform_format',
        description: `The aspect ratio/platform this is built for.`,
        example: `1080x1350 Instagram portrait`,
        required: true,
      },
      {
        name: 'background_treatment',
        description: `The style of the flat background behind the text.`,
        example: `gradient mesh in muted coral fading to cream`,
        required: true,
      },
      {
        name: 'hook_line',
        description: `The exact large headline text — the scroll-stopping hook, kept to 4-7 words.`,
        example: `STOP DOING THIS ON LINKEDIN`,
        required: true,
      },
      {
        name: 'label_text',
        description: `The exact short label or category tag in the pill shape.`,
        example: `CAROUSEL 1/8`,
        required: true,
      },
      {
        name: 'supporting_graphic',
        description: `A simple graphic element that reinforces the message without competing with the text.`,
        example: `a single bold arrow pointing down toward where slide 2 would continue`,
        required: false,
      },
      {
        name: 'color_palette',
        description: `The dominant colors for the frame.`,
        example: `coral, cream, and charcoal`,
        required: true,
      },
    ],
    targetTools: [`Ideogram V3`],
    tags: [`ideogram`, `social-media`, `carousel-cover`, `text-in-image`, `hook-copy`],
    whyItWorks: `A carousel cover lives or dies on one thing: whether the hook text is instantly readable at feed-thumbnail size, which is exactly the constraint most diffusion models fail at, since they treat short caption text as a texture to approximate rather than a string to reproduce. Ideogram's text-rendering training specifically targets short, high-contrast strings like headlines and pill-shaped labels, which is why this prompt keeps both quoted strings short and explicitly separates them by role — headline versus tag — rather than letting the model guess which text is more important. The instruction to leave generous negative space around the text is doing real work here too: Ideogram (like other text-capable models) still occasionally crops or overlaps glyphs when text sits too close to the frame edge or another element, and giving the composition room reduces that failure mode noticeably. Naming the exact platform aspect ratio matters because carousel covers get judged when scaled down to a two-inch-wide thumbnail in-feed, so a design that only reads well at full size is a design that fails in practice — this prompt asks for legibility at that shrunk scale directly instead of assuming it as a byproduct.`,
    exampleOutput: `A clean portrait-format cover slide with the hook line rendered in bold, mostly-correct type across the upper two-thirds and a small rounded pill tag beneath it — check the pill text closely, since short tags in unusual fonts are still the more error-prone of the two strings.`,
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against Ideogram V3 for carousel-cover text legibility at thumbnail scale.`,
      },
    ],
  },
  {
    slug: 'ideogram-youtube-thumbnail-with-reaction-text',
    category: 'ideogram',
    title: `Build a high-contrast YouTube thumbnail with punchy reaction text in Ideogram V3`,
    description: `A thumbnail-specific brief tuned for the extreme contrast and tiny-text legibility that YouTube's mobile feed demands, using Ideogram's in-image text strength for the 2-4 word hook.`,
    promptText: `A YouTube thumbnail, 16:9, high-energy composition with a clear focal subject: {{subject_description}}, huge bold outlined text in the {{text_position}} that reads "{{thumbnail_text}}", text has a thick white or black outline stroke for contrast against the background, {{background_scene}}, {{color_palette}} palette pushed to maximum saturation, expression or framing that signals {{emotional_tone}}, no tiny fine print, no more than 4 words of text total in the entire image`,
    variables: [
      {
        name: 'subject_description',
        description: `The main visual subject or focal point of the thumbnail.`,
        example: `a person holding a phone with a shocked expression, shot close-up from the chest up`,
        required: true,
      },
      {
        name: 'text_position',
        description: `Where the bold hook text sits in the frame.`,
        example: `top-left corner`,
        required: true,
      },
      {
        name: 'thumbnail_text',
        description: `The exact hook text, capped at 2-4 words for legibility at thumbnail size.`,
        example: `I WAS WRONG`,
        required: true,
      },
      {
        name: 'background_scene',
        description: `What fills the rest of the frame behind the subject.`,
        example: `a blurred home office with a laptop screen glowing in the background`,
        required: true,
      },
      {
        name: 'color_palette',
        description: `The dominant colors, chosen for contrast against typical YouTube UI (white background, red accents).`,
        example: `electric yellow and deep navy`,
        required: true,
      },
      {
        name: 'emotional_tone',
        description: `The emotion the framing/expression should communicate.`,
        example: `genuine surprise bordering on disbelief`,
        required: true,
      },
    ],
    targetTools: [`Ideogram V3`],
    tags: [`ideogram`, `youtube-thumbnail`, `text-in-image`, `high-contrast`, `ctr`],
    whyItWorks: `Thumbnail text has the harshest legibility bar of any format on this list because it gets viewed at roughly 120x68 pixels on a phone screen, so this prompt caps the quoted string at 2-4 words and explicitly asks for a thick outline stroke — the classic broadcast-graphics trick for keeping text readable against a busy, saturated background, which Ideogram can actually render as an instruction rather than something you'd have to add in Photoshop afterward. The hard word-count ceiling in the closing constraint is deliberate: Ideogram's text accuracy is strong for short strings but degrades as string length grows, and a thumbnail with more than four words is already a losing design regardless of render quality, since nobody reads a thumbnail — they scan it in under a second. Pushing saturation to maximum and specifying the emotional framing of the subject both address the same underlying job (stopping a thumb mid-scroll), and naming them as separate directives keeps the model from defaulting to a flat, editorial-photo look, which is the most common way AI-generated thumbnails read as generic rather than clickable.`,
    exampleOutput: `A tightly cropped, high-saturation thumbnail with the subject's expression dominating the frame and a short outlined hook phrase in the specified corner, legible even when the preview is shrunk to mobile size.`,
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against Ideogram V3 for thumbnail-scale text contrast and word-count limits.`,
      },
    ],
  },
  {
    slug: 'ideogram-linkedin-banner-personal-brand',
    category: 'ideogram',
    title: `Generate a LinkedIn profile banner that states your positioning in words, not just imagery`,
    description: `A wide-format personal-branding banner brief for the 1584x396 LinkedIn cover slot, anchored on a short positioning line rendered as real text rather than a vague abstract background.`,
    promptText: `Design goal: a LinkedIn profile banner for someone who wants their positioning line visible at a glance, not just decorative background art.

Format: 1584x396 wide banner, safe zone for the profile photo circle left blank in the bottom-left corner.

Text to render exactly: main line reads "{{positioning_line}}", smaller line below it reads "{{supporting_line}}", both left-aligned in the right two-thirds of the frame so they clear the profile photo circle.

Visual style: {{visual_style}}, background pattern or texture: {{background_pattern}}, palette: {{color_palette}}.

What to avoid: no photorealistic faces, no stock-photo-style people, no text crammed into the bottom-left corner where the profile photo will overlap it, no more than two lines of quoted text total.`,
    variables: [
      {
        name: 'positioning_line',
        description: `The exact main positioning statement to render, kept short enough to read at banner scale.`,
        example: `Helping B2B SaaS teams cut churn by 30%`,
        required: true,
      },
      {
        name: 'supporting_line',
        description: `The exact smaller supporting line beneath the main statement.`,
        example: `Fractional Head of Customer Success`,
        required: true,
      },
      {
        name: 'visual_style',
        description: `The overall design language of the banner.`,
        example: `clean corporate-modern with subtle geometric linework`,
        required: true,
      },
      {
        name: 'background_pattern',
        description: `A non-distracting pattern or texture filling empty space.`,
        example: `thin diagonal grid lines fading toward the edges`,
        required: true,
      },
      {
        name: 'color_palette',
        description: `The banner's dominant colors, ideally matching the person's existing brand colors.`,
        example: `navy, white, and a single accent of teal`,
        required: true,
      },
    ],
    targetTools: [`Ideogram V3`],
    tags: [
      `ideogram`,
      `linkedin-banner`,
      `personal-branding`,
      `text-in-image`,
      `profile-cover`,
    ],
    whyItWorks: `Most LinkedIn banner generations from other image models default to abstract gradient wallpaper because that's the safest thing a model can produce when it doesn't have a reliable way to draw the words that actually carry the message — which means the banner ends up saying nothing. This prompt is built around that gap: it treats the positioning line as the actual point of the image and gives Ideogram exactly the short strings it renders most reliably, split into a main line and a supporting line so the hierarchy is unambiguous rather than one run-on sentence. The explicit safe-zone instruction (profile-photo circle left blank, text confined to the right two-thirds) exists because LinkedIn's fixed circular photo mask sits in a known location on every profile, and a model with no knowledge of that UI overlay will happily center your one good line directly behind where the photo goes — naming the dead zone up front avoids a banner that has to be manually recropped after generation. Capping it at two quoted lines keeps both strings inside Ideogram's comfortable accuracy range for verbatim text.`,
    exampleOutput: `A wide corporate-style banner with the positioning statement rendered clearly across the right two-thirds, a shorter title line beneath it, and the bottom-left corner left visually quiet where the profile photo will sit.`,
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Ideogram V3 for banner-safe-zone text placement.`,
      },
    ],
  },
  {
    slug: 'ideogram-startup-logo-wordmark-concept-sprint',
    category: 'ideogram',
    title: `Run a rapid logo wordmark concepting sprint for a new brand name in Ideogram V3`,
    description: `A structured, multi-variant logo-concepting brief for founders picking a first-pass visual direction before hiring a designer, using Ideogram's wordmark legibility to keep the actual brand name readable across variants.`,
    promptText: `Step 1 — brand basics: the brand is called "{{brand_name}}", operating in the {{industry_context}} space, and should feel {{brand_personality}}.

Step 2 — what to generate: a flat, minimalist logo concept combining a small abstract icon mark with a clean wordmark that reads exactly "{{brand_name}}" beside or beneath the icon. The icon should visually reference {{icon_reference}} without being a literal illustration of it.

Step 3 — constraints: single-weight line work, no gradients, no drop shadows, no photorealistic elements, plain white or transparent-style background, palette limited to {{color_palette}}.

Step 4 — what this is for: early creative-direction moodboarding to react to and narrow down, not a final vector deliverable.

Render the wordmark text with clean, highly legible letterforms — prioritize the brand name being spelled correctly over decorative flourish.`,
    variables: [
      {
        name: 'brand_name',
        description: `The exact brand name to render as the wordmark.`,
        example: `Verdant Ledger`,
        required: true,
      },
      {
        name: 'industry_context',
        description: `The industry or category the brand operates in.`,
        example: `sustainable accounting software`,
        required: true,
      },
      {
        name: 'brand_personality',
        description: `Two or three adjectives describing the intended brand feel.`,
        example: `trustworthy, calm, and quietly premium`,
        required: true,
      },
      {
        name: 'icon_reference',
        description: `A concrete real-world thing the abstract icon should nod to.`,
        example: `a leaf and a ledger line merging into one shape`,
        required: true,
      },
      {
        name: 'color_palette',
        description: `The colors the mark and wordmark are limited to.`,
        example: `forest green and warm ivory`,
        required: true,
      },
    ],
    targetTools: [`Ideogram V3`],
    tags: [`ideogram`, `logo-design`, `wordmark`, `branding`, `startup-naming`],
    whyItWorks: `Structuring this as sequential steps rather than one dense sentence matters specifically for logo work because the brief has to communicate two different kinds of information the model handles differently: brand context (personality, industry) that shapes style choices, and an exact string (the brand name) that must render as legible text — collapsing those into one run-on prompt tends to make Ideogram treat the brand name as just another descriptive phrase instead of the literal wordmark to draw. The closing instruction to prioritize correct spelling over decorative flourish exists because Ideogram, like every current text-to-image model, trades off some legibility for stylization when a prompt leans hard into an ornate aesthetic, and for a brand-name wordmark, a slightly plainer but correctly-spelled result beats a beautiful but misspelled one every time. Framing the whole output explicitly as moodboard input rather than a deliverable is a deliberate expectation-setting move: even a strong Ideogram wordmark generation is a raster image at model resolution, not a scalable vector, so a founder using this to pick a direction still needs a designer to redraw the winning concept in real vector software before it touches a business card or a website header.`,
    exampleOutput: `Three or four flat, similarly-styled logo concepts, each pairing the same abstract icon idea with a mostly-correct rendering of the brand name — pick the direction with the cleanest wordmark rendering as the one to hand a designer, not necessarily the most elaborate one.`,
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against Ideogram V3 for step-structured wordmark concepting prompts.`,
      },
    ],
  },
  {
    slug: 'ideogram-infographic-panel-with-data-labels',
    category: 'ideogram',
    title: `Lay out a single-panel infographic with real data labels in Ideogram V3`,
    description: `A brief for a self-contained infographic panel (stat callouts, short labels, a simple chart shape) built around the reality that this is a design mockup for a human to redraw in real charting software, not a source of accurate data.`,
    promptText: `A single-panel flat infographic design, {{orientation}}, on a {{background_color}} background. Title text at the top reads exactly "{{infographic_title}}". Below it, {{number_of_stats}} stat callout boxes arranged {{layout_arrangement}}, each showing a large number and a short label — use these exact stat/label pairs: {{stat_label_pairs}}. Icons next to each stat should be simple flat line icons relevant to that stat's topic, not literal photos. Style: {{visual_style}}, palette: {{color_palette}}, consistent spacing and alignment between all callout boxes so it reads as one coherent panel, not a collage.

Important: treat every number in this brief as placeholder/example data supplied by the requester — do not invent additional statistics beyond what's listed above, and do not present anything as verified fact.`,
    variables: [
      {
        name: 'orientation',
        description: `Panel orientation/aspect ratio.`,
        example: `vertical, suited to a blog post or Pinterest pin`,
        required: true,
      },
      {
        name: 'infographic_title',
        description: `The exact title text at the top of the panel.`,
        example: `WHY REMOTE TEAMS CHURN LESS`,
        required: true,
      },
      {
        name: 'number_of_stats',
        description: `How many stat callout boxes to include.`,
        example: `3`,
        required: true,
      },
      {
        name: 'layout_arrangement',
        description: `How the stat boxes are arranged in the frame.`,
        example: `stacked vertically with equal spacing`,
        required: true,
      },
      {
        name: 'stat_label_pairs',
        description: `The exact number-and-label pairs to render — placeholder data supplied by the requester, not researched by the model.`,
        example: `"42%" / "lower turnover in async-first teams", "3.5 hrs" / "saved per week per employee", "9/10" / "managers who'd rebuild remote-first"`,
        required: true,
      },
      {
        name: 'visual_style',
        description: `The overall design language of the panel.`,
        example: `flat corporate modern with rounded card shapes`,
        required: true,
      },
      {
        name: 'color_palette',
        description: `The dominant colors across the panel.`,
        example: `slate blue, white, and a single warm accent`,
        required: true,
      },
    ],
    targetTools: [`Ideogram V3`],
    tags: [
      `ideogram`,
      `infographic`,
      `text-in-image`,
      `data-visualization`,
      `layout-design`,
    ],
    whyItWorks: `An infographic prompt fails in a specific way if you don't constrain it: asked generically for 'stats about remote work,' an image model will confidently render plausible-looking but fabricated numbers as crisp, authoritative-looking text, which is worse than no infographic at all since the fabrication is dressed up as data. This prompt closes that gap two ways — it requires the exact stat/label pairs to be supplied as an input variable rather than generated, and it adds an explicit closing instruction telling the model not to invent additional statistics, which matters because Ideogram will otherwise fill visual gaps in a mostly-empty layout with invented supporting numbers to make the composition feel complete. Structuring the layout instruction around box count, arrangement, and consistent spacing exists because infographic panels read as broken the moment alignment is inconsistent between callouts, and calling that out explicitly counters diffusion models' general weakness at maintaining strict grid discipline across a multi-element composition. As with the logo brief, the honest framing here is that this produces a polished mockup of the layout and copy — a designer still typically rebuilds the final version in a tool with real data-binding (Figma, Canva, a BI tool's export) so the numbers stay accurate and editable.`,
    exampleOutput: `A vertically stacked infographic panel with the title rendered at the top and each stat/label pair rendered as its own aligned card with a simple icon — a solid pitch-deck-ready mockup to review, not a chart with live data behind it.`,
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against Ideogram V3 for placeholder-data infographic layouts.`,
      },
    ],
  },
  {
    slug: 'ideogram-vintage-travel-poster-destination-name',
    category: 'ideogram',
    title: `Create a vintage-style travel poster with the destination name rendered as real typography`,
    description: `A retro travel-poster brief that leans on Ideogram's text accuracy to render the destination name and tagline as clean period-appropriate lettering rather than the smeared pseudo-text older models produce.`,
    promptText: `A vintage {{poster_era}} travel poster illustration for {{destination_name}}, {{landmark_or_scene}} rendered in flat stylized illustration with visible {{illustration_technique}}, large stylized display text at the {{text_placement}} that reads "{{destination_name}}" in period-appropriate lettering, small tagline text beneath it that reads "{{tagline}}", {{color_palette}} palette with slightly aged/muted tones, subtle paper grain texture across the whole composition, border frame typical of the era's travel posters`,
    variables: [
      {
        name: 'poster_era',
        description: `The decade/design era the poster should evoke.`,
        example: `1950s golden-age`,
        required: true,
      },
      {
        name: 'destination_name',
        description: `The exact destination name to render as the display headline.`,
        example: `LISBON`,
        required: true,
      },
      {
        name: 'landmark_or_scene',
        description: `The specific landmark or scene illustrated in the poster.`,
        example: `trams climbing a hillside street lined with tiled buildings`,
        required: true,
      },
      {
        name: 'illustration_technique',
        description: `The rendering texture/technique of the illustration.`,
        example: `flat gouache-style brushwork and visible halftone shading`,
        required: true,
      },
      {
        name: 'text_placement',
        description: `Where the destination name sits in the composition.`,
        example: `bottom third, centered`,
        required: true,
      },
      {
        name: 'tagline',
        description: `The exact short tagline beneath the destination name.`,
        example: `City of Seven Hills`,
        required: false,
      },
      {
        name: 'color_palette',
        description: `The dominant palette, matching the chosen era's printing style.`,
        example: `terracotta, ochre, and faded turquoise`,
        required: true,
      },
    ],
    targetTools: [`Ideogram V3`],
    tags: [
      `ideogram`,
      `travel-poster`,
      `vintage-illustration`,
      `text-in-image`,
      `typography`,
    ],
    whyItWorks: `Vintage travel posters are a genre defined as much by their lettering as their illustration — the destination name in bold period display type is the whole point of the format — which makes them a poor fit for image models that can't reliably spell a place name, since a garbled 'LISBQN' breaks the illusion immediately even if the illustration around it is beautiful. This prompt puts the destination name in quotes twice in effect (once as the illustrated subject, once as the literal text string), which reinforces to Ideogram that this exact word needs to appear both as scene content and as rendered typography, reducing the chance it treats the name as purely descriptive context. Calling out the specific era and illustration technique (gouache, halftone, woodblock, whatever fits) does real work beyond aesthetics: it steers the model toward flatter, more graphic-design-like rendering rather than photorealism, and flatter compositions are exactly where Ideogram's text engine performs most reliably, since photorealistic scenes with embedded signage text are a noticeably harder case for any current model. The paper grain and border frame instructions are finishing touches that sell the vintage read without affecting text accuracy, so they're placed after the text-critical instructions rather than competing with them for the model's attention.`,
    exampleOutput: `A warm, muted-palette illustrated poster with a stylized cityscape and the destination name rendered in bold vintage display lettering across the bottom third, aged paper texture completing the period look.`,
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against Ideogram V3 for destination-name lettering accuracy in illustrated posters.`,
      },
    ],
  },
  {
    slug: 'ideogram-event-poster-full-details-block',
    category: 'ideogram',
    title: `Produce an event poster that gets the date, time, and venue text right in Ideogram V3`,
    description: `An event-flyer brief built around the hardest part of AI-generated event posters: rendering a multi-line details block (date, time, venue) accurately instead of as decorative near-text.`,
    promptText: `An event poster, {{poster_theme}} visual style, {{orientation}} orientation.

Main headline text, large and bold, reads "{{event_name}}".

Details block in smaller clean text, positioned {{details_position}}, reads exactly, as three separate lines:
Line 1: "{{event_date}}"
Line 2: "{{event_time}}"
Line 3: "{{venue_name}}"

Background: {{background_visual}}, palette: {{color_palette}}.

Do not merge the three details lines into one sentence — keep them as three visually distinct lines. Do not add any additional text, dates, or venue information beyond what is specified above.`,
    variables: [
      {
        name: 'poster_theme',
        description: `The visual theme/genre of the poster.`,
        example: `bold minimalist typographic`,
        required: true,
      },
      {
        name: 'orientation',
        description: `Poster orientation.`,
        example: `vertical A3`,
        required: true,
      },
      {
        name: 'event_name',
        description: `The exact event name headline.`,
        example: `NIGHT MARKET COLLECTIVE`,
        required: true,
      },
      {
        name: 'details_position',
        description: `Where the date/time/venue block sits in the layout.`,
        example: `bottom third, left-aligned`,
        required: true,
      },
      {
        name: 'event_date',
        description: `The exact date line to render verbatim.`,
        example: `Saturday, September 19`,
        required: true,
      },
      {
        name: 'event_time',
        description: `The exact time line to render verbatim.`,
        example: `6 PM – 11 PM`,
        required: true,
      },
      {
        name: 'venue_name',
        description: `The exact venue line to render verbatim.`,
        example: `Pier 4 Warehouse, Oakland`,
        required: true,
      },
      {
        name: 'background_visual',
        description: `The main graphic/illustrative element filling the background.`,
        example: `overlapping geometric shapes in a loose grid pattern`,
        required: true,
      },
      {
        name: 'color_palette',
        description: `The dominant colors.`,
        example: `black, off-white, and a single hot pink accent`,
        required: true,
      },
    ],
    targetTools: [`Ideogram V3`],
    tags: [`ideogram`, `event-poster`, `text-in-image`, `flyer-design`, `typography`],
    whyItWorks: `The single most common failure in AI-generated event posters isn't the headline — models handle a short bold event name reasonably well — it's the details block, where date, time, and venue tend to blur into one garbled line or get half-rendered as illegible fine print, because that block is functionally three separate short strings the model has to keep distinct rather than one phrase to stylize. This prompt addresses that directly by labeling each line explicitly (Line 1, Line 2, Line 3) inside the prompt itself rather than just concatenating them, which gives Ideogram a clearer structural cue to keep them as three separate visual lines instead of merging them into a single run-on sentence — a known weakness even in text-capable models when multiple short facts sit close together. The closing instruction not to add extra text matters because a mostly-empty bottom third is exactly where diffusion models like to add plausible-looking filler (a fake website URL, a made-up ticket price) to make the composition feel finished, and naming that boundary up front heads it off. Keeping the theme and background instructions separate from the text block, rather than interleaved with it, also reduces the chance that stylistic instructions bleed into how the model renders the factual details, which need to stay plain and legible even when the rest of the poster is stylistically loud.`,
    exampleOutput: `A bold typographic poster with the event name dominating the upper two-thirds and a clean three-line details block in the bottom third — verify the date and venue spelling before printing, since multi-word proper nouns are the most error-prone part of the render.`,
    verifiedAgainst: [{ tool: 'Ideogram', version: 'V3', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against Ideogram V3 for multi-line event-details-block text accuracy.`,
      },
    ],
  },
]
