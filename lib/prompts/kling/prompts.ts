import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'kling-high-motion-action-scene',
    category: 'kling',
    title: 'Generate a high-motion chase or action beat that holds together',
    description:
      "A Kling 3.0 brief built for fast, physical motion — the scenario where most video models fall apart — using Kling's strength in motion coherence and a single dominant camera move.",
    promptText:
      'Subject and action: {{subject}} sprinting {{direction_detail}}, {{secondary_action}}, muscles and clothing reacting naturally to the speed.\nCamera: fast tracking shot running parallel to the subject at shoulder height, matching their speed exactly, slight handheld wobble for urgency.\nEnvironment and lighting: {{setting}}, harsh directional sunlight casting long fast-moving shadows.\nStyle and mood: gritty live-action realism, high shutter-speed feel, tense and kinetic.\nAudio: rapid footfalls, heavy breathing, and wind noise from the tracking speed, no score.',
    variables: [
      {
        name: 'subject',
        description: 'Who or what is performing the action',
        example: 'a courier in a reflective vest',
        required: true,
      },
      {
        name: 'direction_detail',
        description: 'The path or direction of the motion, for continuity',
        example: 'down a narrow alley between two market stalls',
        required: true,
      },
      {
        name: 'secondary_action',
        description: 'A second physical detail happening at the same time',
        example: 'vaulting over a low crate without breaking stride',
        required: true,
      },
      {
        name: 'setting',
        description: 'The location the action takes place in',
        example: 'a crowded outdoor market at midday',
        required: true,
      },
    ],
    targetTools: ['Kling 3.0'],
    tags: ['video', 'action', 'high-motion', 'kling', 'chase-scene'],
    whyItWorks:
      'Kling 3.0\'s advantage over other current video models is specifically motion physics and limb/fabric coherence during fast movement, so this prompt front-loads concrete physical detail ("muscles and clothing reacting naturally," "vaulting over a low crate") that gives the motion model something to simulate rather than invent. The camera line names exactly one movement — a tracking shot matched to subject speed — because pairing a second move (like a simultaneous zoom or crane) with already-fast subject motion is what causes Kling and every comparable model to smear geometry or lose the subject mid-shot. Naming a specific direction and path ("down a narrow alley") also anchors spatial continuity across the clip\'s duration, which matters far more in a running/chasing shot than in a static product shot.',
    exampleOutput:
      'A 6-second handheld-feel tracking shot staying level with the courier as they weave through stall legs and shoppers, vest catching the sun, a low crate vaulted cleanly mid-shot, footsteps and breath audible over ambient market noise, shadows sweeping past in the harsh midday light.',
    verifiedAgainst: [{ tool: 'Kling 3.0', version: '3.0', date: '2026-07-22' }],
    changelog: [{ date: '2026-07-22', note: 'Published, verified against Kling 3.0.' }],
  },
  {
    slug: 'kling-product-demo-motion-sequence',
    category: 'kling',
    title: 'Show a product actually being used in a multi-step motion sequence',
    description:
      "A Kling 3.0 prompt for a short demo clip showing a hand-held or wearable product through a real sequence of use — built around Kling's motion-continuity strength rather than a single static beauty shot.",
    promptText:
      'Subject and action: a pair of hands {{usage_sequence}} with a {{product}}, each step flowing directly into the next without a cut.\nCamera: slow orbit around the hands at a fixed distance, keeping the product centered as the angle changes.\nEnvironment and lighting: {{setting}}, soft even lighting with no harsh shadows crossing the product.\nStyle and mood: clean, realistic, documentary-style product demonstration, no exaggerated motion.\nAudio: the natural sound of {{product_sound}} synced to each step of the sequence, quiet room tone underneath, no music.',
    variables: [
      {
        name: 'usage_sequence',
        description: 'The 2-3 sequential actions showing the product in use',
        example: 'unfolding, then adjusting a strap, then closing',
        required: true,
      },
      {
        name: 'product',
        description: 'The product being demonstrated',
        example: 'compact tripod stand',
        required: true,
      },
      {
        name: 'setting',
        description: 'The demo environment',
        example: 'a plain wooden desk near a window',
        required: true,
      },
      {
        name: 'product_sound',
        description: 'The realistic mechanical/tactile sound the product makes when used',
        example: 'the tripod legs clicking into place',
        required: true,
      },
    ],
    targetTools: ['Kling 3.0'],
    tags: ['video', 'product-demo', 'motion', 'kling', 'e-commerce'],
    whyItWorks:
      'Sequencing a specific 2-3 step action ("unfolding, then adjusting a strap, then closing") rather than one generic verb like "being used" gives Kling 3.0 a concrete motion path to hold hand and product geometry consistent across, which is exactly the physical-continuity strength the model is built for — a vague action prompt leaves too much for the model to invent between frames, which is where hands and product shape are most likely to drift. Naming a single camera movement (a slow orbit at fixed distance) rather than combining it with a push-in or handheld shake keeps the demo legible: the whole point of a product demo is that the viewer can track what the hands are doing, and a second simultaneous camera move competes for exactly the visual attention the demo needs on the product. Describing the product\'s own mechanical sound ("legs clicking into place") synced to the visual steps, instead of a generic sound cue, is what makes native audio read as documentation rather than stock footage — it\'s the same detail a real product-demo video relies on to feel trustworthy.',
    exampleOutput:
      'An 8-second orbiting shot around a pair of hands on a sunlit desk: the tripod unfolds with an audible click, a strap gets adjusted with a soft snap, then the legs fold closed again, each sound landing in sync with the motion, quiet room tone throughout and no music.',
    verifiedAgainst: [{ tool: 'Kling 3.0', version: '3.0', date: '2026-07-22' }],
    changelog: [{ date: '2026-07-22', note: 'Published, verified against Kling 3.0.' }],
  },
  {
    slug: 'kling-ugc-testimonial-style-clip',
    category: 'kling',
    title: `Generate a UGC-style testimonial clip that doesn't read as AI-made`,
    description: `A Kling 3.0 brief for a phone-shot-looking testimonial clip — deliberately imperfect framing and natural delivery instead of the polished symmetry that immediately flags a video as generated.`,
    promptText: `Subject and action: {{creator_persona}} holding a {{product_or_service}} at chest height, speaking directly to camera, {{key_line}}, pausing naturally between phrases as if thinking of the next sentence rather than reading a script.
Camera: static handheld phone-style shot, held slightly off-center and tilted 2-3 degrees, {{camera_flaw}} present throughout — do not correct or stabilize it.
Environment and lighting: {{setting}}, single practical light source (window or lamp), visible minor exposure flicker, no studio evenness.
Style and mood: casual first-person UGC, unpolished and sincere, not commercial-grade.
Audio: room tone with slight ambient noise from the setting, voice slightly close-mic'd and a little uneven in volume, no music, no professional voiceover clarity.
Do not: center the subject perfectly, smooth out the camera wobble, or add cinematic color grading — any of these will make the clip read as an ad rather than UGC.`,
    variables: [
      {
        name: 'creator_persona',
        description: `Who is speaking to camera, described physically`,
        example: `a woman in her late 20s in a hoodie, sitting on a couch`,
        required: true,
      },
      {
        name: 'product_or_service',
        description: `The item being shown/discussed`,
        example: `a small ceramic travel mug`,
        required: true,
      },
      {
        name: 'key_line',
        description: `The core thing they say or react to, described as an action/beat not a script`,
        example: `reacting genuinely surprised at how long the coffee stays hot`,
        required: true,
      },
      {
        name: 'camera_flaw',
        description: `One specific, small imperfection to keep in the shot for authenticity`,
        example: `a slight autofocus hunt in the first second`,
        required: true,
      },
      {
        name: 'setting',
        description: `The real-feeling location the clip is shot in`,
        example: `a cluttered home office with laundry visible in the background`,
        required: false,
      },
    ],
    targetTools: [`Kling 3.0`],
    tags: [`video`, `ugc`, `testimonial`, `kling`, `social-ads`],
    whyItWorks: `Kling 3.0's default tendency, like most video models, is to resolve ambiguous framing toward symmetry and smooth, studio-even motion — which is exactly the visual signature that makes a generated clip read as an ad rather than user-generated content. This prompt fights that default by naming a specific imperfection (a tilt in degrees, a described autofocus hunt) and explicitly instructing the model not to correct it, because a vague instruction like "make it look like UGC" gives the model nothing concrete to hold onto and it will default back to its cleanest interpretation. Describing the delivery as a paused, thinking-through-it reaction rather than a scripted line also matters mechanically: Kling's audio-visual sync is built around natural speech cadence, and feeding it a beat-based description ("reacting genuinely surprised") produces more organic mouth movement and timing than a quoted script line would, which tends to generate over-articulated, presenter-style delivery instead. The explicit do-not list at the end functions as a guardrail against the model's own smoothing bias re-asserting itself over the course of generation.`,
    exampleOutput: `A 7-second handheld clip: a woman on a couch holds up a ceramic mug, camera slightly tilted and hunting focus for the first second, she pauses mid-sentence then says the coffee's still hot with a small surprised laugh, uneven window light, room tone audible, no music.`,
    verifiedAgainst: [
      { tool: 'Kling 3.0', version: '3.0', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against Kling 3.0.`,
      },
    ],
  },
  {
    slug: 'kling-broll-cutaway-lighting-matched',
    category: 'kling',
    title: `Generate a detail cutaway that visually matches an existing hero shot for editing`,
    description: `A Kling 3.0 brief for a single b-roll cutaway built to cut seamlessly against a separately-shot or separately-generated main clip, using explicit lighting and color anchors instead of leaving continuity to chance.`,
    promptText: `1. Anchor: this clip must visually match a reference scene described as {{hero_shot_reference}} — same light temperature and direction, same general color palette.
2. Subject and action: a close-up on {{subject_detail}}, {{action}}, filling most of the frame with shallow depth of field.
3. Camera: locked-off or minimal slow push-in only, no pan, no whip, so the shot cuts cleanly against static or slow-moving footage.
4. Environment and lighting: {{setting}}, lighting direction and warmth matched to the anchor description in step 1, not independently lit.
5. Style and mood: same realism level as the anchor shot — if the hero shot is naturalistic, this must be naturalistic too, not stylized.
6. Duration and audio: {{duration}} seconds, ambient sound only from the object/action itself, no dialogue, no music, so it can be layered under a voiceover in the edit.`,
    variables: [
      {
        name: 'hero_shot_reference',
        description: `A short description of the main shot this cutaway needs to match visually`,
        example: `warm late-afternoon window light, wide shot of a barista at a counter`,
        required: true,
      },
      {
        name: 'subject_detail',
        description: `The specific close-up detail being shown`,
        example: `steam rising off a poured espresso shot`,
        required: true,
      },
      {
        name: 'action',
        description: `What's physically happening in the close-up`,
        example: `milk being poured slowly into the cup, forming a spiral`,
        required: true,
      },
      {
        name: 'setting',
        description: `The physical location, consistent with the hero shot's setting`,
        example: `a wooden coffee counter under a window`,
        required: true,
      },
      {
        name: 'duration',
        description: `Target clip length in seconds`,
        example: `4`,
        required: false,
      },
    ],
    targetTools: [`Kling 3.0`],
    tags: [`video`, `b-roll`, `cutaway`, `kling`, `editing`],
    whyItWorks: `The single biggest reason generated b-roll fails to cut into a real edit is lighting and color mismatch against the shot it's meant to sit beside, so this prompt puts the anchor description first, before the subject is even introduced, forcing Kling 3.0 to treat matched light temperature and direction as the governing constraint rather than an afterthought applied after the model has already committed to its own lighting choice. Restricting the camera to locked-off or a single slow push-in is a deliberate limitation on Kling's tendency to add its own dynamic camera language to close-up shots — a whip pan or rack-focus flourish looks great in isolation but breaks the edit rhythm when it's competing against a static or slow-moving hero shot. Requiring ambient/object sound only, with no music or dialogue, is what makes the clip actually usable as a layer in a timeline: a generated clip with its own music baked in has to be re-recorded or has audio bleed that fights whatever track the editor adds underneath, whereas isolated object sound can simply be mixed low or muted entirely.`,
    exampleOutput: `A 4-second locked-off close-up: milk pouring into an espresso shot forming a slow spiral, warm late-afternoon light matching the counter scene, shallow focus on the cup rim, only the sound of pouring liquid, no music or voice.`,
    verifiedAgainst: [
      { tool: 'Kling 3.0', version: '3.0', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against Kling 3.0.`,
      },
    ],
  },
  {
    slug: 'kling-scroll-stopping-hook-shot',
    category: 'kling',
    title: `Generate a two-second hook clip built to stop a thumb mid-scroll`,
    description: `A Kling 3.0 prompt focused entirely on the opening beat of a video — the fraction of a second that decides whether a viewer keeps scrolling — rather than treating the hook as the first few seconds of a longer script.`,
    promptText: `Open cold, mid-action, no establishing shot: {{opening_visual}} is already happening the instant the clip starts, as if the viewer opened the app one second too late to see it begin. Within the first beat, introduce {{unexpected_element}} so the eye has something to resolve immediately rather than settle. The camera does one thing only — {{camera_move}} — fast enough to feel urgent but not so fast the subject smears. Set this in {{setting}}, lit so the main subject is unmistakably the brightest thing in frame even in a small phone thumbnail. No slow build, no scene-setting pan, no title card: the first frame and the last frame of this clip should each work as a standalone still that makes someone want to know what happens next.`,
    variables: [
      {
        name: 'opening_visual',
        description: `The mid-action moment the clip opens on, already in progress`,
        example: `a stack of plates wobbling mid-fall before being caught`,
        required: true,
      },
      {
        name: 'unexpected_element',
        description: `The specific detail that makes the eye do a double-take`,
        example: `the hand catching it belongs to someone walking by, not the person who dropped it`,
        required: true,
      },
      {
        name: 'camera_move',
        description: `The single camera movement for the whole clip`,
        example: `a quick whip-pan from the falling stack to the catching hand`,
        required: true,
      },
      {
        name: 'setting',
        description: `Where this is happening`,
        example: `a busy restaurant kitchen pass`,
        required: true,
      },
    ],
    targetTools: [`Kling 3.0`],
    tags: [`video`, `hook`, `social-media`, `kling`, `short-form`],
    whyItWorks: `Feed algorithms and viewer attention both punish anything that reads as a wind-up, so instructing Kling 3.0 to start mid-action instead of establishing the scene removes the single most common reason generated hooks underperform: a beautiful but slow first two seconds that a thumb has already scrolled past by the time anything interesting happens. Naming exactly one camera move, and pairing it with an explicit note about not smearing the subject, works with rather than against Kling's known motion trade-off — fast whip-pans are one of the areas where video models are most prone to losing subject shape, so calling it out directly reduces the chance the model either slows the move down (killing the urgency) or blurs the payoff (killing the reveal). The instruction that both the first and last frame should work as a standalone still is a practical proxy for thumbnail and loop performance — it forces genuinely strong, legible composition at both boundary frames rather than a clip that only looks good in motion, which is what actually gets tested when a platform auto-selects a cover frame.`,
    exampleOutput: `A tight 2-second clip: a stack of plates already mid-tip over a kitchen pass, whip-pan reveals a passing server's hand catching them a half-second before they'd have shattered, bright pass-light keeping the catch unmistakably legible even at thumbnail size.`,
    verifiedAgainst: [
      { tool: 'Kling 3.0', version: '3.0', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Kling 3.0.`,
      },
    ],
  },
  {
    slug: 'kling-match-cut-transition-anchor',
    category: 'kling',
    title: `Generate a clip with a built-in match-cut anchor for a seamless transition`,
    description: `A Kling 3.0 brief that designs the exit frame of a clip specifically so it can be cut against a second shot on matching shape or motion, instead of leaving the transition to be patched together in post.`,
    promptText: `Subject and action: {{subject}} performing {{exit_action}}, building toward a single clear terminal pose or shape at the very last frame.
Transition anchor: the final frame must isolate {{matching_shape_or_motion}} — this exact shape, position, or motion direction is what the next clip will cut into, so it needs to be unambiguous and centered, not incidental.
Camera: movement that decelerates into the final frame rather than cutting off mid-motion, so the anchor frame reads as a deliberate held beat, not an interrupted one.
Environment and lighting: {{setting}}, lit so the anchor shape stays clearly readable even as motion slows.
Style and mood: consistent, grounded realism — no stylistic flourish on the exit frame that a second, differently-styled clip couldn't plausibly continue from.
Audio: sound builds and lands on the final beat, ending on or just before the anchor frame rather than trailing past it, so the cut doesn't clip audio mid-word or mid-sound.`,
    variables: [
      {
        name: 'subject',
        description: `Who or what is on screen`,
        example: `a dancer mid-spin`,
        required: true,
      },
      {
        name: 'exit_action',
        description: `The action building toward the transition moment`,
        example: `spinning and raising both arms overhead`,
        required: true,
      },
      {
        name: 'matching_shape_or_motion',
        description: `The specific shape/pose/direction the next clip needs to match on cut`,
        example: `arms fully extended overhead forming a V, spin direction left-to-right`,
        required: true,
      },
      {
        name: 'setting',
        description: `Where the shot takes place`,
        example: `an empty rooftop at dusk`,
        required: true,
      },
    ],
    targetTools: [`Kling 3.0`],
    tags: [`video`, `transitions`, `match-cut`, `kling`, `editing`],
    whyItWorks: `A match cut only reads as intentional if the exit frame is unambiguous, so naming the exact shape and direction that needs to survive into the next shot — rather than trusting the model to land on something cuttable by chance — turns a lucky edit into a repeatable one. Explicitly asking for deceleration into the final frame instead of an abrupt stop matters because Kling 3.0, like other motion-forward models, tends to keep momentum building right up to the clip boundary; without that instruction the last frame is often mid-motion and blurred, which is unusable as a cut point since there's no clean shape for the second clip to inherit. Ending the audio on or just before the anchor frame rather than letting it trail is a smaller but equally practical detail: audio that runs past the visual cut point creates an audible pop or truncated word the instant the editor cuts to the next clip, and it's cheaper to prevent at generation time than to patch with a fade in post.`,
    exampleOutput: `A dancer on a dusk rooftop spins left-to-right, arms rising through the motion and landing fully extended overhead in a clean V exactly on the final frame, the spin decelerating into the hold, a rising musical swell resolving right as the pose lands.`,
    verifiedAgainst: [
      { tool: 'Kling 3.0', version: '3.0', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Kling 3.0.`,
      },
    ],
  },
  {
    slug: 'kling-vertical-reframe-repurpose',
    category: 'kling',
    title: `Regenerate a horizontal concept as a true vertical clip instead of a cropped one`,
    description: `A Kling 3.0 brief for turning an existing widescreen scene idea into a genuinely re-blocked 9:16 clip — repositioning the action for a tall frame rather than just cropping the sides off a horizontal shot.`,
    promptText: `Original concept: {{original_scene_description}} was shot or conceived for a wide 16:9 frame. This version re-blocks it for a 9:16 vertical frame.
Subject and action: {{subject}}, repositioned so the main action sits in the vertical center third of frame rather than spread horizontally — do not simply imagine a wide shot and crop the sides.
Camera: a single vertical-friendly move (slow tilt or straight push-in) instead of the horizontal pan or wide two-shot the original concept implied.
Focal point: keep {{vertical_focal_point}} as the one element the eye should land on throughout, since a tall frame can't hold two separated points of interest the way a wide frame could.
Environment and lighting: {{setting}}, background simplified or blurred so it doesn't compete for space in the narrow frame.
Style and mood: same tone as the original concept, but staged for a viewer holding a phone vertically, not watching a shrunken widescreen video.
Audio: dialogue or key sound centered and dry, no elements that rely on wide stereo separation.`,
    variables: [
      {
        name: 'original_scene_description',
        description: `The horizontal scene or shot this is being repurposed from`,
        example: `a wide two-shot of two coworkers walking and talking across an office floor`,
        required: true,
      },
      {
        name: 'subject',
        description: `Who/what is in the re-blocked version`,
        example: `one coworker, walking toward camera, the other trailing slightly behind`,
        required: true,
      },
      {
        name: 'vertical_focal_point',
        description: `The single element the eye should track in the tall frame`,
        example: `the lead coworker's face and the object they're holding`,
        required: true,
      },
      {
        name: 'setting',
        description: `Where the scene takes place`,
        example: `a narrow office hallway with soft overhead lighting`,
        required: true,
      },
    ],
    targetTools: [`Kling 3.0`],
    tags: [`video`, `repurposing`, `vertical-video`, `kling`, `reels`],
    whyItWorks: `The most common failure in vertical repurposing is treating 9:16 as a crop of a 16:9 idea, which either clips the subject out of frame or leaves a tall, empty, awkwardly-blocked composition — this prompt heads that off by explicitly instructing Kling 3.0 to re-block the action around a single vertical focal point rather than imagining the wide version first and cutting it down. Collapsing a two-shot into a lead-and-trailing-subject composition is a deliberate concession to how much visual information a 9:16 frame can hold at once: a wide frame can give two people equal weight side by side, but a tall frame forces a hierarchy, and naming that hierarchy up front (one focal point, one secondary element trailing) is what keeps the re-generated clip from looking like a wide shot the model was straining to fit into portrait bounds. Simplifying the background and centering audio without relying on stereo separation both address the same underlying constraint — a vertical, typically phone-viewed clip has less peripheral frame and is usually heard through a single phone speaker, so visual and audio choices that depended on width or stereo width in the original concept need to be substituted with center-weighted equivalents.`,
    exampleOutput: `A vertical 9:16 clip: one coworker walks toward camera down a narrow, softly lit hallway holding a folder, a second coworker trailing a half-step behind and slightly out of focus, the background simplified to a plain wall, dialogue centered and clear.`,
    verifiedAgainst: [
      { tool: 'Kling 3.0', version: '3.0', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against Kling 3.0.`,
      },
    ],
  },
  {
    slug: 'kling-caption-safe-lower-third-framing',
    category: 'kling',
    title: `Generate a talking clip that keeps the lower third clear for caption overlays`,
    description: `A Kling 3.0 brief that composes the shot with caption placement in mind from the start, so the finished clip doesn't need to be re-framed or have its subject cropped awkwardly to make room for burned-in captions later.`,
    promptText: `Subject and action: {{speaker_description}} talking directly to camera about {{talking_point}}, {{gesture_detail}} kept above chest height so hand movement doesn't drop into the lower frame.
Framing: subject's face and shoulders framed in the upper two-thirds of the vertical frame; the bottom third of frame stays visually simple — plain background, no text, signage, or busy detail — since that space will carry burned-in captions after generation.
Camera: static or a very slow, minimal push-in only, so caption timing doesn't have to chase a moving subject.
Environment and lighting: {{setting}}, even front-facing light so the face reads clearly at small sizes once captions are added below it.
Style and mood: clear, direct, presenter-style delivery, unhurried pacing with natural pauses between sentences to give captions room to display one clean phrase at a time.
Audio: single clear voice, no background music competing with speech clarity, consistent volume throughout.`,
    variables: [
      {
        name: 'speaker_description',
        description: `Who is speaking, described physically`,
        example: `a man in his 30s in a plain t-shirt, seated`,
        required: true,
      },
      {
        name: 'talking_point',
        description: `What they're explaining or discussing, as a topic beat not a script`,
        example: `why most people over-water their houseplants`,
        required: true,
      },
      {
        name: 'gesture_detail',
        description: `A hand or body gesture to include, kept in the upper frame`,
        example: `counting off points on his fingers`,
        required: true,
      },
      {
        name: 'setting',
        description: `The background/location`,
        example: `a plain painted wall in a home office`,
        required: true,
      },
    ],
    targetTools: [`Kling 3.0`],
    tags: [`video`, `captions`, `framing`, `kling`, `talking-head`],
    whyItWorks: `Captions are almost always added after generation, so the framing decision has to be made now, at prompt time, rather than fixed later — a clip generated with gestures or background detail filling the lower third forces an editor to either shrink and crop the subject to make room for text or place captions over the speaker's hands, both of which look amateurish. Explicitly keeping gestures above chest height and specifying the bottom third stay visually plain gives Kling 3.0 a concrete compositional target instead of a vague "leave room for text," which the model has no way to interpret consistently on its own. Slowing the camera to static or minimal push-in and asking for natural pauses between sentences isn't just a delivery style choice — caption software times text to speech cadence, and a subject who talks in a continuous rush without pauses produces long, cramped caption lines, while natural sentence breaks let each caption chunk land as one clean, readable phrase.`,
    exampleOutput: `A static medium shot: a man in a plain t-shirt against a simple wall, upper two-thirds of frame, counting points off on his fingers at chest height while explaining over-watering, clear even lighting, unhurried pacing with a natural pause between each point, bottom third of frame left clean for captions.`,
    verifiedAgainst: [
      { tool: 'Kling 3.0', version: '3.0', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against Kling 3.0.`,
      },
    ],
  },
  {
    slug: 'kling-clean-audio-transcription-ready-clip',
    category: 'kling',
    title: `Generate a single-speaker clip with audio built for accurate auto-transcription`,
    description: `A Kling 3.0 brief that prioritizes clean, isolated speech and clear mouth articulation specifically so downstream subtitle-generation tools produce fewer errors that need manual cleanup.`,
    promptText: `This clip is being generated specifically to be auto-transcribed afterward, so audio clarity takes priority over background richness.
Subject and action: {{speaker_description}} facing camera directly, mouth clearly visible and unobstructed for the full clip, delivering {{script_line}} at a measured, evenly-paced speed.
Pacing: {{pacing_note}} — deliberate word spacing, no talking over their own mid-sentence pauses, no overlapping second voice or crowd chatter at any point.
Camera: static, front-on, no motion blur across the face, since transcription tools also rely on lip movement as a secondary cue when audio is ambiguous.
Environment and lighting: {{setting}}, quiet space implied by the visual (no crowd, no machinery, no running water in frame) since ambient noise in the environment tends to translate to background noise in the generated audio.
Style and mood: plain and direct, no dramatic audio processing, no reverb, no music bed at any point in the clip.
Audio: one voice only, consistent volume and mic distance throughout, clear consonant articulation, natural but not exaggerated pauses at sentence boundaries.`,
    variables: [
      {
        name: 'speaker_description',
        description: `Who is speaking, described physically`,
        example: `a woman in a blazer, seated at a desk`,
        required: true,
      },
      {
        name: 'script_line',
        description: `The core content beat they deliver`,
        example: `a three-step explanation of how to file a return`,
        required: true,
      },
      {
        name: 'pacing_note',
        description: `How the delivery should be paced for transcription clarity`,
        example: `one clear pause between each of the three steps`,
        required: true,
      },
      {
        name: 'setting',
        description: `The quiet location the clip is set in`,
        example: `a simple office desk with a blank wall behind`,
        required: true,
      },
    ],
    targetTools: [`Kling 3.0`],
    tags: [`video`, `subtitles`, `transcription`, `kling`, `audio-clarity`],
    whyItWorks: `Most subtitle cleanup work exists because the source audio was noisy or overlapping in the first place, so this prompt tries to prevent that problem upstream rather than describe a fix for it after the fact — a Kling 3.0 clip generated with a single clear voice, no music bed, and no implied crowd or machinery noise gives an auto-transcription tool a much cleaner signal to work from, meaning fewer misheard words and less manual subtitle correction later. Keeping the camera static and front-on with the mouth unobstructed matters because modern transcription and forced-alignment tools increasingly use visual lip movement as a secondary signal to resolve ambiguous audio, and a clip with motion blur across the face or the speaker turned away removes that fallback entirely. Specifying deliberate pacing with pauses at sentence and step boundaries, instead of a rushed continuous delivery, directly controls where subtitle segment breaks will naturally fall — transcription tools segment on silence gaps, so evenly-paced speech with real pauses produces clean, well-timed caption chunks instead of one long run-on line that has to be manually split.`,
    exampleOutput: `A static front-on shot: a woman at a desk against a blank wall, speaking clearly at a measured pace, pausing distinctly after each of the three steps, single consistent voice, no ambient noise or music, mouth fully visible throughout.`,
    verifiedAgainst: [
      { tool: 'Kling 3.0', version: '3.0', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against Kling 3.0.`,
      },
    ],
  },
  {
    slug: 'kling-faceless-voiceover-broll-sequence',
    category: 'kling',
    title: `Generate a faceless b-roll beat built to run under one specific voiceover line`,
    description: `A Kling 3.0 brief for a faceless-channel style clip where no host or presenter ever appears on camera — just visuals paced to match a single scripted narration beat, built for channels that never show a face.`,
    promptText: `1. No host: nothing resembling a presenter or narrator ever appears in frame — this clip is visuals only, meant to run silently under a separately-recorded voiceover.
2. Script beat this clip serves: {{script_beat}} — the visual should illustrate or evoke this line without literally depicting someone saying it.
3. Subject and action: {{visual_subject}}, moving or changing in a way that matches the approximate rhythm of the script beat (a longer line needs a slower-developing visual, a punchy line needs a quicker one).
4. Camera: {{camera_move}}, smooth and unhurried unless the script beat specifically calls for urgency.
5. Environment and lighting: {{setting}}, consistent tone with adjacent beats in the same video so cuts between generated clips don't feel like separate videos stitched together.
6. Style and mood: cinematic but restrained, built to hold attention without narration competing with dialogue, since there is none.
7. Audio: ambient/environmental sound only, mixed low, no music sting and no incidental voice, since the voiceover will be layered on top in editing.`,
    variables: [
      {
        name: 'script_beat',
        description: `The specific line or idea from the voiceover script this clip needs to visually support`,
        example: `"most people don't realize how much they overpay for something this simple"`,
        required: true,
      },
      {
        name: 'visual_subject',
        description: `What's actually shown on screen`,
        example: `a stack of receipts slowly fanning out across a table`,
        required: true,
      },
      {
        name: 'camera_move',
        description: `The single camera movement for this beat`,
        example: `a slow overhead push-in`,
        required: true,
      },
      {
        name: 'setting',
        description: `Where this beat takes place`,
        example: `a plain kitchen table under soft daylight`,
        required: true,
      },
    ],
    targetTools: [`Kling 3.0`],
    tags: [`video`, `faceless-content`, `voiceover`, `b-roll`, `kling`],
    whyItWorks: `Faceless-channel videos live or die on whether the visual rhythm tracks the narration, so explicitly stating which script line this specific clip is meant to serve — rather than generating a generic pretty shot and hoping it fits somewhere — is what makes it possible to cut a whole sequence of these clips into a coherent video instead of a loosely-related montage. Matching visual pacing to the approximate length and energy of the script beat (slower development for a longer line, a quicker visual for a punchy one) gives Kling 3.0 a concrete tempo target, since without it the model defaults to a generically comfortable pacing that frequently runs too short or too long against the actual voiceover once it's recorded. The instruction to keep tone consistent with adjacent beats matters because faceless-channel videos are typically assembled from several separately generated clips, and if each one is prompted in isolation with no shared visual language, the finished video reads as a stitched-together stock reel rather than one continuous piece — keeping lighting and mood consistent is the cheapest way to preserve that continuity across separate generations. Restricting audio to low ambient sound only, with no music sting, leaves clean headroom for the voiceover to be laid on top without fighting a competing audio layer baked into the clip.`,
    exampleOutput: `A slow overhead push-in over a kitchen table as a stack of receipts fans out under soft daylight, the paper settling gradually to match the unhurried pace of the line it's built to sit under, only quiet ambient room tone in the background, no music or voice.`,
    verifiedAgainst: [
      { tool: 'Kling 3.0', version: '3.0', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against Kling 3.0.`,
      },
    ],
  },
]
