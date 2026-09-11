import type { Prompt } from '../types'

/**
 * Photo Trends — the viral consumer image-trend category.
 *
 * Shaped nothing like the other image-ai categories. Those are briefs a
 * professional fills in. These are prompts a person copies on a phone, in one
 * tap, and pastes into ChatGPT or the Gemini app on top of a selfie. The whole
 * category is optimised for that single action, so:
 *
 *  - ZERO variables on every prompt. PromptCopyBlock renders no Customize
 *    panel when `variables` is empty, which is exactly the layout wanted here:
 *    example image, prompt, copy and share. Nothing between the visitor and
 *    the paste. Do not add variables to this category.
 *  - Each promptText is ONE flowing paragraph, roughly 150-200 words. No block
 *    headers, no capitals, no numbered structure. The seven ingredients are
 *    still all there and still in the same order — identity lock, hair,
 *    wardrobe, setting, light, film stock, exclusions, output — just written
 *    as prose instead of a form.
 *  - The identity lock is the FIRST sentence, always. That is what stops the
 *    face drifting; the model weights early instructions most heavily when it
 *    re-renders an uploaded image.
 *  - Exclusions are positive sentences, because neither ChatGPT nor the Gemini
 *    app has a negative-prompt field.
 *  - Aspect ratio is written in words. Never `--ar`. Midjourney flags are read
 *    as literal text by both models, and several competing prompt lists ship
 *    them by mistake.
 *  - `exampleImage` is required in practice for this category even though the
 *    type marks it optional — a prompt card with no picture does not convert
 *    here. See 06_IMAGE_MAPPING.md for the file list.
 *  - `whyItWorks` is deliberately short (60-90 words, one point). The long
 *    explanations live in the blog posts, not on top of the copy button.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'photo-trends-80s-angry-young-man-studio',
    category: 'photo-trends',
    title: '80s Bollywood studio portrait (men)',
    description:
      'The hard-flash studio portrait from mid-80s Hindi film publicity stills — corduroy blazer, mottled canvas, one hot light and a hard shadow.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same bone structure, jawline, nose, eyes, lips, skin tone and age, no slimming, no smoothing, no lightening — and keep my real hairline. Change only my hair, clothes, pose and surroundings. Turn me into a 1986 Hindi film studio portrait: thick side-parted hair with volume at the crown and a slight hairspray sheen, a deep rust-brown wide-lapel corduroy blazer over a plain open-collar shirt worn outside the lapel, padded shoulders, a metal watch on a leather strap. I am standing three-quarters to camera, shoulders turned away, head back to the lens, chin slightly down, serious and unsmiling. Behind me a hand-painted mottled grey-and-slate canvas backdrop. Light it with one hard key high to the left, close enough that the foreground runs slightly hot, throwing a hard-edged shadow onto the backdrop behind my right shoulder. Shot on 35mm film in 1986: fine grain, faded warm colour, soft halation on the cheekbone, blacks that lift slightly. Nothing modern in frame — no phone, no modern logos, no text, no border, no watermark. Vertical 9:16 portrait, mid-chest up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'bollywood',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'studio-portrait',
      'men',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-angry-young-man-studio.webp',
      alt: 'A man in a rust-brown corduroy blazer photographed as a 1986 Hindi film studio portrait against a mottled grey canvas backdrop',
      aspectRatio: '9:16',
      modelCredit: {
        name: 'Pranjul Rathour',
        instagram: 'https://www.instagram.com/pranjulrathour.in/',
        linkedin: 'https://www.linkedin.com/in/pranjul-rathour/',
      },
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged for the whole clip — no morphing, no drifting toward a different face, no beautifying partway through. Almost nothing moves: a slow, natural blink, the faintest shift of weight, and the hard-edged shadow on the canvas trembling very slightly as if the studio light is not perfectly steady. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add only the faint electrical hum of a studio light ballast — no dialogue, no music, no narration. Keep the same 1986 film grain, warm faded colour and hard key-light contrast from the still all the way through; do not sharpen the image or clean up the grain as the clip plays. Add no modern object, no on-screen text and no watermark. Output: vertical 9:16, matching the still's framing exactly, with a first and last frame close enough to loop without a visible jump.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'The hard shadow on the backdrop is what dates this, not the corduroy. A 1980s Indian portrait studio used one close, hard key with almost no fill — the opposite of the soft-box lighting these models default to. Naming the shadow as a thing in the frame makes the model build the lighting instead of adding a sepia filter. The hairline clause matters too: models quietly restore a fuller hairline on men, and that single change is what makes people say it does not look like them.',
    exampleOutput:
      'A serious, hard-lit three-quarter portrait with a visible shadow behind the shoulder and fine grain. If the light comes out soft, reply "harder key light, stronger shadow on the backdrop" in the same chat.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-ambassador-car-lean',
    category: 'photo-trends',
    title: '80s Ambassador car roadside portrait',
    description:
      'The white Ambassador, the roadside, the late-afternoon sun — with the shape description that stops the model rendering a modern sedan.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same bone structure, nose, eyes, lips, skin tone and age, no slimming or smoothing — and change only my hair, clothes, pose and surroundings. Put me on an Indian roadside in 1986, leaning against the front wing of a white Hindustan Ambassador. The car must be the old upright shape: rounded 1950s-style body, chrome grille, small round headlamps, thin chrome bumpers, a black number plate with white letters, no alloy wheels, no plastic bumpers, no LED lamps. I have mid-80s side-parted hair, slightly wind-blown, a bold printed half-sleeve shirt tucked into high-waisted trousers with a wide leather belt, big square tinted sunglasses and a metal watch. Behind, a two-lane road, a dusty verge, a gulmohar tree and a single-storey building with a hand-painted signboard too blurred to read. Low late-afternoon sun from the left, hard shadows, a hot highlight along the top of the car. Shot on 35mm film in 1986: grain, warm faded colour, a small red-orange 1986 date stamp in the lower right. Nothing modern in frame. Vertical 9:16 portrait, knees up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'ambassador',
      'outdoor',
      'men',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-ambassador-car-lean.webp',
      alt: 'A man leaning against a white Hindustan Ambassador on an Indian roadside in late afternoon light, shot to look like a 1986 photograph',
      aspectRatio: '9:16',
      modelCredit: {
        name: 'Pranjul Rathour',
        instagram: 'https://www.instagram.com/pranjulrathour.in/',
        linkedin: 'https://www.linkedin.com/in/pranjul-rathour/',
      },
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged for the whole clip — no morphing, no beautifying, no drift. A light breeze moves my hair and shirt collar, I shift my weight slightly against the car, and a little roadside dust drifts past at ground level. The Ambassador itself stays still — no wheels turning, no driving. Camera: a very slow, barely-there push in, nothing that would blur the car's shape. Duration: 6 seconds, one continuous shot, no cuts. Add only distant road traffic and a bird call — no dialogue, no music. Keep the same warm faded 1986 film colour, grain and hard low-sun shadows from the still throughout the clip, with no shift in white balance or sharpness. Add no modern vehicle, no phone, no on-screen text. Output: vertical 9:16, matching the still's framing, ending close enough to its own first frame to loop cleanly.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Asking for "a vintage Indian car" returns a generic beige box. Describing the Ambassador by its geometry instead — upright body, chrome grille, small round headlamps, thin bumpers — works because image models recognise silhouettes far more reliably than Indian nameplates, which barely appear in their training data. The blurred signboard is deliberate: background text is where these images break, and declaring it unreadable turns a guaranteed failure into depth of field.',
    exampleOutput:
      'A warm, low-sun roadside frame with hard shadows and a period-correct upright white car. Number plate and signboard lettering will be nonsense up close, which is how a real snapshot reads at this size.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-doordarshan-living-room',
    category: 'photo-trends',
    title: '1986 Doordarshan-era living room',
    description:
      'Wood panelling, a boxy TV on a wrought-iron stand, plastic flowers and a direct camera flash. The middle-class Indian drawing room of the 80s.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone and age, no slimming, smoothing or beautifying — and change only my hair, clothes, pose and surroundings. Put me in an Indian middle-class drawing room in 1986, sitting on a low wooden-framed sofa with thin floral-print cushions, one arm along the backrest. Neatly combed side-parted hair, a short-sleeved printed shirt worn loose over trousers, a plain watch. Around me: a dark wood-panelled wall, a boxy cabinet television with a rounded glass screen and dial knobs on a wrought-iron stand, a lace doily under plastic flowers, a round wall clock with a plain blank face, a framed family photo hung slightly too high, and a low table with a steel water jug and two steel tumblers. The room is lived in and a little cluttered, not styled. Light it with a direct on-camera flash: hot over-lit foreground, my face flat and evenly lit, a hard compact shadow on the wall right behind my head, and the room falling into darkness at the edges. 35mm film, 1986: grain, warm tungsten cast, faded colour. No flat-screen, no remote, no phone, no modern branding. Vertical 9:16, waist up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'doordarshan',
      'interior',
      'nostalgia',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-doordarshan-living-room.webp',
      alt: 'A person seated on a floral sofa in a wood-panelled 1986 Indian drawing room beside a boxy television, lit by a direct camera flash',
      aspectRatio: '9:16',
      modelCredit: {
        name: 'Pranjul Rathour',
        instagram: 'https://www.instagram.com/pranjulrathour.in/',
        linkedin: 'https://www.linkedin.com/in/pranjul-rathour/',
      },
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged — no morphing, no drift, no beautifying. Movement stays small and domestic: a slow blink and breath, the television screen behind me flickering faintly with a scan-line shimmer, and dust motes drifting visibly through the hard flash-lit air. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add only quiet room tone and the television's faint electrical hum — no dialogue, no music, no legible television audio. Keep the same flat on-camera-flash exposure, warm tungsten cast and 1986 film grain from the still for the full clip; the hard shadow behind my head must not move or soften. Add no flat-screen, no remote, no modern branding. Output: vertical 9:16, matching the still's framing, with a loop-safe start and end frame.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Direct on-camera flash is the strongest period signal in this whole trend and the one thing a model will never do unless told. Left alone it renders even, flattering, ambient interiors, because that is what modern interior photography looks like. Spelling out the three consequences — hot foreground, flat face, hard shadow right behind the head — gets the physics instead of a warm filter. The blank clock face removes the one surface that would otherwise render nonsense.',
    exampleOutput:
      'A flat, flash-lit indoor snapshot with a hard shadow behind the head, a boxy TV and warm faded colour. Object placement shifts between runs; the flash look holds.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-disco-dancer-stage',
    category: 'photo-trends',
    title: '80s disco stage performer',
    description:
      'Sequinned jacket, haze, a laser-starburst backdrop and a hot coloured rim light — with the colour discipline that keeps your face yours.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone and age. Coloured stage light may fall on my hair and shoulders but my face must stay close to neutral and no feature may be reshaped. Change only my hair, clothes, pose and surroundings. Make me a 1987 disco stage performer: big layered hair with crown height, slightly wild as if mid-turn, a silver sequinned blazer with strong shoulders over a dark open-collar shirt, a thin metal chain, cuffs pushed up. I am mid-performance, weight on one leg, torso turned, one shoulder dropped toward camera, chin up, confident. Behind me a dark stage with a laser starburst radiating from a point behind my shoulder and thin haze catching the beams. One hard warm key from high front-left, and a strong coloured rim light from behind right drawing a hot edge along my hair and shoulder. Use only two colours, one warm and one cool — keep the colour on the rim, the haze and the background, not smeared on my skin. Fast 35mm film pushed a stop: coarse grain, halation blooming off the sequins, crushed blacks. No phone, no LED screens, no modern fixtures. Vertical 9:16, mid-thigh up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'disco',
      'stage',
      'bollywood',
      'men',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-disco-dancer-stage.webp',
      alt: 'A performer in a silver sequinned blazer on a hazy 1987 stage with a laser starburst backdrop and a hot coloured rim light',
      aspectRatio: '9:16',
      modelCredit: {
        name: 'Pranjul Rathour',
        instagram: 'https://www.instagram.com/pranjulrathour.in/',
        linkedin: 'https://www.linkedin.com/in/pranjul-rathour/',
      },
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged for the whole clip — coloured light may move across my hair and shoulders, exactly as in the still, but my face must stay recognisably mine throughout, never reshaped or colour-washed. Continue the turn the pose already implies: my weight finishes shifting onto the other leg, my hair swings with the movement, and the haze drifts slowly through the laser beams behind me. Camera: a slow, small arc around me at a fixed distance — not a push in, not a handheld shake. Duration: 6 seconds, one continuous shot, no cuts. Add a muffled, distant disco bassline and a faint crowd murmur, low enough to sit under the visual — no lyrics, no dialogue. Keep the same two-colour rim lighting, haze and 1988 pushed-film grain from the still throughout. Add no modern stage screen, no phone light, no on-screen text. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Ask for "80s neon" and the model floods every surface with magenta and cyan until the face is unrecognisable and the image reads as a filter. Two rules stop that: cap the palette at two colours, which is what a real gelled stage rig produced, and put the colour on the rim, haze and background while keeping the face neutral. That is also how stage photography actually works, and it protects the likeness — heavy coloured light on skin is the fastest way to lose a face.',
    exampleOutput:
      'A high-contrast stage frame with a hot coloured rim on the hair and shoulder, visible haze and blooming sequin highlights.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-filmfare-magazine-cover',
    category: 'photo-trends',
    title: '1986 film magazine cover (men)',
    description:
      'Your face on a period Indian film-magazine cover, with the text instruction that stops the lettering turning into garbled AI type.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone and age, no slimming or smoothing, and do not stylise me toward a generic cover-model face. Change only my hair, clothes, pose and the design around me. Build a 1986 Indian film magazine cover on cheap glossy paper. I fill the frame from mid-chest up, slightly right of centre, looking straight down the lens, composed and confident. Mid-80s hair with crown volume, an emerald satin shirt with padded shoulders, a heavy gold chain. A bold sans-serif masthead across the top, its lower edge overlapped by the top of my hair, three or four short cover lines down the left edge, and a thin coloured rule with a small barcode and price at the bottom. Render the lettering as clean plausible English type, and where a word cannot be rendered crisply, render it smaller and softer so it reads as type at a glance rather than as sharp misspelled words. No Devanagari, no real magazine's name. Soft key just above the lens, bright fill from below, hard hair light behind, saturated paper backdrop. Oversaturated ink, faint halftone dots, slightly imperfect registration. Vertical 3:4 cover.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'magazine-cover',
      'filmfare',
      'bollywood',
      'men',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-filmfare-magazine-cover.webp',
      alt: 'A man styled as a 1986 Indian film magazine cover star, with a bold masthead overlapping his hair and cover lines down the left edge',
      aspectRatio: '3:4',
      modelCredit: {
        name: 'Pranjul Rathour',
        instagram: 'https://www.instagram.com/pranjulrathour.in/',
        linkedin: 'https://www.linkedin.com/in/pranjul-rathour/',
      },
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated, as a magazine-cover 'comes alive' teaser rather than a scene. Keep my face and identity completely unchanged — no reshaping, no drift toward a generic cover-model face. Movement is minimal and cover-appropriate: a slow blink, a faint catch of light moving across my hair as my head tilts a fraction, the masthead and cover lines staying perfectly still and legible throughout. Camera: locked off, no movement. Duration: 4 seconds, one continuous shot, no cuts. No sound, or at most a very quiet studio-hush room tone — no music, no dialogue, nothing that implies a cover story being read aloud. Keep the same saturated print colour, halftone texture and soft cover-line type from the still for the whole clip — the lettering must not warp, re-flow or become more legible than the still. Output: vertical 3:4, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Cover prompts live or die on text, and most published versions ignore the problem and ship garbled lettering. The fix is counter-intuitive: give the model a fallback. Telling it to render type smaller and softer when it cannot render it crisply turns the common failure — sharp, confidently misspelled words — into something that reads as ordinary type at normal size. Ruling out Devanagari trades a little authenticity for a usable image, since non-Latin script is where these models fail hardest.',
    exampleOutput:
      'A saturated glossy cover with a masthead overlapping the hair, soft cover lines and visible print texture. The cover-line wording is near-nonsense up close, by design.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-college-campus-denim',
    category: 'photo-trends',
    title: '1985 college campus snapshot (men)',
    description:
      'Denim jacket, canvas shoes, books and a shaded corridor. Built from the limitations of real film, which is why it reads as a genuinely old photo.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone and age, no slimming, smoothing or beautifying, and do not make me look younger. Change only my hair, clothes, pose and surroundings. Put me on an Indian college campus in 1985: hair a bit longer than a formal cut, side-parted, slightly untidy with no product, a faded blue denim jacket open over a plain t-shirt, high-waisted straight-leg jeans, white canvas sneakers, a cloth shoulder bag and two or three hardback books held against my hip. I am leaning one shoulder against a plastered pillar in a shaded open corridor, weight on one leg, half-smiling as if a friend called my name. Behind, out of focus, a notice board layered with paper too blurred to read, a bicycle stand, and bright sunlit trees beyond the corridor's edge. Bright midday sun outside but I am in open shade — soft, even, slightly cool light on my face, and the sunlit background blown out several stops brighter. No flash. 35mm amateur film, 1985: grain, flat contrast, colour faded warm with cyan shadows, and a slightly crooked handheld frame. Nothing modern in view. Vertical 9:16, knees up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'college',
      'casual',
      'men',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-college-campus-denim.webp',
      alt: 'A student in a denim jacket leaning against a pillar in a shaded college corridor, shot to look like a flat, faded 1985 snapshot',
      aspectRatio: '9:16',
      modelCredit: {
        name: 'Pranjul Rathour',
        instagram: 'https://www.instagram.com/pranjulrathour.in/',
        linkedin: 'https://www.linkedin.com/in/pranjul-rathour/',
      },
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged — no slimming, smoothing or drift. I push my shoulder off the pillar and my half-smile widens slightly, as if a friend just called my name again; the wind lifts my denim jacket collar and hair a little more; someone crosses the blurred sunlit background in the distance without ever becoming a second focal point. Camera: static, or the faintest handheld sway, as if a friend is holding the phone rather than a tripod. Duration: 6 seconds, one continuous shot, no cuts. Add distant campus chatter and birdsong — no dialogue directed at camera, no music. Keep the same flat contrast, faded warm 1985 colour, grain and blown-out background from the still throughout; the background must stay overexposed, not resolve into detail. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Almost every 80s prompt asks for glamour, which is why almost every output looks like a film still instead of an old photograph. This one withholds the studio on purpose: open shade, no flash, flat contrast, a crooked horizon. The load-bearing detail is the blown-out background — real consumer film could not hold a shaded face and a sunlit exterior at once, so the exterior clipped to white. A reproduced limitation is far more convincing than added grain.',
    exampleOutput:
      'A soft, flat, slightly crooked campus snapshot with a blown-out background. Reads noticeably more like a real 1985 photo than the studio prompts do.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-baraat-groom',
    category: 'photo-trends',
    title: '1986 wedding groom in the baraat',
    description:
      'Sherwani, sehra, garlands and a horse, shot with the hard night flash of a 1986 wedding photographer — and the sehra rule that keeps your face visible.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone and age, no slimming or smoothing. Nothing worn on my head may cover or shade any part of my face. If I have facial hair keep it exactly; if I do not, do not add any. Change only my hair, clothes, pose and surroundings. Make me a groom in an Indian wedding procession at night in 1986: a cream raw-silk sherwani with a high mandarin collar and gold thread work over churidar, a pale turban with a fan-shaped pleated crest, and a sehra of hanging floral strings falling from the turban across my upper forehead but clearly above my eyebrows, not over my eyes. Thick marigold and rose garlands layered around my neck, hanging low and clear of my chin, and a stole over one shoulder. I am sitting upright on a white horse draped in red and gold embroidered cloth. Behind me, out of focus, relatives, a man carrying a tube-light frame, and a decorated gate. Hard direct flash straight at me after dark: bright flat face, an over-exposed hot patch on the near shoulder, and the crowd two metres back already dim against a black sky, with a weak greenish tube-light glow from the left. 35mm night film: heavy grain, warm-magenta cast, halation on the highlights. Vertical 9:16, from the horse's shoulder up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'wedding',
      'baraat',
      'groom',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-baraat-groom.webp',
      alt: 'A groom in a cream sherwani and turban on a decorated white horse at a 1986 night wedding procession, lit by hard direct flash',
      aspectRatio: '9:16',
      modelCredit: {
        name: 'Pranjul Rathour',
        instagram: 'https://www.instagram.com/pranjulrathour.in/',
        linkedin: 'https://www.linkedin.com/in/pranjul-rathour/',
      },
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged for the whole clip, and keep the sehra strings exactly where they sit in the still — clearly above my eyebrows, never drifting down over my eyes. The horse shifts its weight and flicks its tail once, the hanging sehra strings sway very slightly with the horse's movement, and the tube-light behind flickers. Camera: locked off, no movement — a moving camera on horseback framing risks losing the face the whole prompt protects. Duration: 5 seconds, one continuous shot, no cuts. Add a distant dhol beat and murmuring wedding crowd, low and non-intrusive — no dialogue, no clear lyrics. Keep the same hard night-flash exposure, warm-magenta cast and steep falloff into the dark crowd from the still throughout. Add no modern lighting rig, no phone light, no on-screen text. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'The sehra is the trap. Asked for one, models drape the floral strings straight down over the eyes and nose, and the image fails because the face — the only thing you care about — is hidden. So the rule is stated twice: above the eyebrows, not over the face. The other choice is the steep light falloff. Night flash in 1986 lit the subject hard and let everything two metres back go dark, and that gradient dates the image more than grain ever could.',
    exampleOutput:
      'A hard-flash night frame with a bright subject, steep falloff into a dark crowd and a warm-magenta cast. Horse anatomy is the weak point, which is why the crop cuts most of it out.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-government-office-portrait',
    category: 'photo-trends',
    title: '1984 government office portrait',
    description:
      'Steel almirah, ceiling fan, files tied with red tape and a bakelite phone. The frame nobody else in this trend is making.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone and age, no slimming or smoothing, and do not age me up to suit the setting. Change only my hair, clothes, pose and surroundings. Put me in an Indian government office in 1984: hair neatly oiled and combed with a sharp side parting, a pale blue half-sleeve shirt tucked into dark trousers with a pen clipped in the shirt pocket, thick-rimmed rectangular spectacles and a simple metal watch. I am sitting behind a wooden desk, forearms resting on it, one hand near a stack of paper. On the desk: a black bakelite rotary telephone, a glass paperweight, a steel tumbler, a wooden name-plate turned so it cannot be read, and files bound with faded red cloth tape in leaning piles. Behind me a grey-green steel almirah with a padlock hasp, a pale institutional green wall with a dado line, a ceiling fan blade entering the top of frame, and a wall calendar whose printing is indistinct. Overhead fluorescent tube light, slightly green, from above and behind so my eye sockets fall a little into shadow, with weak daylight from a window on the right. No flash. 35mm film, 1984, mixed light unbalanced: grain, an uncorrected green-cyan cast, flat muted contrast. No computer, no monitor, no phone. Vertical 9:16, from the desk up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'office',
      'nostalgia',
      'men',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-government-office-portrait.webp',
      alt: 'A person seated behind a wooden desk in a 1984 Indian government office with a steel almirah and red-tape files, under green fluorescent light',
      aspectRatio: '9:16',
      modelCredit: {
        name: 'Pranjul Rathour',
        instagram: 'https://www.instagram.com/pranjulrathour.in/',
        linkedin: 'https://www.linkedin.com/in/pranjul-rathour/',
      },
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged — no de-aging, no smoothing, no drift. The ceiling fan blade visible at the top of frame turns slowly, the topmost sheet in the red-taped file stack lifts and settles faintly in its breeze, and I blink once, naturally. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add a low ceiling-fan whir and distant, indistinct office chatter — no dialogue, no music. Keep the same uncorrected green-cyan fluorescent cast, flat contrast and 1984 film grain from the still for the whole clip; do not colour-correct the cast as the clip plays. Add no computer, no monitor, no modern phone. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Every competing prompt set is built from glamour — film stars, discos, magazine covers. This one goes the other way and is the most shareable image in the set for exactly that reason. The technical trick is the uncorrected colour: real 1984 film shot under mixed fluorescent and window light came back from the lab with a green-cyan cast nobody could fix, and asking for the uncorrected cast gives the model something physical to reproduce instead of "vintage colours".',
    exampleOutput:
      'A flat, green-cast, slightly underexposed desk portrait with steel furniture and stacked files. The strongest nostalgia hit in the set for Indian viewers over thirty.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-chiffon-saree-hillside',
    category: 'photo-trends',
    title: '80s chiffon saree hillside portrait',
    description:
      'The Yash Chopra look — pastel chiffon moving in wind, a hill slope behind, backlit hair. The most-requested version of the trend.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same bone structure, jawline, nose, eyes, lips, skin tone and age, and my natural asymmetry. Do not slim my face or waist, do not lighten or smooth my skin, do not replace me with a more photogenic face. Change only my hair, clothes, jewellery, pose and surroundings. Put me on a north Indian hillside in 1987 in a pale lilac chiffon saree — a light, semi-sheer fabric with a fine drape, so the pallu lifts and ripples in the wind and the folds fall in thin soft lines rather than heavy stiff pleats — with a matching fitted blouse with slightly puffed sleeves, large gold hoops, a thin chain and a few bangles, one hand raised near my shoulder holding the pallu against the wind. Voluminous softly curled mid-80s hair with height at the crown, worn loose so it lifts. Behind me a wide grassy slope falling away, blue-hazed ridges receding and soft cloud. Late-afternoon sun low and behind me: a hot rim traces my hair, shoulder and the lifted pallu, the chiffon glows where the sun passes through, and light bouncing off the bright ground fills my face gently so I am never in silhouette. 35mm film, 1987: grain, warm faded colour, halation on the backlit hair, veiling flare in one corner. Vertical 9:16, mid-thigh up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'saree',
      'bollywood',
      'women',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-chiffon-saree-hillside.webp',
      alt: 'A woman in a pale lilac chiffon saree on a backlit hillside at golden hour, the pallu lifting in the wind, shot to look like 1987 film',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged for the whole clip — no slimming, lightening or drift. Continue the wind already lifting the pallu in the still: it rises a little further and settles, loose strands of hair move with it, and the grass on the slope behind ripples faintly in the same gusts. Camera: a slow, gentle push in, matching the wind's pace rather than fighting it. Duration: 6 seconds, one continuous shot, no cuts. Add only wind and distant birdsong — no dialogue, no music. Keep the same backlit rim glow on the hair and chiffon, the warm 1987 film grain and the veiling flare from the still throughout; the bounce-fill on my face must stay exactly as bright so I never fall into silhouette as the clip plays. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Sarees are where models produce something nearly right and unmistakably wrong — the drape reads as a stiff wrapped sheet. The fix is describing the fabric physics, not the garment name: light, semi-sheer, fine drape, thin soft folds. Models have learned how thin fabric behaves in wind; they have not learned what "saree" implies about it. The bounce-fill line is the other essential: backlight alone drives the model to silhouette, and a silhouette has no likeness at all.',
    exampleOutput:
      'A warm backlit hillside portrait with a glowing rim on the hair and pallu, visible flare and soft grain. Wind direction varies; the drape quality holds.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-terrace-golden-hour',
    category: 'photo-trends',
    title: '1986 terrace portrait at golden hour',
    description:
      'A rooftop terrace, water tanks and TV antennas behind, low warm sun. Everyday India rather than film-set gloss.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone and age, no slimming, lightening or smoothing. Change only my hair, clothes, jewellery, pose and surroundings. Put me on the flat concrete terrace of an Indian house in 1986, early evening: mid-80s hair with crown volume and soft curls at the ends, lifting slightly in the breeze, a mustard-yellow salwar kameez with a light dupatta, large bright enamel earrings, a few thin bangles, a bindi, and only a trace of kajal. I am standing near a low parapet wall, one hand resting on it, body turned toward the light, looking slightly off-camera, relaxed and unposed. Behind and below: neighbouring rooftops with black plastic water tanks, TV aerial antennas, clothes lines with washing, a water tank ladder and a hazy skyline. Weathered stained concrete underfoot. The sun is very low, twenty minutes before setting, coming across from the left almost horizontally, throwing long soft shadows across the terrace, with warm orange light on the left of my face and a cool blue-grey ambient on the shadow side, and dust in the air catching the light. 35mm film, 1986: grain, warm cast, cyan-shifted shadows, slightly casual family-snapshot framing. No satellite dish, no solar panel, no phone, no modern glass building. Vertical 9:16, waist up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'terrace',
      'golden-hour',
      'women',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-terrace-golden-hour.webp',
      alt: 'A woman in a mustard salwar kameez on an Indian rooftop terrace at low sun, with water tanks and TV antennas on the skyline behind',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged — no lightening, no drift. My dupatta and hair move gently in the terrace breeze, dust catches the low warm light exactly as it does in the still, and a single bird crosses the hazy skyline far in the background. Camera: a slow, small pan across the parapet line, not a push in. Duration: 5 seconds, one continuous shot, no cuts. Add distant city ambience and birdsong — no dialogue, no music. Keep the same long low-sun shadows, warm-cool split lighting on my face and 1986 film grain from the still throughout the clip. Add no satellite dish, no solar panel, no modern glass building. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'The satellite dish exclusion is the whole trick. Ask any model for an Indian rooftop and it fills the skyline with dishes, because almost every rooftop photo it learned from was taken after 1995. Dishes did not exist there in 1986; TV aerial antennas did. Naming the antenna as a positive object and the dish as an exclusion in the same prompt fixes the most common anachronism in this setting.',
    exampleOutput:
      'A warm, low-sun rooftop frame with long shadows, antennas and water tanks behind, and a warm-cool split across the face.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-studio-portrait-blue-canvas',
    category: 'photo-trends',
    title: 'Classic 80s studio portrait, blue canvas',
    description:
      'The portrait that hung in every Indian drawing room — mottled blue backdrop, a hard key, a hair light and big earrings. The most reliable prompt in the set.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same bone structure, jawline, nose, eyes, brow, lips, skin tone, age and natural asymmetry. Studio makeup may be added but it must not reshape a single feature, narrow my nose, enlarge my eyes or lighten my skin. Change only my hair, clothes, jewellery, makeup, pose and background. Make this a 1986 Indian portrait-studio photograph: full backcombed hair with height at the crown, soft curls to the shoulders, one side tucked behind the ear so an earring shows, with a visible hairspray sheen. A sapphire-blue satin blouse with distinctly padded shoulders, large gold drop earrings and a single-strand necklace. I am seated on a stool, body angled about thirty degrees from camera, shoulders down and back, head turned to the lens and tilted very slightly, with a soft closed-mouth smile. Behind me a hand-painted mottled canvas backdrop in blue and grey-blue, lighter directly behind my head and darkening into the corners. Light it as a real four-light studio rig: a hard key high and forty-five degrees to the left leaving a small triangle of light on my far cheek and a defined shadow under my nose, a weak fill on the right at a quarter of the key, a hair light from high behind rimming the crown, and a background light making the lighter halo. Medium-format film on glossy paper, 1986: fine grain, warm skin tones, mild corner vignetting. Vertical 9:16, mid-chest up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'studio-portrait',
      'women',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-studio-portrait-blue-canvas.webp',
      alt: 'A classic 1986 Indian studio portrait against a mottled blue canvas backdrop, with backcombed hair, gold drop earrings and a hair-light rim',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged for the whole clip — no reshaping, no drift toward a smoother or more symmetrical face. Movement stays almost still: a slow natural blink, my head settling a fraction further into the pose, the hair-light rim catching the movement for an instant. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. No sound, or at most a very faint studio-room hush — no music, no dialogue. Keep the same four-light studio modelling, the lighter halo of backdrop behind my head and the fine medium-format grain from the still throughout; the shadow under my nose must not shift position. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'This names a real four-light setup with relative intensities, which is why it returns a studio portrait rather than a filtered snapshot. Models trained on photographs have learned what a four-point rig does; giving them the rig lets them apply that instead of guessing at something pleasant. The lighter halo of backdrop behind the head is the precise period tell — 1980s studios lit their canvas separately to lift the subject off it, and that gradient is in almost every real portrait and almost no unprompted AI one.',
    exampleOutput:
      'A clean, well-modelled studio portrait on mottled blue with a hair-light rim and a lighter halo behind the head. The most consistently flattering result in the set.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-stardust-cover-diva',
    category: 'photo-trends',
    title: '1987 film gossip magazine cover (women)',
    description:
      'Saturated backdrop, direct eye contact, heavy 80s makeup and cheap glossy print stock — the Stardust-era cover look.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone, age and natural asymmetry. Makeup may be added but must not reshape a feature, narrow my nose, enlarge my eyes or lighten my skin, and do not stylise me toward a generic cover-model face. Change only my hair, clothes, jewellery, makeup, pose and the design around me. Build a 1987 Indian film gossip magazine cover on cheap glossy stock. Big backcombed hair with real height and heavy soft curls. Period makeup that is visible and unblended-looking the way 80s magazine makeup genuinely was: warm blush swept high and wide, a strongly defined brow, blue or bronze on the lid, a glossy lip. A fuchsia sequinned top with strong padded shoulders, oversized statement earrings and bangles on one wrist, one hand raised near my jaw. I fill the frame from the chest up, slightly left of centre, looking straight down the lens, direct and knowing. A bold condensed masthead across the top overlapped by my hair, four short cover lines down the right edge with one in a contrasting colour, a price and barcode bottom-left. Render lettering as clean plausible English type, and where a word cannot be rendered crisply render it smaller and softer rather than as sharp misspelled words. No Devanagari, no real magazine's name. Soft key above the lens, bright fill from below, hard hair light behind, and a flat saturated backdrop that clashes with the outfit. Oversaturated ink, faint halftone dots, imperfect registration. Vertical 3:4 cover.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'magazine-cover',
      'stardust',
      'women',
      'bollywood',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-stardust-cover-diva.webp',
      alt: 'A woman styled as a 1987 Indian film magazine cover star in a fuchsia sequinned top with heavy period makeup against a clashing saturated backdrop',
      aspectRatio: '3:4',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated, as a magazine-cover teaser rather than a scene. Keep my face and identity completely unchanged — the heavy period makeup may catch light as I move, but it must not reshape a feature or slide toward a generic cover-model face. Movement is minimal: a slow blink, hair catching a little more light as my head tilts a fraction, the masthead and cover lines staying perfectly still. Camera: locked off, no movement. Duration: 4 seconds, one continuous shot, no cuts. No sound, or at most a very quiet room hush — no music, no dialogue. Keep the same clashing saturated backdrop, oversaturated print ink and halftone texture from the still for the whole clip. Output: vertical 3:4, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      '"Visible, unblended-looking" makeup is doing the most work here. Models default to contemporary blended beauty makeup, which quietly slims the nose and enlarges the eyes and breaks the likeness while appearing to obey. Naming 80s makeup as deliberately unblended gets a period result and, because it sits on the skin rather than resculpting it, protects the face. The clashing backdrop is the other deliberate ask — a model told to pick a complementary colour will return something tasteful and modern.',
    exampleOutput:
      'A loud, saturated, glossy cover with heavy period makeup and soft cover-line type. Deliberately less tasteful than the studio portrait.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-college-girl-salwar-kameez',
    category: 'photo-trends',
    title: '1985 college girl snapshot',
    description:
      'Salwar kameez, a long plait with a ribbon, books held to the chest, a shaded corridor. Reads as genuinely old rather than styled.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone and age, no slimming, lightening, smoothing or beautifying, and do not make me look younger than I am. Change only my hair, clothes, jewellery, pose and surroundings. Put me in an Indian college corridor in 1985: hair oiled and pulled back into a single long plait over one shoulder tied with a folded cloth ribbon, a neat parting, a pale pink salwar kameez with a small floral print, and a dupatta pinned at both shoulders falling flat across the front the practical everyday way rather than draped decoratively. Small gold studs, two thin bangles, a bindi, a cloth sling bag, and three books held flat against my chest with both forearms. I am standing in open shade against a plastered pillar, feet together, slightly self-conscious posture, a small closed-mouth smile as if asked to stop and pose. Behind, out of focus, a notice board layered with paper too blurred to read, a stone floor worn smooth, and bright sunlit greenery beyond the corridor's open side. Bright midday sun outside but I am in shade: soft, even, slightly cool light with no drama, and the exterior blown out several stops brighter. No flash. 35mm amateur film, 1985: grain, flat contrast, colour faded warm with cyan shadows, and slightly casual framing with a little too much headroom. Vertical 9:16, mid-thigh up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'college',
      'salwar-kameez',
      'women',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-college-girl-salwar-kameez.webp',
      alt: 'A student in a pink floral salwar kameez with a long plait holding books in a shaded 1985 Indian college corridor',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged — no smoothing, no drift, no making me look younger. I shift the books slightly against my chest, my pinned dupatta moves a little in the breeze, and the sunlit greenery beyond the corridor sways faintly out of focus. Camera: static, or the faintest handheld sway, as if a classmate is holding the camera rather than a tripod. Duration: 5 seconds, one continuous shot, no cuts. Add distant campus chatter and birdsong — no dialogue, no music. Keep the same flat open-shade lighting, blown-out sunlit background and faded 1985 film grain from the still throughout; the background must stay overexposed, not resolve into detail. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Two instructions run against the model’s defaults. The dupatta is specified as pinned at both shoulders and falling flat — how students actually wore it — because a model left alone drapes every dupatta decoratively across one arm as if for a wedding shoot. And the prompt asks for slightly self-conscious posture and a little too much headroom, since models compose well by default and good composition is exactly what makes an output look art-directed rather than old.',
    exampleOutput:
      'A flat, soft, slightly awkwardly framed corridor snapshot with a blown-out background. One of the most convincing "real old photo" results in the set.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-wedding-reception-kanjeevaram',
    category: 'photo-trends',
    title: '1986 wedding reception in heavy silk',
    description:
      'Kanjeevaram silk, temple jewellery, jasmine and hard flash — the heavy-silk counterpart to the chiffon prompt.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone, age and natural asymmetry. Heavy makeup and jewellery may be added but must not narrow my nose, enlarge my eyes, slim my face or lighten my skin. Change only my hair, clothes, jewellery, makeup, pose and surroundings. Put me at an Indian wedding reception in 1986, after dark: hair drawn back into a low bun at the nape with a garland of jasmine pinned around it, a centre parting with a maang tikka, and a deep maroon Kanjeevaram silk saree with a gold-and-green border — heavy, stiff, densely woven fabric that holds sharp creases and falls in thick structured pleats, the broad zari border catching light as hard metallic glints rather than a soft glow. A matching silk blouse with elbow-length sleeves, temple jewellery, a heavy gold necklace sitting flat on the collarbone, large jhumkas, gold bangles stacked on both wrists, hands folded loosely in front. I am standing on a low carpeted stage, three-quarters to camera, chin level, composed and slightly formal. Behind me, out of focus, a fabric-draped backdrop, marigold and tuberose garlands, a tube-light batten and dim guests. Hard direct flash straight on: bright flat face, hard specular glints off the zari and gold, a compact shadow on the backdrop behind one shoulder, and steep falloff so the guests behind sit in near-darkness, with a weak greenish tube-light rake from one side. 35mm night film: grain, warm-magenta cast, halation on the gold. Vertical 9:16, knees up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'wedding',
      'saree',
      'silk',
      'women',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-wedding-reception-kanjeevaram.webp',
      alt: 'A woman in a deep maroon Kanjeevaram silk saree and temple jewellery on a wedding reception stage in 1986, lit by hard direct flash',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged for the whole clip — no reshaping, no lightening, no drift. The zari border catches hard metallic glints as I shift my weight very slightly, the jasmine in my hair moves a fraction, and the dim guests behind me sway in and out of the near-darkness they already sit in. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add a low, indistinct reception murmur and a faint tube-light hum — no dialogue, no music with legible lyrics. Keep the same hard direct-flash exposure, warm-magenta cast and steep falloff into darkness from the still throughout. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'This is the deliberate opposite of the chiffon prompt, and the contrast is the lesson: the same word, saree, has to be described through completely different physics to come out right. Here it is heavy, stiff, holds sharp creases, thick structured pleats, zari catching light as hard glints. Ask for "silk saree" alone and the model splits the difference into a fabric that behaves like neither.',
    exampleOutput:
      'A hard flash-lit stage portrait with structured pleats, hard gold glints and steep falloff into darkness.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-boombox-denim-street',
    category: 'photo-trends',
    title: '1986 boombox and denim street look',
    description:
      'High-waist acid-wash denim, a wide belt, a shoulder-carried boombox and a painted wall. The Western-influenced 80s look Indian city kids copied.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone, age and natural asymmetry, no slimming, lightening or smoothing. Change only my hair, clothes, jewellery, pose and surroundings. Put me on a city street corner in 1986: big permed hair with strong crown height and tight springy curls, slightly wild and worn loose. Light-wash high-waisted straight-leg jeans cinched with a wide black belt and a large square buckle, an oversized bright red sweatshirt tucked in, chunky white sneakers, large plastic hoop earrings in a bright colour and a stack of thin plastic bangles up one forearm. On one shoulder, held up by one hand, a boxy silver boombox with twin cassette decks, a carry handle and a chunky graphic equaliser panel — a real 1980s machine, not a modern speaker styled to look retro. I am facing camera, weight shifted to one hip, chin slightly down, confident half-smile. Behind me a flat painted concrete wall in a faded colour with peeling patches and a few weathered posters too worn to read. Bright open daylight from slightly behind the camera, throwing a hard-edged shadow of me across the wall to one side. 35mm film, 1986: grain, punchy contrast, colour faded warm with slightly cyan shadows, soft frame corners. No phone, no earbuds, no Bluetooth speaker, no modern sneaker logos. Vertical 9:16, mid-thigh up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'street',
      'denim',
      'boombox',
      'women',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-boombox-denim-street.webp',
      alt: 'A woman with big permed hair in high-waisted denim carrying a twin-deck boombox on her shoulder against a faded painted wall in 1986',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged — no slimming, no drift. I bounce very slightly to a beat only I can hear, the boombox's twin cassette reels on my shoulder visibly turning, and my permed hair moves with the motion. Camera: static, or the faintest handheld sway, matching the street-snapshot feel of the still. Duration: 6 seconds, one continuous shot, no cuts. Add a tinny, muffled cassette beat playing from the boombox itself, low enough to read as diegetic rather than a soundtrack, plus quiet street ambience — no clear lyrics, no dialogue. Keep the same hard wall-shadow, punchy 1986 film contrast and grain from the still throughout. Add no Bluetooth speaker, no earbuds, no modern branding. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'The boombox is described by its parts — boxy, silver, twin cassette decks, carry handle, graphic equaliser panel — rather than by name, because "boombox" alone often returns a modern Bluetooth speaker styled to look retro, a subtly wrong object that ruins the frame. The hard wall shadow is the other ask: flat painted walls in bright sun throw a crisp subject shadow, and models omit it when they render "outdoor lighting" as ambient.',
    exampleOutput:
      'A punchy, high-contrast street frame with a hard wall shadow, big permed hair and a period-correct twin-deck boombox.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-chetak-scooter-portrait',
    category: 'photo-trends',
    title: '1980s Indian scooter street portrait',
    description:
      'The step-through scooter, a side-stand lean and a residential lane — described by silhouette so the model does not render a modern plastic one.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone and age, no slimming, lightening or smoothing. Change only my hair, clothes, jewellery, pose and surroundings. Put me in a quiet Indian residential lane in 1986, standing beside a scooter on its side stand with one hand resting on the handlebar, body angled toward camera, relaxed half-smile. Mid-80s hair with crown volume and soft curls, slightly disturbed by the breeze, a teal cotton saree worn simply, medium hoop earrings, a few bangles, a small handbag hooked over my forearm and simple sandals. The scooter is a 1980s Indian step-through: a rounded pressed-steel monocoque body with a flat front apron, a single round headlamp mounted in the handlebar cowl, small wheels, a side-mounted spare wheel behind the left leg shield, a long single seat and a rear-view mirror on one side only. It must not look like a modern plastic-bodied scooter — no body-coloured plastic panels, no LED lamps, no digital display, no large alloy wheels. Behind me a low compound wall with a gate, bougainvillea spilling over it and a neem tree. Mid-morning sun from the right, warm and directional, hard shadows on the lane and along the scooter body, and a bright specular streak along the top of the front apron. 35mm film, 1986: grain, warm faded colour, cyan shadows, a small red-orange date stamp lower right. Vertical 9:16, knees up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'scooter',
      'street',
      'women',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-chetak-scooter-portrait.webp',
      alt: 'A woman in a teal cotton saree standing beside a 1980s Indian step-through scooter in a sunlit residential lane',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged — no lightening, no drift. A breeze moves my hair and the loose end of my saree, the scooter itself stays parked and still on its side stand, and a bicycle bell sounds once, far down the lane. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add the distant bicycle bell, birdsong and quiet residential ambience — no dialogue, no music. Keep the same hard mid-morning shadows, warm faded 1986 colour and film grain from the still throughout, and the scooter's period-correct silhouette must not change shape as the clip plays. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Same technique as the Ambassador prompt, applied to the other object every Indian family owned. The scooter is specified by silhouette because models recognise shapes far more reliably than Indian nameplates. The spare wheel behind the leg shield is the highest-value single detail — it is unique to this class of scooter and almost never appears unless requested, so including it separates a period-correct result from a generic retro two-wheeler.',
    exampleOutput:
      'A warm, hard-shadowed lane portrait with a period-correct step-through scooter. Badge and instrument details will be invented; the silhouette carries it.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-kitchen-steel-utensils',
    category: 'photo-trends',
    title: '1985 Indian kitchen portrait',
    description:
      'Steel dabbas on open shelves, a grinding stone and one small window. The quietest prompt in the set, and the one people send to their mothers.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone and age, no slimming, lightening, smoothing or beautifying, and do not age me up or down to suit the setting. Change only my hair, clothes, jewellery, pose and surroundings. Put me in an Indian kitchen in 1985: hair tied back simply in a low bun with a few strands loose at the temple, the way hair sits during housework rather than styled. A faded green cotton saree in soft everyday cloth with the pallu tucked in at the waist for practicality, small studs, thin bangles, a plain chain, a bindi and no makeup beyond a trace of kajal. I am standing at a low counter, half-turned toward the camera as if looking up mid-task, with a small unguarded smile. Around me: stainless-steel dabbas of graduated sizes on open shelves, a steel thali and tumblers stacked on a rack, a stone grinding slab in one corner, a two-burner gas stove with a blackened aluminium pan, and a small window with a metal grille. Soft daylight from that window on the left is the only light source — it falls off quickly, so my left side is gently lit and the right side of the kitchen sits in deep shadow, with hard bright specular highlights bouncing off the curved steel. No flash, no overhead light. 35mm film indoors at a slow shutter, 1985: grain, low shadow contrast, a slight warm cast, a hint of motion blur at one hand, lifted blacks. No microwave, no mixer-grinder, no modern packaging. Vertical 9:16, waist up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'kitchen',
      'nostalgia',
      'women',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-kitchen-steel-utensils.webp',
      alt: 'A woman in a faded green cotton saree in a 1985 Indian kitchen lit by a single small window, with steel dabbas on open shelves',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged — no beautifying, no ageing up or down, no drift. I continue the small task at the counter, a thin curl of steam rises from the pan on the stove, and the light through the window grille flickers faintly as if a tree outside is moving in the wind. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add a distant utensil clink and birdsong through the window — no dialogue, no music. Keep the same single-window falloff, deep shadow on the far side of the kitchen and 1985 film grain from the still throughout; the shadow side must not lighten as the clip plays. Add no microwave, no mixer-grinder, no modern packaging. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Single-source window light is the most honest lighting here and the most fragile: models want to fill the shadow side because modern interior photography always does. Stating that the window is the only source, and that the far side sits in deep shadow, is what preserves the falloff. The hint of motion blur at one hand is a deliberate imperfection — indoor film at a slow shutter genuinely produced it, and one soft element does more for believability than any grain setting.',
    exampleOutput:
      'A soft, warm, one-window kitchen frame with hard steel highlights and deep shadow on the far side. Quiet rather than glamorous.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-cabaret-stage-glam',
    category: 'photo-trends',
    title: 'Late-80s stage glam under coloured light',
    description:
      'Sequins, haze, a hot coloured rim and a dark stage — high glamour, with the rule that keeps your face readable.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same features, skin tone, age and natural asymmetry. Coloured stage light may fall on my hair and shoulders, but my face must stay close to neutral in tone and no feature may be reshaped, narrowed or enlarged. Change only my hair, clothes, jewellery, pose and surroundings. Make me a 1988 stage performer: very large backcombed hair with heavy loose curls, moving as if mid-turn and catching a hot rim from behind. A gold sequinned gown with strong padded shoulders, heavy with sequins that catch light as hard individual points rather than an even sheen, long drop earrings that swing, and stacked bangles on one wrist. I am mid-movement, torso turned, one shoulder dropped toward camera, chin lifted, confident and open, one arm raised. Behind me near-black depth with thin haze in the air, a suggestion of a light truss overhead and no visible audience. One hard warm key from high front-left keeping my face readable and close to neutral, and one strong coloured rim from behind right drawing a bright hot edge along my hair, raised arm and one shoulder. Use only two colours, one warm and one cool — the colour belongs to the rim, the haze and the background, not smeared across my skin. Fast 35mm film pushed a stop, 1988: coarse grain, strong halation blooming off the sequins and the rim, crushed blacks. No phone, no LED wall, no modern fixtures. Vertical 9:16, mid-thigh up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'stage',
      'glamour',
      'women',
      'bollywood',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-cabaret-stage-glam.webp',
      alt: 'A woman in a gold sequinned gown mid-movement on a hazy dark 1988 stage, lit by a hot coloured rim light from behind',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and identity completely unchanged for the whole clip — coloured light may move across my hair and shoulders exactly as in the still, but my face must stay recognisably mine and close to neutral throughout. Continue the turn already implied: my raised arm completes its arc, the sequinned gown catches the rim light as hard moving points, and the haze drifts slowly past the light truss above. Camera: a slow, small arc around me at a fixed distance. Duration: 6 seconds, one continuous shot, no cuts. Add a muffled, distant stage bassline and faint crowd murmur, low enough to sit under the image — no legible lyrics, no dialogue. Keep the same two-colour rim lighting, haze and 1988 pushed-film grain from the still throughout. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'The identity clause here — colour may touch the hair and shoulders, the face stays neutral — is likeness protection, not taste. Saturated colour across skin removes the tonal information a viewer uses to recognise a face, so a magenta-washed portrait can be technically accurate and still look like a stranger. Putting the colour on the rim, haze and background is also how real stage photography works, with a near-white key and gelled separation.',
    exampleOutput:
      'A dark, high-contrast stage frame with a hot coloured rim, visible haze, blooming sequins and a face that still reads as yours.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-couple-studio-portrait',
    category: 'photo-trends',
    title: '1986 couple studio portrait',
    description:
      'The framed portrait that sat on the shelf — mottled canvas, a hard key, and the anchoring that stops two faces merging into one.',
    promptText: `Use my uploaded photo, which has two people in it. Anchor each face to its counterpart by position: the person on the left stays the person on the left, the person on the right stays the person on the right. Do not merge, average, swap or blend the two identities, do not let features from one face drift onto the other, and do not make the two people look more alike than they are. Keep each face exactly as it is — same bone structure, nose, eyes, lips, skin tone, age and natural asymmetry, no slimming, lightening or smoothing on either. Change only hair, clothes, jewellery, pose and background. Make this a 1986 Indian portrait-studio photograph of the two of us: coordinated but not identical formalwear in deep jewel tones, padded shoulders on both, a sapphire blouse on one and a wide-lapel burgundy blazer over an open-collar shirt on the other, statement earrings on one and a simple watch on the other. We are seated close on a bench, shoulders angled inward toward each other, heads turned back to the lens and tilted marginally together, with soft closed-mouth smiles, one of us slightly behind and higher so our heads sit at different levels. Behind us a hand-painted mottled canvas backdrop in blue and grey-blue, lighter behind our heads. Hard key high and forty-five degrees left with a defined shadow under each nose, weak fill on the right, a hair light rimming both crowns, catchlights in all four eyes. Medium-format film on glossy paper, 1986: fine grain, warm skin tones, mild vignetting. Vertical 9:16, mid-chest up on both.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'couple',
      'studio-portrait',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-couple-studio-portrait.webp',
      alt: 'A couple in coordinated jewel-tone 1986 formalwear photographed as a studio portrait against a mottled blue canvas backdrop',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep both our faces and identities completely unchanged for the whole clip — anchor each to the same side of frame as the still, and do not let either face drift toward the other's. Movement stays small: a slow, near-synchronised blink from both of us, the hair light catching a faint shift as our heads settle a fraction further into the pose. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. No sound, or at most a very quiet studio-room hush — no music, no dialogue. Keep the same four-light studio modelling, offset head heights and fine medium-format grain from the still throughout. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Two faces fail differently from one. The specific failure is identity bleed — the model averages the two faces toward a shared middle and both people come out looking like siblings. Anchoring each output face to its source counterpart by position gives the model a correspondence to hold. The offset head height matters too: real studio photographers never placed two heads at the same level, so equal heights read as an AI composite even when both likenesses are perfect.',
    exampleOutput:
      'A well-modelled two-up studio portrait with offset head heights and both likenesses intact. Check both faces before sharing — bleed is the failure to watch for.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-couple-film-poster',
    category: 'photo-trends',
    title: '1987 hand-painted film poster (couple)',
    description:
      'A painted poster, not a photograph — the one prompt that drops photorealism on purpose, and gets a higher hit rate for it.',
    promptText: `Use my uploaded photo, which has two people in it. Anchor each painted face to its counterpart by position — left stays left, right stays right. Do not merge, average, swap or blend the two identities. Keep each face recognisably theirs: bone structure, nose, eyes, lips, skin tone and age. The painting style may simplify surface detail, but no proportion may be altered — do not slim a face, narrow a nose, enlarge eyes or lighten skin in the name of style. Change only hair, clothes, pose, composition and background. Make this a hand-painted Indian film poster from 1987, painted in oils on board by a poster artist and then printed on cheap paper: visible brushwork, heightened saturated colour, simplified planes on the faces with hard-edged highlights, and the mildly exaggerated drama of commercial poster painting. Not a photograph, not a digital illustration, not an airbrush render. Classic two-hero arrangement — both faces large in the upper two thirds, one slightly higher and turned three-quarters, the other lower and more frontal, overlapping at the shoulder, with painted rays radiating behind the heads. Below, a smaller full-figure vignette of the same two people in a dramatic pose against a rain-lashed hillside with a speeding jeep, painted looser and less detailed. Leave a wide clear band across the lower third for a title, and render any lettering as plausible English poster type, smaller and softer where it cannot be crisp. No Devanagari, no real film's title or logo. Printed cheap in 1987: slightly misregistered colour separations with thin coloured fringes, visible halftone dots, yellowed faded paper, a soft crease down one side. Vertical 3:4 poster.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'couple',
      'film-poster',
      'painted',
      'bollywood',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-couple-film-poster.webp',
      alt: 'A hand-painted 1987 style Hindi film poster showing a couple as two large painted faces above a smaller action vignette',
      aspectRatio: '3:4',
    },
    videoPrompt: {
      promptText: `Animate this hand-painted film poster as a teaser, not as live footage — the two of us stay painted, not photorealistic, throughout the clip. Keep both painted faces recognisably ours by position, left stays left, right stays right, with no proportion drifting toward a more generic or idealised face. In the lower vignette, the painted rain continues falling and the jeep's headlamps flicker; in the upper two-thirds, our painted expressions barely shift, as if the artist's brushwork is settling rather than the scene changing. Camera: a slow push in toward the upper two hero faces, the same restraint a real trailer teaser would use. Duration: 6 seconds, one continuous shot, no cuts. Add a low, distant film-orchestra swell and falling rain — no legible dialogue, no on-screen title reveal beyond what the still already shows. Keep the same visible brushwork, halftone dots and yellowed paper texture from the still throughout; do not sharpen the painting into a photograph. Output: vertical 3:4, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'This is the only prompt that abandons photorealism, and that is strategy rather than style. Painted faces tolerate imperfection: a brushstroke slightly off reads as an artist’s hand, where the same error in a photorealistic render reads as an AI artefact. So a poster returns a usable image more often. The risk is that "stylised" gives the model licence to idealise, which is why the identity lock separates surface simplification, allowed, from proportion change, forbidden.',
    exampleOutput:
      'A saturated painted two-hero poster with visible brushwork, a lower action vignette, halftone dots and faded paper. Higher hit rate than the photorealistic prompts.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-couple-honeymoon-hills',
    category: 'photo-trends',
    title: '1986 hill-station honeymoon photo',
    description:
      'Sweaters, a shared shawl, pine trees and cold flat light. The Shimla-and-Mussoorie frame from every family album.',
    promptText: `Use my uploaded photo, which has two people in it. Anchor each face to its counterpart by position — left stays left, right stays right. Do not merge, average, swap or blend the two identities, and do not make the two people look more alike than they are. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry, no slimming, lightening or smoothing on either. Change only hair, clothes, pose and surroundings. Put us at an Indian hill station in 1986: mid-80s hair on both, flattened and disordered by cold wind and headwear. Cold-weather clothes of the period — a chunky cream cable-knit cardigan on one, a plain V-neck pullover over a collared shirt on the other, both under a heavy woollen shawl or a boxy zip jacket, a knitted cap on one, a cloth camera bag over a shoulder, hands in pockets or one arm around the other's shoulder. We are standing close together at a railed viewpoint, shoulders touching, both facing camera with slightly stiff posed smiles as if a passing stranger was asked to take the photo. Behind us a metal railing, a steep pine-covered slope falling away, layered ridges fading into cold blue haze and a low grey sky. Overcast, cold and flat: soft light from directly overhead with no visible sun, no hard shadows, a cool blue cast throughout, and breath faintly visible in the cold air. 35mm film, 1986, shot by a stranger: grain, low contrast, a cold blue-cyan cast that the lab over-corrected toward magenta in the highlights, a slightly crooked horizon, and a red-orange date stamp lower right. Vertical 9:16, knees up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'couple',
      'honeymoon',
      'hill-station',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-couple-honeymoon-hills.webp',
      alt: 'A couple in woollen sweaters at a misty hill-station viewpoint railing, shot in cold flat light to look like a 1986 holiday photo',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep both our faces and identities completely unchanged for the whole clip, anchored to the same side of frame as the still. The cold wind moves our hair and the shared shawl a little further, our breath shows faintly in the air, and thin mist drifts slowly across the pine ridges behind us. Camera: a slow, small pan across the ridgeline, not a push in on us. Duration: 6 seconds, one continuous shot, no cuts. Add wind and distant birdsong — no dialogue, no music. Keep the same flat overcast light, cold blue-cyan cast and 1986 film grain from the still throughout; no golden-hour warmth may creep in as the clip plays. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Flat overcast light is unfashionable, which is exactly why it works. Models reach for golden hour whenever a landscape appears, and golden hour is what makes an output look like a travel advertisement rather than a family album. The lab-over-correction detail is a real period artefact worth naming: 1980s minilabs pushed cold negatives toward magenta in the highlights, and cool shadows with faintly magenta highlights is very hard to fake with a filter.',
    exampleOutput:
      'A cold, flat, slightly crooked viewpoint snapshot with blue-cast shadows and magenta-leaning highlights. Reads unmistakably like a scanned print.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-couple-mandap-wedding',
    category: 'photo-trends',
    title: '1986 newlyweds under the mandap',
    description:
      'Heavy silk, layered garlands, sacred fire and hard flash — written so the garlands and sehra do not swallow either face.',
    promptText: `Use my uploaded photo, which has two people in it. Anchor each face to its counterpart by position — left stays left, right stays right. Do not merge, average, swap or blend the two identities. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry. Heavy jewellery and headwear may be added, but nothing worn may cover, shade or obscure any part of either face, and no feature may be reshaped or lightened. Change only hair, clothes, jewellery, pose and surroundings. Make us newlyweds under a wedding mandap in 1986, after dark: one in a cream mandarin-collared sherwani with covered buttons and a pale pleated turban with a fan crest, any sehra strings falling clearly above the eyebrows and not across the face; the other in a stiff deep red Banarasi silk saree with a broad zari border, hair in a low bun with jasmine pinned around it, a centre parting with a maang tikka, and a dupatta drawn over the head but held well back from the hairline so the whole face is open to camera. Thick marigold and rose garlands layered on both, hanging low on the chest and clear of the chins, with gold temple jewellery and stacked bangles. We are seated side by side on a low decorated platform, turned slightly toward each other and back to camera, composed and a little tired. Around us a cloth-draped canopy, marigold strings, a copper vessel and a low sacred fire at the edge of frame throwing warm light upward. Hard direct flash straight on flat-lighting both faces with hard glints off the zari, a compact shadow behind one shoulder, steep falloff into near-dark, and a separate warm orange glow from the fire lighting the undersides of both chins. 35mm night film: grain, warm-magenta cast, halation on the gold. Vertical 9:16, waist up on both.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'couple',
      'wedding',
      'mandap',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-couple-mandap-wedding.webp',
      alt: 'A newlywed couple in cream sherwani and red Banarasi silk seated under a mandap in 1986, lit by hard flash with warm firelight under their chins',
      aspectRatio: '9:16',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep both our faces and identities completely unchanged for the whole clip, anchored to the same side of frame as the still — nothing worn may drift to cover either face as we move. The sacred fire beside us flickers and casts moving warm light on both our chins, the garlands sway very slightly with our breathing, and one of us turns a fraction further toward the other. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add a low, indistinct chant and the crackle of the sacred fire — no clear dialogue, no music with legible lyrics. Keep the same hard flash exposure, warm-magenta cast and the fire's separate warm uplight from the still throughout. Output: vertical 9:16, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Wedding prompts stack three identity threats: garlands rising over the chin, a sehra falling across the eyes, a dupatta pulled forward over the hairline. Any one hides the face you came for, so all three are handled explicitly and separately. The two-source lighting is the other thing worth asking for — hard frontal flash plus warm uplight from the fire gives flat-lit faces with warm light under both chins, a look a single-source description never reaches.',
    exampleOutput:
      'A hard flash-lit mandap frame with warm uplight under both chins, hard gold glints and steep falloff. Verify both faces are fully visible before sharing.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-couple-ambassador-drive',
    category: 'photo-trends',
    title: '1986 Ambassador road-trip photo (couple)',
    description:
      'Bench seat, wound-down window, arm on the door frame — shot from outside the car, which is what makes the period read correctly.',
    promptText: `Use my uploaded photo, which has two people in it. Anchor each face to its counterpart by position — left stays left, right stays right. Do not merge, average, swap or blend the two identities, and do not make us look more alike than we are. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry, no slimming, lightening or smoothing. Change only hair, clothes, pose and surroundings. Put us on an Indian highway in 1986, photographed from outside the car by someone standing at the driver's window. We are sitting on the flat bench front seat of a white Hindustan Ambassador — upright body, thin chrome window frames, a large thin-rimmed steering wheel, a simple painted metal dashboard with round dials, the window glass fully wound down. One of us rests a forearm along the open window frame leaning slightly out toward camera, the other leans in from the passenger side, both smiling. Mid-80s hair on both, wind-disturbed. A blue bold-printed half-sleeve shirt on one and a mustard cotton saree on the other, large square tinted sunglasses on one, a metal watch, a steel flask and a newspaper on the seat between us. No plastic dashboard mouldings, no headrests, no seat belts, no digital display, no modern door trim. Bright mid-morning sun from the front-left: the car's roof throws a hard shadow line across the upper part of the window opening so the tops of our heads fall into shade while our faces stay lit by light bouncing off the road, with a hot specular streak along the chrome. 35mm film, 1986: grain, warm faded colour, cyan shadows, a red-orange date stamp lower right. Horizontal 4:3, framed on the open window.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'couple',
      'ambassador',
      'road-trip',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-couple-ambassador-drive.webp',
      alt: 'A couple seen through the wound-down window of a white Ambassador on an Indian highway in 1986, with a hard roof shadow across the opening',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated, as though the car has just rolled to a stop rather than as a driving shot. Keep both our faces and identities completely unchanged, anchored to the same side of frame as the still. The wind through the open window moves our hair a little further, the forearm resting on the window frame shifts slightly, and a distant vehicle passes on the road behind, out of focus. Camera: locked off, no movement, still framed on the open window from outside the car. Duration: 5 seconds, one continuous shot, no cuts. Add idling engine tone and wind — no dialogue, no music. Keep the same hard roof-shadow line across the window opening and the road-bounce light on both faces from the still throughout. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Shooting from outside through the open window solves a problem car interiors always create: dashboards are dense with small period detail and models render them badly. From outside, the window frame crops most of the interior away and the few remaining cues carry the period alone. The roof-shadow instruction is what sells it — a car roof genuinely cuts a hard line across the window opening, shading the tops of heads while road bounce lifts the faces.',
    exampleOutput:
      'A bright horizontal frame through an open car window, hard roof shadow across the upper opening, faces lit by road bounce.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-couple-living-room-sofa',
    category: 'photo-trends',
    title: '1986 couple photo on a floral sofa',
    description:
      'Floral upholstery, a lace doily, a wall clock and a flash fired straight at the sofa. The most ordinary and most believable couple frame.',
    promptText: `Use my uploaded photo, which has two people in it. Anchor each face to its counterpart by position — left stays left, right stays right. Do not merge, average, swap or blend the two identities, and do not make us look more alike than we are. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry, no slimming, lightening or smoothing. Change only hair, clothes, jewellery, pose and surroundings. Put us in an Indian drawing room in 1986, sitting upright and close on a low wooden-framed sofa with thin foam cushions in a busy floral print, hands folded in laps or one arm along the sofa back. Mid-80s domestic hair on both, neatly combed with some crown volume, a little flattened as hair sits at home. Everyday indoor clothing — a maroon printed shirt on one, a green cotton saree on the other — comfortable rather than formal, with simple everyday jewellery, a plain watch and a bindi. Around us: a crocheted lace doily on the sofa arm, a low centre table with a steel water jug and two tumblers on a tray, a boxy cabinet television on a wrought-iron stand, a round wall clock with a plain blank face, a framed photograph hung slightly too high, and a textured distemper wall. Light it with a direct on-camera flash fired from a few feet away by a family member: hot over-lit foreground, both faces flat and evenly lit with no modelling, a separate hard compact shadow on the wall immediately behind each of our heads, and the room falling into darkness at the edges. 35mm film indoors with flash, 1986: grain, warm-yellow tungsten cast mixing with the flash, faded colour, lifted blacks. No flat-screen, no remote, no phone, no modern branding. Horizontal 4:3, knees up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'couple',
      'interior',
      'nostalgia',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-couple-living-room-sofa.webp',
      alt: 'A couple seated on a floral-print sofa in a 1986 Indian drawing room, flash-lit with two hard shadows on the wall behind them',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep both our faces and identities completely unchanged for the whole clip, anchored to the same side of frame as the still. We settle a little closer on the sofa, a small, quiet shared smile forms, and the television screen behind us flickers faintly with a scan-line shimmer. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add quiet room tone and a faint television hum — no dialogue, no music. Keep the same flat on-camera-flash exposure and the two separate hard head-shadows on the wall from the still throughout; neither shadow may merge or move independently of its own head. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Two heads under a single direct flash produce two separate hard shadows on the wall, at slightly different angles. Asking for that explicitly is what makes a two-person flash frame read as one real photograph rather than two subjects composited together, and models will not add it unprompted. Everything else is deliberately ordinary — a busy floral sofa, a doily, a jug on a tray, a picture hung too high. Nobody art-directs a room like this, so a room like this reads as found rather than made.',
    exampleOutput:
      'A flat, warm, flash-lit sofa frame with two distinct wall shadows and period clutter. Unglamorous and highly convincing.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-couple-rain-song-frame',
    category: 'photo-trends',
    title: '1987 rain-song film frame (couple)',
    description:
      'Backlit rain, wet fabric and one hard key. The most cinematic prompt in the set, with the instruction that stops the rain erasing both faces.',
    promptText: `Use my uploaded photo, which has two people in it. Anchor each face to its counterpart by position — left stays left, right stays right. Do not merge, average, swap or blend the two identities. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry. Both faces must remain fully visible, in focus and clearly lit: rain, hair and shadow may surround them but must not obscure, streak across or darken either face, and neither of us may fall into silhouette. Change only hair, clothes, pose and surroundings. Make this a 1987 Hindi film rain sequence: hair wet and heavy, clinging in separated strands, pushed back from both foreheads so neither face is covered. Rain-soaked clothing — a white chiffon saree with the pallu clinging and translucent where wet, and a pale blue cotton shirt darkened and stuck to the shoulders — with the fabric behaving as genuinely wet cloth, heavier, darker, clinging, water running from the hems. We stand close and face each other in three-quarter view to camera, foreheads nearly touching, both turned enough that the camera sees us clearly. Behind, near-black depth with the suggestion of a wall and a single wet street lamp. One hard key from high front-left keeping both faces bright and readable, and one very strong backlight from behind and above aimed into the falling rain so every drop lights up as a bright streak against the dark, tracing a hot rim on both heads and shoulders, with hard specular highlights on wet skin and fabric. 35mm film pushed for a night exterior, 1987: grain, cool blue shadows against a warm key, strong halation blooming around the backlit rain and the lamp, crushed blacks. Horizontal 16:9, chest up on both.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'couple',
      'rain',
      'cinematic',
      'bollywood',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-couple-rain-song-frame.webp',
      alt: 'A couple in a backlit 1987 film rain sequence, lit rain streaks around them and both faces kept bright by a hard front key light',
      aspectRatio: '16:9',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep both our faces and identities completely unchanged for the whole clip, anchored to the same side of frame as the still — rain and hair may move but neither face may ever fall into shadow, streak over or go out of focus. The backlit rain keeps falling in bright glowing streaks, our foreheads drift a fraction closer, and water continues to run from the wet fabric. Camera: a very slow, small push in, matching the scene's own stillness rather than a dramatic move. Duration: 6 seconds, one continuous shot, no cuts. Add falling rain and a distant rumble — no dialogue, no music with legible lyrics. Keep the same hard front key keeping both faces bright, the backlit rain rim and the 1987 pushed-film grain from the still throughout. Output: horizontal 16:9, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Backlit rain is the most likeness-destructive setup in the whole category. A strong backlight is what makes each drop glow, but it also drives both faces toward silhouette, and a silhouette has no likeness at all. So the prompt states three times, in three places, that the faces stay lit, in focus and unobstructed. That repetition is deliberate — on a setup this hostile to faces, a single mention gets overridden by the drama of the rest of the description.',
    exampleOutput:
      'A dark cinematic frame with lit rain streaks, hot rims on both heads, and two faces that stay readable. If a face goes dark, reply "keep both faces brightly lit from the front".',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-family-studio-portrait',
    category: 'photo-trends',
    title: '1986 family studio group portrait',
    description:
      'The framed family portrait on the wall — tiered posing, mottled canvas, and the counting rule that keeps everyone in frame.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order: the first person from the left stays the first from the left, and so on. Do not merge, average, swap or blend any two identities, and do not let features from one face drift onto another. Keep each face exactly as it is — same features, skin tone and natural asymmetry — and preserve the age gaps between us: do not make older people look younger or children look older to even out the group. No slimming, lightening or smoothing on anyone. Change only hair, clothes, jewellery, pose and background. Make this a 1986 Indian portrait-studio group photograph: mid-80s styling appropriate to each age, crown volume and soft curls on the adults, oiled and combed hair on the children. Coordinated warm earth tones — rust, cream and olive — not identical outfits but a shared palette, with padded shoulders on the adults and pressed shirts and simple frocks on the children. Arrange us in the standard studio tier: the eldest seated centrally on a chair, others standing behind and to either side with shoulders angled inward, children seated at the front, every head at a different height, everyone turned about twenty degrees from square, looking into the lens with composed closed-mouth smiles and every pair of eyes open. Behind us a hand-painted mottled canvas backdrop in blue and grey-blue, lighter behind the heads. Broad studio light from front-left high enough to shape the faces with a soft shadow under each nose, a fill from the right at half the key so nobody at the edge falls dark, a hair light rimming the crowns and a background light making the halo. Medium-format film on glossy paper, 1986: fine grain, warm skin tones, mild vignetting. Horizontal 4:3, waist up on everyone.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'family',
      'studio-portrait',
      'group',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-family-studio-portrait.webp',
      alt: 'A family arranged in tiers for a 1986 Indian studio group portrait against a mottled blue canvas backdrop',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many — anchor every face to the same left-to-right position as the still, and do not let any two identities drift toward each other or toward a more even age. Movement stays small and shared: a near-synchronised slow blink across the group, the hair light catching a faint shift as heads settle a fraction further into the tiered pose. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. No sound, or at most a very quiet studio-room hush — no music, no dialogue. Keep the same tiered studio arrangement, the lighter backdrop halo and fine medium-format grain from the still throughout, and every face must stay as evenly lit as it is in the still. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Group prompts fail three ways and this blocks each separately. Headcount drift, where the model adds or drops a person, is blocked by counting the source first. Identity bleed is blocked by left-to-right anchoring. Age flattening — the most damaging, where grandparents come back looking forty — is blocked by naming the age gap as something to preserve. The flatter, higher-fill lighting is a real departure from the single-portrait prompts: a hard key that flatters one face leaves the people at the edges in shadow.',
    exampleOutput:
      'A tiered studio group on mottled blue with every face lit, distinct and age-appropriate. Count the people before sharing.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-family-ambassador-outing',
    category: 'photo-trends',
    title: '1986 family Sunday outing around the car',
    description:
      'The whole family arranged around the Ambassador before setting off, shot by a neighbour — with the scale rule that keeps proportions right.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities. Keep each face exactly as it is — same features, skin tone and natural asymmetry — and preserve the age gaps between us. Keep everyone's body scale true to their age and to each other: adults must be adult-sized relative to the car and to the children, and children must be child-sized relative to the adults. No slimming, lightening or smoothing on anyone. Change only hair, clothes, jewellery, pose and surroundings. Put us on an Indian residential street in 1986, morning, arranged around a white Hindustan Ambassador ready to set off: two adults standing at the front wing, one leaning on the bonnet, children seated on the bonnet edge or standing at the front bumper, one person at the open rear door. The car is the old upright body — rounded 1950s-style shape, chrome grille, small round headlamps, thin chrome bumpers, a black number plate with white letters, no alloy wheels, no plastic bumpers, no LED lamps. Sunday-best in bright 80s primaries: printed half-sleeve shirts and high-waisted trousers, cotton sarees and salwar kameez, pressed shirts and frocks on the children, large tinted sunglasses on one adult, a cloth bag and a steel flask. Behind us a compound wall with a gate, a gulmohar tree and a neighbouring house. Bright mid-morning sun from the left, crisp shadows on the road and along the car's body line, with some of us partly squinting into the light as people genuinely do, and a hot specular streak along the chrome. 35mm film shot by a neighbour, 1986: grain, warm faded colour, cyan shadows, a slightly crooked horizon, a red-orange date stamp lower right. Horizontal 4:3, whole car in frame.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'family',
      'ambassador',
      'outdoor',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-family-ambassador-outing.webp',
      alt: 'A family posed around a white Ambassador on an Indian street in bright 1986 morning sun, dressed in Sunday best',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position and the same relative body scale as the still — no adult may shrink and no child may grow as the clip plays. A breeze moves clothing and hair across the group, a gulmohar leaf drifts past in the foreground, and the Ambassador itself stays parked and still. Camera: locked off, no movement. Duration: 6 seconds, one continuous shot, no cuts. Add distant street ambience and birdsong — no dialogue, no music. Keep the same hard morning shadows, chrome highlight and 1986 film grain from the still throughout. Add no modern vehicle, no phone. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Once a group shares a frame with a large object, scale drift appears — a child slightly too large next to a car door, an adult slightly too small against the roofline — and it makes the image feel wrong in a way viewers notice without being able to name. Stating scale as a relationship gives the model a constraint it can actually apply. The squinting instruction is the small authenticity win: people genuinely squint in hard morning sun, and uniformly wide-open eyes read as staged.',
    exampleOutput:
      'A bright, hard-shadowed street group around a period-correct car, with plausible relative sizes and some squinting. Check headcount and relative heights first.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-family-doordarshan-sunday',
    category: 'photo-trends',
    title: '1987 family around the TV on a Sunday',
    description:
      'Everyone crowded around one boxy television, lit by the screen itself. The most distinctive lighting in the set.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities. Keep each face exactly as it is — same features, skin tone and natural asymmetry — and preserve the age gaps between us. Screen light may fall across our faces but must not change any skin tone or reshape a feature. No slimming, lightening or smoothing. Change only hair, clothes, jewellery, pose and surroundings. Put us in an Indian drawing room on a Sunday morning in 1987, gathered around a single boxy cabinet television with a rounded glass screen and dial knobs on a wrought-iron stand: some on a low floral sofa, some cross-legged on the floor on a cotton durrie, one leaning against the sofa arm. Relaxed 1987 domestic styling for each age, a little flattened as hair sits at home. Comfortable indoor clothes in faded pastels and soft cottons — house sarees, kurtas, half-sleeve shirts, children in shorts and frocks — with minimal jewellery, someone holding a steel tumbler and a plate of snacks on the floor. Most faces turned toward the television in three-quarter view with one or two glancing back at the camera. Around us a lace doily, a low table with a steel jug, a wall clock with a plain blank face, a framed photograph hung high and a textured distemper wall. The screen is on, showing an indistinct bright grey-blue image with horizontal scan lines and no legible content or logo. Two light sources: a cool blue-white glow from the screen, low and in front, lifting the fronts of our faces and throwing soft shadows upward on the wall behind, and a warm dim tungsten bulb well behind barely lifting the room, with the corners staying dark. No flash. 35mm film indoors at a slow shutter, 1987: coarse grain, low contrast, blue and tungsten casts fighting, mild motion blur on one hand, muddy blacks. Horizontal 4:3, shot from behind and to the side of the television.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'family',
      'doordarshan',
      'nostalgia',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-family-doordarshan-sunday.webp',
      alt: 'A family gathered around a boxy television in a 1987 Indian drawing room, their faces lit by the cool glow of the screen',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position as the still. The television screen flickers with a faint scan-line shimmer, its cool glow shifting very slightly across the faces turned toward it, and one person glances back toward the camera. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add a faint television hum and quiet room tone — no legible television audio, no dialogue, no music. Keep the same screen-lit upward shadows, the warm tungsten bulb behind and the coarse 1987 film grain from the still throughout; the screen must show only an indistinct glow, never a legible picture. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Screen-lit interiors are a genuinely different lighting problem, and the result looks like nothing else in the trend. The key instruction is directional: the glow comes from low and in front, throwing shadows upward on the wall — the inverse of every other frame here. Naming that inversion is what produces the effect. The screen-content rule matters just as much: told to show a programme, models render garbled logos and captions, so an indistinct scan-lined glow removes the failure surface entirely.',
    exampleOutput:
      'A dim, coarse-grained interior with cool screen light on the front of the faces, upward wall shadows and a warm bulb behind.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-family-joint-family-grandparents',
    category: 'photo-trends',
    title: '1985 three-generation joint family portrait',
    description:
      'Grandparents seated, everyone else standing behind. Built around one rule: the elders must stay their real age.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities. Keep each face exactly as it is — same features, skin tone and natural asymmetry. Age is part of identity here: keep every person's visible age exactly as it appears. If someone has grey or white hair, keep it grey or white. If someone has deep lines, folds, thinning hair, age spots or a stooped posture, keep every one of them. Do not rejuvenate, smooth, firm or re-pigment anyone, do not make any child look older, and keep the generation gaps clearly visible. No slimming, lightening or beautifying. Change only hair length and grooming, clothes, jewellery, pose and surroundings. Put us on the verandah of an Indian family house in 1985: styling appropriate to each real age, oiled and combed on the elders with the grey fully retained, crown volume on the younger adults, neatly parted on the children. Formalwear in creams, whites and soft ochres — dhoti or trousers with a plain shirt on the eldest men, cotton or silk sarees with the pallu over the shoulder on the eldest women, padded-shoulder blouses and printed shirts on the younger adults, pressed shirts and frocks on the children, simple gold jewellery on the elders, a walking stick held by one. The two eldest seated centrally on wooden chairs with the youngest child on a lap or at their feet, everyone else standing in a row behind with hands at their sides, every head at a slightly different height, all facing camera with composed or faintly smiling expressions as people of that era posed. Behind us plastered pillars, a wooden door with a brass latch and potted plants. Open shade on the verandah with bright sun beyond: soft even slightly cool light, no hard shadows, no flash, and the garden blown out several stops brighter. 35mm film, 1985: grain, flat low contrast, colour faded warm with cyan shadows, slight vignetting. Horizontal 4:3, knees up on everyone.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'family',
      'grandparents',
      'group',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-family-joint-family-grandparents.webp',
      alt: 'Three generations of an Indian family posed on a house verandah in 1985, grandparents seated with the family standing behind',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position as the still — every visible sign of age (grey hair, lines, a stooped posture) must stay exactly as it appears, with no one rejuvenated as they move. The youngest child fidgets slightly at the elders' feet, a breeze moves through the potted plants on the verandah, and the eldest pair sit still and composed while everyone standing behind shifts only faintly. Camera: locked off, no movement. Duration: 6 seconds, one continuous shot, no cuts. Add birdsong and quiet household ambience — no dialogue, no music. Keep the same open-shade flat lighting and 1985 film grain from the still throughout, with the sunlit garden beyond staying blown out. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Image models beautify, and beautification is functionally the same operation as rejuvenation. On a three-generation portrait that produces the one failure people find genuinely upsetting: a grandmother returned with smooth skin and dark hair. The fix is promoting age into the identity lock and enumerating what must survive — grey hair, deep lines, folds, thinning hair, age spots, stooped posture. A general instruction is too abstract to bind; a list is something the model can check itself against.',
    exampleOutput:
      'A flat, softly lit verandah group with generation gaps intact. Look hard at the eldest faces first — rejuvenation is the failure to catch here.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-family-park-picnic',
    category: 'photo-trends',
    title: '1986 family park picnic snapshot',
    description:
      'A cotton sheet on the grass, steel tiffin boxes and dappled light through a tree. Relaxed rather than lined up for the camera.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry — and preserve the age gaps. Dappled light may fall across faces, but no face may be so shadowed that it becomes unrecognisable: keep every face readable. No slimming, lightening or smoothing. Change only hair, clothes, jewellery, pose and surroundings. Put us in a public park in an Indian city in 1986, late morning, sitting informally on a folded cotton bedsheet spread on the grass under a large tree: some cross-legged, one lying propped on an elbow, a child mid-movement, one adult half-turned reaching for a tiffin box. Not everyone is looking at the camera — two or three are, the rest are caught mid-activity. Relaxed 1986 styling for each age, a little disordered from sitting outdoors. Casual outing clothes in bright cottons — coral, sky blue and white — printed shirts, cotton sarees, salwar kameez, children in shorts and frocks with canvas shoes. Around us round steel tiffin boxes with the lids off, steel tumblers, a thermos flask, a newspaper and a cloth bag. Behind, mown grass, a hedge, a distant bandstand and other families far off and out of focus. Bright midday sun filtered through the tree above, throwing a dappled pattern of hard bright patches and soft shadows across the sheet, the food and us, with bright open sun on the grass beyond several stops hotter. No flash. 35mm film, 1986: grain, punchy contrast from the harsh light, warm faded colour, cyan shadows, slightly off-level framing. No plastic containers, no modern packaging. Horizontal 4:3.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'family',
      'picnic',
      'outdoor',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-family-park-picnic.webp',
      alt: 'A family sitting on a cotton sheet under a tree in an Indian park in 1986 with steel tiffin boxes, in dappled sunlight',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position as the still — dappled light may shift across faces as the leaves above move, but no face may become unreadable as it does. The child already mid-movement completes a small gesture, one adult's reaching hand reaches the tiffin box, and the dappled light pattern drifts slowly across the spread sheet. Camera: static, or the faintest handheld sway, as if a family member is holding the camera. Duration: 6 seconds, one continuous shot, no cuts. Add park ambience, birdsong and distant chatter — no dialogue directed at camera, no music. Keep the same punchy midday contrast and 1986 film grain from the still throughout. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Dappled light is the most interesting condition in the set and the most dangerous for a group, because a hard bright patch across one person’s eyes can make them unrecognisable while every other face is perfect. So the identity lock carries an exception: dapple is allowed, unreadable faces are not. The other choice is that not everyone looks at the camera — every competing prompt lines subjects up facing the lens, which is exactly what makes those outputs read as portraits rather than snapshots.',
    exampleOutput:
      'A punchy, dappled outdoor group with steel tiffins and a spread sheet, most people mid-activity. Check that no face is lost under a bright patch.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-family-diwali-night',
    category: 'photo-trends',
    title: '1986 Diwali night family photo',
    description:
      'Rows of oil lamps, a sparkler and warm light coming from below. The one prompt built entirely around uplight.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry — and preserve the age gaps. Warm lamp light may fall on our faces from below, but every face must stay clearly readable and no feature may be reshaped, narrowed, enlarged or lightened by the lighting. No slimming, smoothing or beautifying. Change only hair, clothes, jewellery, pose and surroundings. Put us on the front steps and doorway of an Indian house on Diwali night in 1986: neatly done festival styling for each age, oiled and combed, crown volume on the younger adults, a flower pinned for one. New festival clothes in deep reds, golds and magentas — silk sarees with zari borders, kurta-pyjama, a child in a stiff new outfit that does not quite fit — with gold jewellery, bangles and a bindi. One of us holds a lit sparkler at arm's length, another a brass plate with a small lamp. We stand and sit together on the steps, some crouched beside a row of small clay diyas along the step edge, one child mid-laugh, most looking toward the camera. Around us rows of lit clay oil lamps along the steps and parapet, a marigold toran across the doorway, a rangoli in coloured powder on the ground and dark night beyond. The dominant light comes from below: the row of lamp flames lighting the undersides of chins, the lower cheeks and the fronts of the clothes, and throwing soft shadows upward. The sparkler adds a small hard white-hot point that blows out slightly and casts a second set of shadows, and a dim warm bulb in the doorway lifts the background just enough to read. Beyond the lamps the night falls to near-black. 35mm film at night without flash, 1986: coarse grain, heavy warm-orange cast, strong halation around every flame, motion blur in the sparkler trail and one moving hand, dense blacks. No LED or electric fairy lights. Horizontal 4:3.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'family',
      'diwali',
      'festival',
      'night',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-family-diwali-night.webp',
      alt: 'A family on the front steps of a house on Diwali night in 1986, lit from below by a row of clay oil lamps with one sparkler burning',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position as the still — the warm lamp light may flicker across faces but every face must stay clearly readable throughout. The row of clay diyas keeps burning, the held sparkler showers a few more sparks and casts moving light, and the rangoli stays still on the ground beneath. Camera: locked off, no movement. Duration: 6 seconds, one continuous shot, no cuts. Add the crackle of the sparkler and distant, faint firecracker sounds — no dialogue, no music, no sung 'happy birthday'-style lyrics of any kind. Keep the same below-lighting from the lamp row, the sparkler's small hot point and the coarse night-film grain from the still throughout; the night beyond the lamps must stay near-black. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Uplight is the rarest lighting direction in any image model’s training data, which is why asking for it produces something that does not look like other AI output. The instruction has to be specific about consequences — light on the undersides of chins and lower cheeks, shadows thrown upward — because "lit by diyas" alone returns a normally-lit scene with some lamps in it. Uplight also distorts faces more than any other direction, hence the explicit clause that it may not reshape a feature.',
    exampleOutput:
      'A dark, warm, coarse-grained night frame lit from below by lamp flames, with a blown-out sparkler and upward shadows. Verify faces are not distorted by the uplight.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-family-hill-station-holiday',
    category: 'photo-trends',
    title: '1987 family hill station holiday photo',
    description:
      'Sweaters, a shared shawl, a viewpoint railing and cold flat light — with the rule that keeps caps and hoods off everyone’s face.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry — and preserve the age gaps. Caps, hoods and shawls may be worn, but nothing may cover any part of any face, and every face must stay fully visible to camera. No slimming, lightening or smoothing. Change only hair, clothes, pose and surroundings. Put us at an Indian hill station viewpoint in 1987: mid-80s styling for each age, flattened and disordered by cold wind and headwear. Cold-weather clothing in cream, maroon and forest green — cable-knit cardigans and V-neck pullovers over collared shirts, a heavy woollen shawl shared across two people, boxy zip jackets, knitted caps on the children, a monkey cap on one, a cloth camera bag over a shoulder, hands in pockets or holding a paper cup. We stand close together against a metal railing, pressed shoulder to shoulder for warmth, all facing camera with slightly stiff posed smiles as if a passing stranger was asked to take the photo. Behind us a steep pine-covered slope, layered ridges fading into cold blue haze and a low grey sky. Overcast, cold and flat: soft light from directly overhead with no visible sun, no hard shadows, a cool blue cast throughout, every face evenly and slightly dully lit, and breath faintly visible in the cold air. 35mm film shot by a stranger, 1987: grain, low contrast, a cold blue-cyan cast over-corrected toward magenta in the highlights, a slightly crooked horizon, a red-orange date stamp lower right. No modern outdoor gear or branded jackets. Horizontal 4:3, waist up on everyone.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'family',
      'hill-station',
      'holiday',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-family-hill-station-holiday.webp',
      alt: 'A family in woollen sweaters and caps pressed together at a misty hill-station viewpoint railing in flat overcast 1987 light',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position as the still — caps, hoods and the shared shawl may move in the wind but nothing may drift to cover any face. The cold wind moves everyone's clothing and headwear a little further, breath shows faintly in the air, and thin mist drifts across the pine slope behind the group. Camera: locked off, no movement. Duration: 6 seconds, one continuous shot, no cuts. Add wind and distant birdsong — no dialogue, no music. Keep the same flat overcast light and cold blue-cast shadows from the still throughout; no golden-hour warmth may creep in. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Winter group photos introduce a quiet failure: caps, hoods and a shared shawl creep across faces and one person ends up half-hidden. On a single portrait that is obvious; in a group of six it is easy to miss until after sharing. The flat overcast light is the same deliberate anti-golden-hour choice as the honeymoon prompt, and for a group it does double duty — directionless light means nobody at the edge of the row falls into shadow, so every likeness survives equally.',
    exampleOutput:
      'A cold, flat, slightly crooked viewpoint group with blue-cast shadows and every face clear of headwear. Count the people and check the edges of the row.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-friends-college-steps',
    category: 'photo-trends',
    title: '1985 college friends group snapshot',
    description:
      'Arms over shoulders on the college steps, one crouched at the front — with the limb rule that keeps arms attached to the right people.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities, and do not make us look more alike than we are. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry, no slimming, lightening or smoothing. Every visible arm must connect to exactly one person and that connection must be anatomically correct: where an arm goes over a shoulder, the shoulder it rests on and the body it comes from must both be clear. Render every visible hand with five correctly formed fingers, or keep that hand out of frame entirely — do not produce a hand that belongs to nobody. Change only hair, clothes, pose and surroundings. Put us at an Indian college in 1985, arranged informally on a flight of stone steps: most standing in a loose row with arms over each other's shoulders, one crouched at the front, one sitting on the step edge, postures relaxed and uneven rather than lined up, mixed expressions with some laughing, some mid-speech and most looking at the camera. Mid-80s student hair, a bit longer, untidy, no product, varied across the group. Casual clothes in faded denim, white and primary colours — denim jackets, plain and printed shirts, high-waisted straight jeans, salwar kameez with pinned dupattas, canvas shoes and leather sandals, cloth sling bags, books under arms. Behind us plastered pillars, a notice board layered with paper too blurred to read, and bright sunlit greenery beyond. We are in open shade with bright midday sun outside: soft even slightly cool light, no hard shadows, no flash, and the sunlit area beyond blown out several stops brighter. 35mm film shot by a friend, 1985: grain, flat contrast, warm faded colour, cyan shadows, a slightly crooked and slightly too-tight frame that clips someone's elbow at the edge. Horizontal 4:3, knees up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'friends',
      'college',
      'group',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-friends-college-steps.webp',
      alt: 'A group of college friends with arms over each other on stone steps in 1985, one crouched at the front, in flat open shade',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position as the still — every arm stays connected to exactly the same person and shoulder it rests on in the still, with no new or missing limb appearing as the group moves. The shared laugh continues — one head tips back further, shoulders shake slightly — while the group's loose, uneven posture holds. Camera: static, or the faintest handheld sway, as if a friend is holding the camera rather than a tripod. Duration: 6 seconds, one continuous shot, no cuts. Add laughter and campus ambience — no directed dialogue, no music. Keep the same flat open-shade lighting, the blown-out background and 1985 film grain from the still throughout. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Once people stand close enough to put arms over shoulders, limb topology becomes the dominant failure — an extra arm appears, or a hand rests on a shoulder with no body behind it. Giving the model an explicit escape route ("or keep that hand out of frame entirely") matters as much as the rule itself, because a model that cannot render a correct hand will render a wrong one unless told it may omit it. The clipped elbow at the frame edge is the deliberate imperfection that sells the snapshot.',
    exampleOutput:
      'A relaxed, flatly lit group on steps with uneven posture and mixed expressions. Count arms and hands before sharing.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-friends-hostel-room',
    category: 'photo-trends',
    title: '1986 hostel room photo with a poster wall',
    description:
      'Bunk beds, a poster wall, a tape deck and one bare bulb. The cramped indoor group with completely different lighting from the outdoor frames.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry, no slimming, lightening or smoothing. Every visible arm must connect to exactly one person, anatomically correctly, and every visible hand must have five correctly formed fingers or be kept out of frame. Change only hair, clothes, pose and surroundings. Put us in a cramped Indian hostel room in 1986, packed onto a metal-framed bunk bed and a wooden chair: some sitting cross-legged on the lower bunk, one leaning down from the upper bunk, one on the floor against the bed frame. Mid-80s student hair, untidy and varied, no product. Indoor hostel clothes in washed-out whites, greys and faded blue — plain t-shirts, a striped tee, a lungi or track pants, one person in a half-buttoned shirt, rubber slippers, nobody dressed up. Around us a wall covered in overlapping film and cricket posters whose printed text is not legible, a shelf of stacked books, a portable twin-deck tape recorder with cassettes scattered beside it, a steel trunk under the bed, clothes on a line strung across the corner, a mug and a steel plate on the desk — cluttered and genuinely lived in. Light it with a single bare tungsten bulb hanging from the ceiling close above us, warm and harsh: it lights the tops of our heads and shoulders strongly, leaves our eye sockets in shadow, and falls off hard so the corners of the room go dark, with a weak secondary spill from a doorway on one side. No flash. 35mm film indoors at a slow shutter, 1986: coarse grain, heavy warm-orange tungsten cast, low shadow contrast, mild motion blur on one person, muddy blacks. No phone, no laptop, no modern posters. Horizontal 4:3.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'friends',
      'hostel',
      'group',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-friends-hostel-room.webp',
      alt: 'Friends packed onto a bunk bed in a cluttered 1986 hostel room with a poster wall, lit by a single bare hanging bulb',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position as the still — every arm and hand stays exactly as connected as it is in the still. The bare bulb overhead sways very slightly, its warm light and the shadow it casts moving faintly with it, and the cassette reels on the tape recorder on the floor keep turning. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add a faint cassette hiss and quiet room tone — no legible song, no dialogue. Keep the same hard top-down bulb light, shadowed eye sockets and coarse tungsten-cast grain from the still throughout; the poster wall behind must stay illegible. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'A single bare bulb hanging close above a group behaves nothing like studio light: it lights the tops of heads hard, drops the eye sockets into shadow, and falls off within a metre. Describing those three consequences produces a genuinely cramped interior, where "dim room lighting" returns an evenly lit room that could be anywhere. The poster wall is why illegibility is specified twice — a wall of posters is the single largest text-failure surface in the set.',
    exampleOutput:
      'A warm, coarse, cramped interior with hard top light, shadowed eye sockets and a cluttered poster wall.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-friends-gully-cricket',
    category: 'photo-trends',
    title: '1986 gully cricket group photo',
    description:
      'A chalk wicket on a compound wall, a taped tennis ball and dusty knees — with the motion blur that makes it read as film.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry. Faces may be sweaty and squinting in the sun, but every face must stay clearly recognisable and in focus. No slimming, lightening or smoothing. Every visible arm and leg must connect to exactly one person, anatomically correctly, and every visible hand must have five correctly formed fingers or be kept out of frame. Change only hair, clothes, pose and surroundings. Put us in a narrow Indian residential lane in 1986, late afternoon, standing loosely together for a photo after a match: one leaning on the bat, one with an arm around a friend, one crouched at the front holding the ball up toward the camera. Mid-80s hair, sweat-damp and pushed back off the forehead. Everyday play clothes in faded whites, red and navy stripes — plain and striped t-shirts, one bare-chested, shorts and rolled-up trousers, rubber slippers and one pair of canvas shoes, dusty knees and shins. Props: a well-used wooden bat with tape around the handle, a tennis ball wrapped in electrical tape, and three stumps chalked onto the wall rather than planted in the ground. Behind us a plastered compound wall with chalk wicket marks, a metal gate, a parked bicycle and washing hung from a first-floor balcony. Low late-afternoon sun from the left, hard and warm, throwing long shadows across the lane, with several of us squinting into the light, a bright rim on the sunward shoulders and hair, and dust in the air catching the low light. 35mm film shot by someone's older brother, 1986: grain, punchy contrast, warm faded colour, cyan shadows, slight motion blur on the raised hand holding the ball, a slightly crooked frame. No modern sportswear or equipment. Horizontal 4:3.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'friends',
      'cricket',
      'street',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-friends-gully-cricket.webp',
      alt: 'A group of boys after a gully cricket match in a narrow Indian lane in 1986, with a chalk wicket on the wall and long late-afternoon shadows',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position as the still — every arm and leg stays connected to exactly the same person as in the still, and every visible hand keeps five correctly formed fingers. The raised hand finishes a small toss of the taped ball and catches it again, dust the sun already lit continues drifting, and one or two of us keep squinting into the low light. Camera: static, or the faintest handheld sway, as if a friend's older brother is holding the camera. Duration: 6 seconds, one continuous shot, no cuts. Add distant street sounds and children playing further off — no directed dialogue, no music. Keep the same hard late-afternoon shadows and punchy 1986 film grain from the still throughout. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Slight motion blur on one moving element is the most under-used authenticity signal available. Real 1986 film in late-afternoon light could not freeze a raised hand, so the blur belongs there — and because AI output is uniformly, unnaturally sharp, one genuinely soft element reads as photographic evidence. The chalked stumps are the cultural detail that makes it specific: gully cricket used a wall, and a model asked for "street cricket" will otherwise plant three wooden stumps in concrete.',
    exampleOutput:
      'A warm, hard-lit lane group with long shadows, squinting faces, a taped ball and one softly blurred raised hand.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-friends-restaurant-table',
    category: 'photo-trends',
    title: '1987 friends photo at a restaurant table',
    description:
      'Rexine booth seating, a formica table and a waiter’s flash — the night-out group shot with the hardest flash in the set.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities. Keep each face exactly as it is — same features, skin tone, age and natural asymmetry, no slimming, lightening or smoothing. Every visible arm must connect to exactly one person, anatomically correctly, and every visible hand must have five correctly formed fingers or stay below the table edge. Change only hair, clothes, jewellery, pose and surroundings. Put us in a mid-range Indian restaurant in 1987, evening, squeezed into a curved rexine booth around one table, leaning in toward the centre and all turning to face the camera as a waiter takes the photo, with mixed expressions — two laughing, the rest smiling. Mid-80s going-out styling, varied across the group, crown volume, side partings, one big permed head, visible hairspray sheen. Smart evening clothes in bold prints of teal, maroon and cream — wide-collared printed shirts, a padded-shoulder blouse, a light blazer, statement earrings and thin chains. On the table: steel water glasses, a bottle of orange soft drink with a paper straw, small steel bowls, a formica top with a laminate pattern and a bill folder at the edge whose text is not legible. Behind us dark wood panelling, a wall mirror reflecting a partial back of a head, a framed print and a pendant lamp low over the next table. Light it with a hard direct unbounced camera flash fired from close range across the table: the nearest faces and the near edge of the table are noticeably brighter and slightly over-exposed while the people furthest from the camera are dimmer, a hard compact shadow falls on the booth backrest behind each head, and light falls off steeply so the rest of the restaurant is nearly dark, with a single warm pendant lamp glowing in the background. 35mm film at night with flash, 1987: grain, warm-magenta cast, halation blooming off the glasses, dense shadows, and slightly red eyes on one or two of us. No phone, no modern branding. Horizontal 4:3.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'friends',
      'restaurant',
      'group',
      'night',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-friends-restaurant-table.webp',
      alt: 'Friends squeezed into a rexine restaurant booth in 1987, lit by a hard direct flash with the nearest faces brightest',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position as the still — every arm stays connected to exactly the same person as in the still, and hands stay above the table edge or visibly correct. The shared laughter continues, the steel glasses on the table catch a faint afterglow from the waiter's flash as hands shift slightly, and the pendant lamp in the background flickers once. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add restaurant murmur and the clink of glasses — no directed dialogue, no music. Keep the same hard cross-table flash falloff, the near-to-far brightness gradient and the warm-magenta 1987 grain from the still throughout. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'A flash fired across a table produces a specific exposure gradient — near subjects hot, far subjects dim — that models will not reproduce unless the unevenness is named. Uniformly exposed faces are the default and exactly what makes a flash-lit group read as a modern composite. Red eye is the deliberate flaw: direct flash close to the lens genuinely caused it in 1987, almost nobody prompts for it, and a hint of it is very hard to dismiss as a filter.',
    exampleOutput:
      'A hard flash-lit booth with a near-to-far brightness gradient, individual head shadows on the backrest, and a touch of red eye.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-birthday-party-1986',
    category: 'photo-trends',
    title: '1986 Indian birthday party snapshot',
    description:
      'Paper hats, a cream cake, crepe streamers and a hard flash. The candle-plus-flash lighting is what sets this apart.',
    promptText: `Use my uploaded photo. Count the people in it and render exactly that many — no more, no fewer. Anchor each face to its counterpart by left-to-right order. Do not merge, average, swap or blend any two identities. Keep each face exactly as it is — same features, skin tone and natural asymmetry — and keep every person's visible age exactly as it appears: do not make an adult look like a child or a child look older. Paper hats may be worn but must not cover any part of any face. No slimming, lightening or smoothing. Change only hair, clothes, pose and surroundings. Put us at an Indian home birthday party in 1986, crowded around a table pushed against a wall, everyone leaning in toward the cake, one person mid-clap and the birthday person poised to blow out the candles. Neatly done 1986 party styling for each age — oiled and combed on the children, crown volume on the adults, a ribbon on one. New party clothes in pink, yellow and white: a stiff frock with a sash, a pressed shirt tucked into shorts, a printed saree or salwar kameez on the adults, and conical paper party hats with elastic chin straps worn pushed back off the forehead. On the table a cream-frosted cake with piped rosettes and lit candles, paper plates, glass bottles of orange soft drink with paper straws and a packet of wafers. Behind us crepe paper streamers taped in loops across the wall, a hand-lettered paper banner whose text is not legible, a balloon or two and a textured distemper wall. Two light sources: a hard direct on-camera flash fired from a few feet away, flat-lighting every face, over-exposing the nearest shoulder and the cake frosting and throwing a hard compact shadow behind each head onto the wall; and the small warm glow of the lit candles from below, just visible on the undersides of the nearest chins and on the cake, with steep falloff into darkness at the frame edges. 35mm film indoors with flash, 1986: grain, warm-yellow cast, halation around the candle flames, faded colour, lifted blacks. No modern packaging, no foil balloons. Horizontal 4:3.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'birthday',
      'family',
      'children',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-birthday-party-1986.webp',
      alt: 'A family crowded around a candlelit cream cake at a 1986 Indian home birthday party with paper hats and crepe streamers, lit by hard flash',
      aspectRatio: '4:3',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Count the people in the still and animate exactly that many, anchored to the same left-to-right position as the still — paper hats may sit exactly as they do in the still but must never slide down to cover a face. The lit candles on the cake flicker and gutter slightly, the birthday person leans in a fraction further as if about to blow them out, and one person mid-clap finishes the clap. Camera: locked off, no movement. Duration: 6 seconds, one continuous shot, no cuts. Add children's chatter and quiet laughter — no sung 'happy birthday'-style lyrics of any kind, no directed dialogue, no music. Keep the same flat on-camera-flash exposure, the faint candle-glow under the nearest chins and the warm-yellow 1986 grain from the still throughout. Output: horizontal 4:3, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Flash and candlelight together are why this frame looks unlike the other flash prompts. A camera flash overwhelms candle flames almost completely, so the correct rendering is a flat flash-lit scene with only a faint warm trace under the nearest chins — not the warm candle-lit glow people imagine. Asking for that hierarchy is more accurate and more convincing. The paper-hat clause exists because conical hats slide forward over foreheads and eyes in generated images.',
    exampleOutput:
      'A flat flash-lit party frame with hard head shadows on a streamered wall, blown-out frosting and a faint candle glow under the chins.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-school-photo-day',
    category: 'photo-trends',
    title: '1985 school photo-day portrait',
    description:
      'Uniform, tie, oiled hair and a mottled backdrop in the school hall — with the age lock that keeps you your real age.',
    promptText: `Use my uploaded photo. Keep my face exactly as it is — same bone structure, nose, eyes, lips, skin tone and natural asymmetry. Age is part of identity here: keep my visible age exactly as it appears in the photo. Do not make an adult look like a schoolchild and do not make a child look older — if the uploaded photo shows an adult, render an adult wearing this uniform in this setting, because the setting does not change my age. No slimming, lightening or smoothing. Change only my hair, clothes, pose and background. Make this a 1985 Indian school photo-day portrait: hair oiled and firmly combed, a sharp side parting for short hair or two tight plaits tied with folded cloth ribbons for long hair, flat and neat with no volume. A 1985 school uniform — a pressed white cotton shirt buttoned to the collar, a maroon-and-gold striped tie knotted slightly too tightly, a navy pullover or a pinafore over the shirt, and a small embroidered school crest on the pocket rendered as an indistinct woven patch with no legible lettering. Nothing in my hands. I am sitting on a wooden stool, body angled about twenty degrees from camera, shoulders squared, hands flat on my thighs, head turned back to the lens and level, with a small slightly self-conscious closed-mouth smile — the expression of someone told to sit still. Behind me a mottled grey-blue canvas backdrop rolled down against the hall wall, with a sliver of skirting board visible at the very bottom edge. Light it with a single portable flash on a stand, high and to the left, fired into a small umbrella — harder than a studio softbox but softer than direct flash: a defined shadow under my nose, a soft shadow on the backdrop behind my right shoulder, and no fill on the opposite side so the shadow side of my face stays a little dark. 35mm film printed small on matte paper, 1985: grain, slightly flat contrast, warm skin, faded colour, and the faint texture of matte print paper. Vertical 3:4, mid-chest up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'school',
      'uniform',
      'portrait',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-school-photo-day.webp',
      alt: 'A 1985 school photo-day portrait in white shirt, striped tie and navy pullover against a grey-blue mottled canvas backdrop',
      aspectRatio: '3:4',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep my face and my real visible age completely unchanged for the whole clip — the school uniform and setting must not make me look younger or older as I move. Movement stays minimal and posed: a slow, natural blink, my hands settling a fraction on my thighs, the slightly self-conscious smile holding steady. Camera: locked off, no movement. Duration: 4 seconds, one continuous shot, no cuts. No sound, or at most a very quiet school-hall hush — no music, no dialogue. Keep the same single-flash-and-umbrella lighting, the mottled canvas backdrop and the flat 1985 film grain from the still throughout. Output: vertical 3:4, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'A school setting is the strongest age-pull in the category: put a uniform and a school hall in a prompt and models quietly return a child even when the uploaded photo shows a forty-year-old. That is the joke most people actually want — themselves, now, in their old uniform — and it only works if the age holds. So the age lock is stated twice with an explicit resolution rule: the setting does not change my age. The crest is declared an indistinct woven patch to remove a small text surface before it goes wrong.',
    exampleOutput:
      'A formal umbrella-flash portrait against grey-blue canvas with flat oiled hair and a tight tie — and your real age intact.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-father-and-child-portrait',
    category: 'photo-trends',
    title: '1986 parent and child studio portrait',
    description:
      'Two generations, one stool, one hard key — built around the height and age relationship models flatten by default.',
    promptText: `Use my uploaded photo, which has two people of different ages in it. Anchor each face to its counterpart by position — left stays left, right stays right. Do not merge, average, swap or blend the two identities. Keep each face exactly as it is — same features, skin tone and natural asymmetry. Age and scale are part of identity here: keep each person's visible age exactly as it appears, do not make the older person younger or the younger person older, do not narrow the age gap, and keep the height and body-scale difference true to their ages so the younger person is visibly smaller. A family resemblance may show, but the two faces must remain clearly distinct individuals. No slimming, lightening or smoothing on either. Change only hair, clothes, pose and background. Make this a 1986 Indian portrait-studio photograph of the two of us: a combed side parting with some crown volume on the adult, flat oiled and neatly parted hair on the child. Coordinated navy and cream formalwear — a wide-lapel blazer over an open-collar shirt on the adult, a pressed small-collared shirt on the child, a metal watch on the adult, nothing in either pair of hands. The adult sits on a stool angled about thirty degrees from camera; the child stands beside and slightly in front, leaning back against the adult's knee, with the adult's hand resting on the child's shoulder. Both heads turned to the lens at clearly different heights, the adult's chin level and the child's slightly lifted, with composed closed-mouth smiles. Behind us a hand-painted mottled canvas backdrop in blue and grey-blue, lighter behind the heads. A hard key high and forty-five degrees left, placed high enough to shape the adult's face without leaving the shorter child in shadow, a fill from the right at a third of the key, a hair light rimming both crowns, a background light making the halo, and catchlights in all four eyes. Render the hand on the shoulder fully and correctly with five fingers. Medium-format film on glossy paper, 1986: fine grain, warm skin tones, mild vignetting. Vertical 3:4, from the adult's waist up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'family',
      'parent-child',
      'studio-portrait',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-father-and-child-portrait.webp',
      alt: 'A parent seated on a stool with a child leaning against their knee in a 1986 Indian studio portrait against mottled blue canvas',
      aspectRatio: '3:4',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep both our faces, our real visible ages and our height difference completely unchanged for the whole clip — anchor each to the same position as the still, and do not let the two faces drift toward looking related or the same age. The child shifts very slightly against the adult's knee, the adult's hand stays resting steadily on the child's shoulder, and both settle a fraction further into the composed smile. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. No sound, or at most a very quiet studio-room hush — no music, no dialogue. Keep the same hard key adjusted for both heights, the catchlights in all four eyes and the fine medium-format grain from the still throughout. Output: vertical 3:4, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'Two people of different ages trigger a compound failure: the model narrows the age gap, equalises the heights, and pushes the two faces toward each other because it reads them as related. Each part needs naming. The clause allowing family resemblance while requiring clearly distinct individuals handles the subtle one — the output can be technically age-correct and still show two versions of the same face. The lighting note is practical: a key placed to flatter a seated adult leaves a shorter child underlit.',
    exampleOutput:
      'A warm studio two-up with a clear height and age difference, both faces distinct, and a correctly rendered hand on the shoulder.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
  {
    slug: 'photo-trends-80s-mother-daughter-doorway',
    category: 'photo-trends',
    title: '1986 mother and daughter in a doorway',
    description:
      'Matching sarees, a painted doorframe and soft morning light — written so the two faces stay two people, not two ages of one.',
    promptText: `Use my uploaded photo, which has two people of different ages in it. Anchor each face to its counterpart by position — left stays left, right stays right. Do not merge, average, swap or blend the two identities. Keep each face exactly as it is — same features, skin tone and natural asymmetry. Age is part of identity here: keep each person's visible age exactly as it appears, and if the older person has grey hair, lines or folds, keep every one of them — do not rejuvenate, smooth or re-pigment, and do not narrow the age gap. A family resemblance may show, but the two faces must remain clearly distinct individuals, not two ages of one face. No slimming, lightening or beautifying on either. Change only hair length and grooming, clothes, jewellery, pose and surroundings. Put us in the doorway of an Indian house in 1986, morning: hair drawn back into a low bun with the grey fully retained on the older of us, a loose plait or soft curls with crown volume on the younger. Coordinated sarees in soft cream and pale blue, light cotton or silk worn simply with the pallu over one shoulder, small gold studs and thin bangles on both, a bindi on each and a thin chain, one of us resting a hand lightly on the other's shoulder or forearm. We stand in the open doorway, the older slightly ahead and the younger just behind and to one side, shoulders angled inward, both looking toward the camera with calm unforced expressions. Around us a painted wooden doorframe with a brass latch, a low threshold step, a small rangoli on the ground outside, a hanging toran and the dim interior of the house behind. Soft morning daylight from outside and slightly to the left is the only source: both faces gently and evenly lit, and the interior behind falling off quickly into deep shadow several stops darker, so we read bright against a dark doorway. No flash, no overhead light. 35mm film, 1986: grain, gentle contrast, warm faded colour, cyan shadows in the dark interior, slight vignetting. Vertical 3:4, knees up.`,
    variables: [],
    targetTools: [
      'ChatGPT (GPT Image)',
      'Nano Banana (Gemini 3.1 Flash Image)',
      'Gemini app',
    ],
    tags: [
      '80s',
      'retro',
      'photo-trend',
      'chatgpt',
      'nano-banana',
      'family',
      'mother-daughter',
      'portrait',
      'india',
    ],
    exampleImage: {
      src: '/prompt-images/photo-trends/80s-mother-daughter-doorway.webp',
      alt: 'A mother and daughter in cream and pale blue sarees standing in a painted doorway of an Indian house in soft 1986 morning light',
      aspectRatio: '3:4',
    },
    videoPrompt: {
      promptText: `Animate the photo exactly as generated. Keep both our faces and our real visible ages completely unchanged for the whole clip — anchor each to the same position as the still, keep every line and any grey hair on the older of us exactly as it appears, and do not let the two faces drift toward looking like the same age. Soft morning light moves very slightly as a breeze stirs both our pallus and loose hair, and the dim interior behind the doorway stays several stops darker than we are. Camera: locked off, no movement. Duration: 5 seconds, one continuous shot, no cuts. Add quiet morning ambience and distant birdsong — no dialogue, no music. Keep the same single-source morning light, the doorway's dark interior falloff and the gentle 1986 film grain from the still throughout. Output: vertical 3:4, matching the still's framing, loop-safe.`,
      targetTools: ['Veo 3.1', 'Kling 3.0', 'Runway Gen-4.5'],
    },
    whyItWorks:
      'This is where the "two ages of one face" failure is most likely, because a real family resemblance gives the model permission to converge the two faces, and the result is uncanny in a way people notice without being able to say why. Naming the failure precisely is more effective than a generic instruction not to merge identities. The doorway framing then does the lighting work for free: a bright exterior against a dark interior gives natural separation and puts both faces in the same soft light.',
    exampleOutput:
      'A soft, warm doorway portrait with both figures bright against a dark interior, the age gap visible and the two faces clearly distinct.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT Image', date: '2026-09-10' },
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini app',
        date: '2026-09-10',
      },
    ],
    changelog: [
      { date: '2026-09-09', note: 'Written for the September 2026 80s photo trend.' },
      {
        date: '2026-09-10',
        note: 'Rewritten as a single copy-and-go paragraph with no fill-ins, and paired with an example image.',
      },
    ],
  },
]
