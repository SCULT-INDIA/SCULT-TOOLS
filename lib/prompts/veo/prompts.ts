import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'veo-cinematic-product-showcase',
    category: 'veo',
    title: 'Turn a product photo into a cinematic hero showcase clip',
    description:
      'A layered Veo 3.1 brief for an 8-second hero shot of a physical product, written in the fixed subject/camera/lighting/style/audio order the model conditions on best, with the native audio described in the same brief instead of added afterward.',
    promptText: `Write this as a single Veo 3.1 text-to-video prompt for an 8-second hero shot of a physical product. Keep the five layers below in this exact order, as short separate sentences rather than one run-on paragraph — Veo conditions on each layer somewhat independently, and merging them into one dense sentence makes it harder for the model to tell which adjective belongs to which layer.

SUBJECT AND ACTION
{{product}}, resting on a {{surface_material}} pedestal, rotating slowly and evenly through roughly 180 degrees over the full clip. Name only one action. A product that is simultaneously rotating, being splashed, and catching falling confetti is three separate ideas competing for the same eight seconds, and Veo will blend them into something that reads as neither.

CAMERA
Exactly one camera movement for the whole clip: a slow dolly-in from a medium shot to a close-up, locked-off tripod smoothness, no handheld shake, no simultaneous orbit or crane. State the shot type at the start (medium) and the shot type at the end (close-up) explicitly, since Veo uses the named start and end framing as an anchor for how far the move should travel across the eight seconds.

ENVIRONMENT AND LIGHTING
A dark, uncluttered studio backdrop. One soft key light from {{key_light_direction}} and a subtle rim light separating the product's silhouette from the background. Describe what the light is doing, not just where it is positioned — "catching the {{surface_material}} pedestal edge as it turns" gives Veo a moving highlight to render across the rotation, instead of a static lighting setup that ignores the motion already asked for.

STYLE AND MOOD
{{visual_style}}. Shallow depth of field with the background genuinely soft, not merely described as "blurry." Premium and quiet, not busy or cluttered.

AUDIO
{{ambient_sound_texture}}, rising subtly the instant the camera reaches the close-up, no dialogue, no music track. Native audio is generated from this exact sentence, so write it as a real sound description rather than a mood word — "tense" is not a sound; "a low mechanical hum climbing half a tone" is.

DURATION AND FORMAT
{{duration_and_aspect_ratio}}. If the output is needed for more than one platform, generate the primary aspect ratio first and treat every other ratio as its own separate generation with the same five layers re-described for the new frame, not a crop of this one — Veo composes lighting position and camera-move endpoints relative to the frame it is told to fill, so cropping after the fact clips the rim light and cuts the dolly's intended endpoint short.

WHAT TO AVOID
Do not add a second product, a hand entering frame, or on-screen text — each is a separate subject Veo has to reconcile with the single rotating product already described, and product clips are the category most likely to show warped geometry when two subjects are asked to share a frame. Do not describe the surface as "shiny" without naming what it reflects; an unspecified reflection is where Veo most often renders smeared, illegible detail instead of a clean highlight.

OUTPUT
The finished five-layer prompt, ready to paste into Veo as-is, followed by one line naming which single camera move and which single action were chosen, so it is checkable against the "exactly one of each" rule above before generating.`,
    variables: [
      {
        name: 'product',
        description: 'The physical product being showcased.',
        example: 'matte-black wireless earbuds case',
        required: true,
      },
      {
        name: 'surface_material',
        description: 'What the product rests on, for light interaction and reflection.',
        example: 'brushed concrete',
        required: true,
      },
      {
        name: 'key_light_direction',
        description: 'Where the single key light comes from.',
        example: 'the upper left, roughly 45 degrees above the product',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall look and grade for the clip.',
        example: 'warm minimalist commercial, soft 35mm film grain',
        required: true,
      },
      {
        name: 'ambient_sound_texture',
        description: 'The literal sound the native audio track should generate.',
        example: 'a low mechanical hum with a faint metallic resonance',
        required: true,
      },
      {
        name: 'duration_and_aspect_ratio',
        description: 'Clip length and the aspect ratio(s) needed.',
        example:
          '8 seconds, 16:9 for the website hero and a separate 9:16 pass for Instagram Stories',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: [
      'video',
      'product-video',
      'commercial',
      'cinematic',
      'native-audio',
      'ecommerce',
    ],
    whyItWorks: `Veo 3.1 generates native audio directly from the text of the prompt, which is why the audio layer here is written as a literal sound description rather than a mood word — "a low mechanical hum climbing half a tone" gives the model an actual waveform-shaped instruction, while a word like "tense" gives it nothing concrete to render and it will either default to silence or invent a generic tone that has no relationship to the visual beat it is meant to land on. Keeping the five layers in a fixed order as short separate sentences rather than one dense paragraph matters because Veo appears to condition on each descriptive clause somewhat independently rather than parsing full grammatical dependency — when "soft" and "warm" and "shiny" are all crammed into one sentence describing three different things at once, the model has to guess which adjective belongs to the light, the material, or the mood, and it guesses wrong often enough that separating the layers measurably reduces that ambiguity. Naming exactly one camera movement is the single biggest lever for output quality on 5-10 second clips — a prompt that asks for a dolly-in while also implying an orbit or a crane is the most common cause of warped product geometry and inconsistent shape across the frames, because the model is trying to satisfy two spatial instructions that pull the virtual camera in incompatible directions at once, and the product itself absorbs the resulting error as visible distortion. Naming the start shot type and end shot type explicitly (medium to close-up) rather than just "dolly in" gives Veo two concrete anchor points to travel between across the fixed eight-second duration, which is a meaningfully different instruction than an unanchored "camera moves closer" that leaves how far and how fast entirely to the model's own defaults. Finally, treating each aspect ratio as its own generation rather than a crop is a real constraint of how the model composes a shot: the rim light position, the pedestal's negative space, and the dolly's calculated endpoint are all composed relative to the frame boundaries it was told to fill, so a 16:9 clip cropped down to 9:16 after generation loses the composed edges rather than reframing them, which is different from how a still photograph crops.`,
    exampleOutput: `An 8-second clip: the earbuds case starts in a medium shot against near-black, a soft key light sweeping across its matte surface as it rotates on the concrete pedestal; the camera glides inward to a tight close-up on the hinge line as a low mechanical hum climbs half a tone under a constant faint metallic resonance, ending on a still, sharply lit close frame.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-21' }],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Veo 3.1 native-audio generation.',
      },
    ],
  },
  {
    slug: 'veo-short-form-hook-vertical',
    category: 'veo',
    title: 'Generate a vertical short-form hook clip built to stop the scroll',
    description:
      'A Veo 3.1 prompt for a 5-8 second vertical clip built as the opening hook of a Reels/Shorts/TikTok-style video, with the payoff pinned to an explicit first-second timestamp and native diegetic audio synced to the visual beat.',
    promptText: `Write a Veo 3.1 prompt for a vertical (9:16) short-form hook — the first 5-8 seconds of a video, built to stop a scrolling thumb, not a complete clip meant to stand alone.

SUBJECT AND ACTION
{{subject}}, {{surprising_or_striking_action}}, framed to fill most of the vertical frame from the very first frame — do not open on establishing wide space that a scroller has already skipped past before it resolves.

CAMERA
Quick whip-pan into a snap zoom landing on the subject's reaction, arriving at a tight close-up within the first second of the clip. State "within the first second" explicitly, not "quickly" — a hook that pays off at second two has already lost the scroll it was built to stop.

ENVIRONMENT AND LIGHTING
{{setting}}, natural handheld-feel lighting, nothing that reads as a lit studio. If the location has an obvious ambient light source — string lights, a window, a screen glow — name it, since Veo will otherwise default to flat, evenly lit coverage that looks staged rather than caught in the moment.

STYLE AND MOOD
Raw, unpolished, phone-shot authenticity — no cinematic color grade, no smoothed motion. Explicitly rule out the smoother, more produced look Veo defaults toward when style is left unstated; an ad-looking clip does not blend into a feed the way native short-form footage does.

AUDIO
{{diegetic_sound}}, landing sudden and sharp at the exact moment of the whip-pan and snap zoom, no music bed underneath it. Tie the sound to the visual beat by timing, not just by naming it — "at the exact moment of the whip-pan" is the instruction that makes the native audio reinforce the hook instead of trailing a half-second behind it.

CAPTION SPACE
Leave the top sixth and bottom quarter of the frame relatively uncluttered — most platforms overlay a username, caption text, and engagement buttons in exactly those zones, and a hook whose payoff is centered under where an auto-caption will render defeats itself before anyone reads it.

WHAT TO AVOID
Do not describe more than one striking beat inside this single 5-8 second window — a hook that tries to land two separate surprises back to back dilutes both, and Veo tends to smear the transition between them into an ambiguous middle beat that reads as neither. Do not add on-screen text as part of the generated video; if a caption is needed, add it after export, since Veo-rendered text is unreliable at the small, precise sizes short-form captions require.

OUTPUT
The finished prompt in the five layers above, ready to paste into Veo as-is, followed by one line stating the exact second at which the payoff lands, so pacing can be checked before generating.`,
    variables: [
      {
        name: 'subject',
        description: 'Who or what the clip centers on.',
        example: 'a street food vendor',
        required: true,
      },
      {
        name: 'surprising_or_striking_action',
        description: 'The specific striking moment the hook is built around.',
        example: 'flipping a pan of food into the air and catching it without looking',
        required: true,
      },
      {
        name: 'setting',
        description: 'Where the clip is set, including its ambient light source.',
        example: 'a busy night market stall lit by hanging string lights',
        required: true,
      },
      {
        name: 'diegetic_sound',
        description: 'The realistic in-scene sound tied to the action.',
        example: 'a sharp pan clang and a nearby crowd gasp',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'short-form', 'social', 'hook', 'vertical', 'reels', 'native-audio'],
    whyItWorks: `Short-form hooks live or die inside the first second, so this prompt pins the payoff to an explicit checkable instant — "within the first second" — instead of a vague "exciting opening," which is the difference between a clip Veo generates with the reaction already landed by frame thirty and one where the snap zoom is still resolving as a scroller's thumb moves on. Deliberately naming the aesthetic as raw, unpolished, phone-shot authenticity and explicitly ruling out a cinematic grade addresses a real default: left unstated, Veo's style leans toward a smoother, more produced look, because that is what a large share of its training distribution of "product" or "cinematic" style requests skews toward, and that smoother look reads as an ad rather than the native, algorithmically-favored short-form footage it is competing against in a feed. Tying the audio instruction to a specific diegetic sound synced to the exact visual beat, rather than a generic music bed, is what makes the native audio generation reinforce the hook instead of competing with whatever the platform's own auto-captions or trending-audio overlay adds after upload — a sound cue that lands a half-second late or is described only in mood terms ("dramatic") gives the model nothing to time against and the two beats drift apart. Naming the caption-safe zones is not a cosmetic add-on; it targets a specific and avoidable failure where a beautifully-timed payoff gets generated dead center in a region every major platform will paper over with a username or a caption line, silently wasting the exact frame the whole prompt was built around. Finally, restricting the clip to one striking beat rather than two closely-spaced ones respects a real limitation of generating motion inside a fixed 5-8 second window: Veo has to interpolate between whatever states it is told exist across that span, and two distinct payoffs packed too close together get rendered as a blurred, ambiguous transition that fully delivers neither one.`,
    exampleOutput: `A 6-second vertical clip: the vendor tosses the pan, the camera whip-pans and snaps into a tight close-up on their face mid-catch by the one-second mark, a loud pan clang and an off-camera crowd gasp landing exactly on the zoom, string lights blown out slightly in the background, no color grading applied, top and bottom sixths of the frame left clear.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-20' }],
    changelog: [
      { date: '2026-07-20', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-dialogue-two-characters',
    category: 'veo',
    title: 'Write a lip-synced two-character dialogue scene for Veo',
    description:
      'A Veo 3.1 prompt structured for its native dialogue generation — quoted lines attributed per speaker, one speaking turn at a time, so the model actually lip-syncs the audio to the correct face instead of blending two voices into one mouth.',
    promptText: `Write a Veo 3.1 prompt for an 8-second dialogue scene between two characters, using Veo's native ability to generate synchronized spoken audio tied to whichever character's mouth is on camera. This only works if exactly one character is speaking at a time and the quoted line is attributed to a named, described character — an unattributed line, or two lines that overlap in the same beat, is how Veo ends up syncing the wrong mouth or blending two voices into one.

CHARACTERS
{{character_a_description}}
{{character_b_description}}

SCENE AND SETTING
{{scene_setting}}. State where each character is positioned relative to the other and relative to camera, since the model needs to know whose face is closer to lens when only one of them is speaking in a given beat.

DIALOGUE, ONE TURN AT A TIME
{{character_a_name}} says: "{{line_one}}"
{{character_b_name}} says: "{{line_two}}"
Keep lines short enough to plausibly fit their share of the eight seconds — a rushed, over-long line is what produces audio that outruns the mouth movement generated for it. If a natural pause, a reaction, or a beat of silence belongs between the two lines, say so explicitly rather than leaving the gap unstated.

CAMERA
{{camera_direction}}. If the shot cuts from one character to the other mid-scene, say exactly when the cut happens relative to the two lines, since a cut landing mid-word is a common and avoidable source of desynced audio.

ENVIRONMENT AND LIGHTING
{{lighting_and_mood}}. Note any acoustic detail worth carrying into the audio — a small room versus an open outdoor space changes what a "natural" voice should sound like, and naming it steers the generated voice's tonal quality even though it is not a literal audio-mixing instruction.

STYLE AND MOOD
{{visual_style}}. State the emotional register of the delivery for each line — flat, warm, sarcastic — since Veo uses that description to shape both the performance and the voice, not just the picture.

WHAT TO AVOID
Do not write both characters' lines as happening "at the same time" or as overlapping dialogue — Veo's lip-sync model is built around one active speaker per beat, and simultaneous dialogue is the single most common cause of a scene where neither character's mouth matches what is heard. Do not leave a character's voice or delivery style undescribed if it matters to the scene; an unstated voice defaults to whatever the model infers from the visual description alone, which is frequently a generic register that flattens a character meant to sound distinct.

OUTPUT
The finished prompt exactly as it should be pasted into Veo, followed by one line confirming that only one character speaks per beat and stating which beat, if any, includes a silent reaction shot.`,
    variables: [
      {
        name: 'character_a_description',
        description:
          'Visual description of the first character, detailed enough to stay consistent.',
        example:
          'a woman in her 50s, silver-streaked hair in a low bun, wearing a grey wool cardigan',
        required: true,
      },
      {
        name: 'character_b_description',
        description: 'Visual description of the second character.',
        example: 'a man in his 20s, unshaven, wearing a rumpled delivery-uniform jacket',
        required: true,
      },
      {
        name: 'scene_setting',
        description: 'Where the scene takes place and the two characters positions.',
        example:
          'the doorway of a small apartment; the woman stands just inside, the man on the step outside holding a package',
        required: true,
      },
      {
        name: 'character_a_name',
        description: "The first character's name, used to attribute the dialogue line.",
        example: 'Mrs. Alvarez',
        required: true,
      },
      {
        name: 'character_b_name',
        description: "The second character's name.",
        example: 'Danny',
        required: true,
      },
      {
        name: 'line_one',
        description: "The first character's spoken line.",
        example: "You're two hours late, and I already told the building manager.",
        required: true,
      },
      {
        name: 'line_two',
        description: "The second character's spoken line, as a reply.",
        example: "I know, I'm sorry — the truck broke down on the highway.",
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'dialogue', 'lip-sync', 'native-audio', 'narrative', 'character'],
    whyItWorks: `Veo's dialogue generation ties synthesized speech to visible mouth movement on whichever character is framed as the active speaker, which is a fundamentally different mechanism from adding a voiceover track after the fact — the model has to decide, frame by frame, whose face is producing sound, and it can only make that decision correctly if the prompt states unambiguously who is speaking in each beat. This is exactly why the one-turn-at-a-time structure is not a stylistic preference but a hard constraint: a prompt describing two lines as simultaneous gives the model two competing claims about which mouth should be moving in the same window, and the observable failure mode is audio that syncs to neither face convincingly, or a blended, garbled attempt at both voices at once. Naming each character's position relative to camera and to the other character matters for the same underlying reason — lip-sync accuracy depends on the model correctly identifying which face is close enough to lens to read as the current speaker, and an unstated spatial arrangement leaves that judgment call entirely to the model's own defaults, which skew toward whichever face is largest in frame regardless of who the text says is talking. Keeping each line short enough to plausibly fit its share of the eight-second window addresses a specific and measurable failure: when a written line is too long for the time available, the generated audio has to compress or the mouth movement has to rush to keep pace, and the visible mismatch between spoken cadence and lip movement is one of the fastest ways a viewer clocks a clip as synthetic. Finally, describing each line's emotional register (flat, warm, sarcastic) does real work beyond flavoring the picture — Veo's voice generation reads that description as a performance instruction, not just a visual mood cue, so an unstated delivery style defaults to a flat, generic register that erases whatever distinct character voice the visual description on its own was trying to establish.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-25' }],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Veo 3.1 native dialogue and lip-sync generation.',
      },
    ],
  },
  {
    slug: 'veo-voiceover-narration-explainer',
    category: 'veo',
    title: 'Write a voiceover-narrated explainer clip without an on-screen talking mouth',
    description:
      'A Veo 3.1 prompt for generating a clip with off-screen narration audio synced to on-screen visuals rather than to a speaking mouth, structured to keep narration length matched to the fixed clip duration instead of running long or short.',
    promptText: `Write a Veo 3.1 prompt for an 8-second explainer clip carried by off-screen voiceover narration, not on-camera dialogue. This is a different generation mode from a talking-head shot: there is no mouth on screen for the audio to sync to, so the narration timing has to be matched to the visuals by pacing description alone, and the prompt must say explicitly that the speaker is off-screen so Veo does not invent an on-camera narrator whose mouth then fails to match the words.

SUBJECT AND VISUALS
{{visual_subject}}, shown as {{visual_action}} across the clip. Since no mouth is being synced, the visuals can carry their own pacing independent of the narration's rhythm — use that freedom to show, not just illustrate, what the narration is describing.

NARRATION
Off-screen voiceover, no speaker visible in frame. The narrator says: "{{narration_line}}"
Count roughly two to three spoken words per second of clip — an 8-second clip comfortably holds 16-24 words at a natural pace; a longer line either gets rushed into an unnatural cadence or gets clipped before it finishes, and a shorter line leaves dead air the model will fill with something unintended, often ambient noise that competes with the narration instead of supporting it.

VOICE AND TONE
{{narrator_tone}}. State the tone in performance terms — measured, urgent, warm — since this is a real instruction to the voice generation, not decoration on a visual description.

ENVIRONMENT AND LIGHTING
{{setting_and_lighting}}.

STYLE AND MOOD
{{visual_style}}.

AMBIENT AUDIO UNDER THE NARRATION
{{ambient_bed}}, kept quiet enough that it sits under the narration rather than competing with it. Naming an ambient layer explicitly, even a subtle one, prevents Veo from generating an unintentionally silent or unintentionally noisy environment around the voice track.

WHAT TO AVOID
Do not describe a person visible in frame as the one delivering the line unless the intent is genuinely a talking-head shot with lip-sync — an ambiguous prompt that shows a person's face while also requesting "voiceover" risks the model treating the visible face as the speaker and attempting lip-sync anyway, producing a mismatched mouth. Do not write a narration line by word count alone without reading it aloud first at a natural pace; a line that looks short on the page but is dense with hard consonants or long words will not fit the seconds allotted to it.

OUTPUT
The finished prompt, followed by a rough word count for the narration line and the target seconds-per-word ratio it produces, so pacing can be checked before generating.`,
    variables: [
      {
        name: 'visual_subject',
        description: 'What is shown on screen while the narration plays.',
        example: 'a small business owner sorting invoices at a cluttered desk',
        required: true,
      },
      {
        name: 'visual_action',
        description: 'What that subject is doing across the clip.',
        example:
          'switching from a messy paper stack to typing on a laptop, visibly relieved',
        required: true,
      },
      {
        name: 'narration_line',
        description: 'The off-screen voiceover line, sized to the clip length.',
        example:
          'Stop chasing invoices across three different apps. One dashboard, every client, paid on time.',
        required: true,
      },
      {
        name: 'narrator_tone',
        description: 'The performance style the voice generation should aim for.',
        example:
          'calm and reassuring, like a founder explaining a fix they wish they had sooner',
        required: true,
      },
      {
        name: 'setting_and_lighting',
        description: 'Where the scene is set and how it is lit.',
        example:
          'a small home office, late-afternoon light through a window blind, warm and slightly cluttered',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example: 'clean, natural, unforced — not a glossy studio ad look',
        required: true,
      },
      {
        name: 'ambient_bed',
        description: 'The quiet background sound sitting under the narration.',
        example: 'a faint keyboard clatter and the soft hum of a desk fan',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'voiceover', 'narration', 'explainer', 'native-audio', 'marketing'],
    whyItWorks: `Off-screen narration and on-camera dialogue are two genuinely different generation problems for Veo, not two ways of phrasing the same request — dialogue asks the model to tie synthesized speech to a specific visible mouth, while voiceover asks it to generate speech with no mouth to sync at all, and stating "off-screen, no speaker visible" explicitly is what tells the model which problem it is solving. Leaving that ambiguous is the actual failure mode this prompt is built to avoid: a prompt that shows a person's face on screen while also asking for "voiceover narration" gives Veo two conflicting signals, and it will frequently default to treating the visible face as the speaker and attempting lip-sync anyway, producing a mouth that moves out of sync with words the prompt intended to be disembodied. The two-to-three-words-per-second pacing rule exists because the clip's duration is fixed before the narration is written, not the other way around — a script written first and then fitted into eight seconds routinely runs long, and when it does, Veo either compresses the delivery into an unnaturally fast cadence or truncates the line mid-thought, both of which are more noticeable and more damaging to a short ad than a slightly shorter line would have been. Explicitly naming a quiet ambient bed under the narration, rather than leaving the sound environment unstated, prevents a specific and common artifact: an unstated soundscape does not reliably default to clean silence, and depending on the described visual scene, the model may generate an ambient layer at a volume or character that fights the narration for attention, which a single named, deliberately quiet ambient cue heads off. Because the visuals here do not need to be paced to a mouth's movement the way a dialogue shot does, the visual layer is genuinely freer to carry its own rhythm — a fact worth stating in the prompt itself, since it is the reason a voiceover-driven clip can afford a visual beat (a gesture, a cut, a reveal) that would be impossible to time correctly against a synced speaking face.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-26' }],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Veo 3.1 voiceover audio generation.',
      },
    ],
  },
  {
    slug: 'veo-real-estate-interior-walkthrough',
    category: 'veo',
    title: 'Generate a continuous interior walkthrough clip for a property listing',
    description:
      'A Veo 3.1 prompt for a single continuous glide through an interior space, written so the camera speed and named room sequence stay physically coherent instead of drifting through walls or restarting mid-shot.',
    promptText: `Write a Veo 3.1 prompt for an 8-second continuous glide through an interior space, in the style of a steadicam real-estate walkthrough. Veo generates one uninterrupted shot per clip, not a sequence of cuts, so the entire camera path for the full eight seconds has to be described as one physically continuous movement, not a list of separate room visits that implicitly requires cutting between them.

SPACE AND SUBJECT
{{room_description}}, {{key_features_to_pass}}. List the features in the actual order the camera will pass them, since Veo treats the order things are named as a rough timeline cue for when they should appear across the clip's duration.

CAMERA PATH
A single steady forward glide at walking pace, {{camera_path_direction}}, roughly waist-height, no vertical bob, no stopping and restarting. State the path as one sentence describing a continuous line through the space — "from the entryway, past the kitchen island, into the living room toward the window" — rather than a list, since a list format tends to get rendered by the model as separate shots stitched together with visible discontinuities instead of one flowing move.

LIGHTING
{{lighting_description}}, consistent across the whole path — natural light from {{light_source}} that does not abruptly change character as the camera moves from one named area into the next.

STYLE AND MOOD
{{visual_style}}. Clean, uncluttered framing suitable for a listing — no visible people, no clutter that was not deliberately named as part of the described space.

AUDIO
{{ambient_audio}}, quiet and unobtrusive, no music track and no dialogue — the audio here exists to make the space feel lived-in and real, not to carry attention on its own.

CONTINUITY ACROSS MULTIPLE ROOMS
If the property needs more rooms shown than a single eight-second glide can physically cover at walking pace, do not try to cram every room into one generation — describe this clip as covering only {{rooms_in_this_clip}}, and generate additional clips for the remaining rooms as separate walkthroughs with matching lighting language, to be edited together afterward rather than asking one generation to do a full property tour it cannot physically complete at a believable walking pace.

WHAT TO AVOID
Do not describe the camera turning more than one corner in the same clip if the space's actual layout makes that turn implausible at a steady walking pace — an implausible path is where Veo is most likely to generate a wall passing through itself or a room's proportions warping to accommodate an impossible turn.

OUTPUT
The finished prompt, followed by one line naming exactly which rooms this specific clip covers, so multi-clip walkthroughs can be planned and stitched in the right order.`,
    variables: [
      {
        name: 'room_description',
        description: 'The space being walked through.',
        example: 'an open-plan kitchen and living area in a renovated apartment',
        required: true,
      },
      {
        name: 'key_features_to_pass',
        description: 'The specific features the camera should pass, in visiting order.',
        example:
          'a marble kitchen island, then a built-in bookshelf, then floor-to-ceiling windows',
        required: true,
      },
      {
        name: 'camera_path_direction',
        description: 'The overall direction and shape of the continuous camera path.',
        example:
          'moving straight through the space toward the far window, no lateral drift',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'How the space is lit.',
        example: 'bright, even daylight',
        required: true,
      },
      {
        name: 'light_source',
        description: 'The named source of that light.',
        example: 'the floor-to-ceiling windows on the far wall',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall visual treatment for the listing.',
        example: 'bright, neutral, true-to-color — not warmed or stylized',
        required: true,
      },
      {
        name: 'ambient_audio',
        description: 'The quiet ambient sound for the space.',
        example: 'a faint hum of a city street filtering through the closed windows',
        required: true,
      },
      {
        name: 'rooms_in_this_clip',
        description:
          'Which specific rooms this one 8-second generation is responsible for.',
        example: 'the entryway and the open kitchen/living area only',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: [
      'video',
      'real-estate',
      'walkthrough',
      'interior',
      'commercial',
      'continuous-shot',
    ],
    whyItWorks: `Veo generates a fixed-length clip as one continuous shot rather than a pre-edited sequence, which means a walkthrough prompt has to describe the camera's entire path through a space as a single physically coherent movement — this is the reason the camera-path instruction insists on one flowing sentence describing the route rather than a bulleted list of rooms, because a list format reads to the model more like a cut list than a continuous glide, and the generated result tends to show visible discontinuities at each named room instead of one smooth pass through the space. Listing the key features in the order the camera will actually reach them functions as a rough internal timeline for the model, since Veo has no separate scene-timing parameter in the prompt itself — the sequence in which things are named is one of the few levers available for controlling roughly when something should appear within the fixed clip duration, and reordering the list changes the pacing of the generated glide even though nothing else in the prompt changed. Explicitly refusing to cram an entire multi-room property into one eight-second generation, and instead scoping each clip to a named subset of rooms meant to be edited together afterward, respects a real physical constraint: a believable walking-pace glide can only cover a limited amount of floor area in that duration, and a prompt that asks for more ground than that pace can plausibly cover is asking the model to either speed up in a way that reads as sped-up footage or to warp the space's actual proportions to fit everything in, and the latter is the more common and more damaging failure since a listing video with subtly wrong room proportions actively misleads a viewer about the property's actual layout. Keeping lighting language consistent across the single described path, and matching it across the separate multi-clip generations meant to be stitched together, matters for the same edited-sequence reason a real film shoot maintains continuity between shots — a walkthrough that abruptly shifts color temperature between an entry hallway and the room it opens into reads as two different times of day spliced together, which undermines the "this is one real space, seen continuously" impression the whole format depends on.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-27' }],
    changelog: [
      { date: '2026-07-27', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-fashion-lookbook-motion',
    category: 'veo',
    title:
      'Generate a fashion lookbook motion clip that describes fabric, not just the model',
    description:
      'A Veo 3.1 prompt for an apparel motion clip built around explicit fabric-physics language, since garment movement is one of the most common places generated video shows visible cloth-simulation artifacts if the movement is left unstated.',
    promptText: `Write a Veo 3.1 prompt for an 8-second fashion motion clip showing a garment in movement, structured to describe how the specific fabric behaves rather than only naming the garment and the model wearing it.

SUBJECT AND GARMENT
{{model_description}}, wearing {{garment_description}}. Name the fabric explicitly — silk, structured cotton twill, heavy wool — not just the garment category, since the fabric's weight and stiffness is what determines how it should move, and an unnamed fabric leaves Veo guessing at cloth physics that then frequently render as either stiff, unmoving fabric or an unnaturally fluid drape that does not match the material described.

MOVEMENT
{{movement_action}}, with {{fabric_behavior}} as the garment responds to that movement. Describing the fabric's actual response — "the hem lifting and settling half a beat after the turn, not simultaneously" — gives Veo a physical lag to render, which is what separates cloth that looks like it has weight from cloth that looks pasted onto the body and moving in lockstep with it.

CAMERA
A single controlled arc, {{camera_arc_direction}}, at a pace slow enough to actually resolve the fabric's movement rather than blurring through it. A camera arc that outpaces the garment's own movement is a common cause of the fabric appearing to warp or smear, since the model is rendering two different speeds of motion in the same frame.

ENVIRONMENT AND LIGHTING
{{setting_and_lighting}}. Name where the light catches the fabric specifically, since fabric texture — the sheen of silk, the texture of wool — only reads clearly under a described light interaction, not from the fabric name alone.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{ambient_sound}}, quiet, no music unless {{music_or_silence}} specifically calls for a track — most lookbook clips are re-scored after export, so leaving the native audio minimal avoids generating a track that then has to be stripped out.

WHAT TO AVOID
Do not describe more than one garment changing or layering mid-clip — a single eight-second clip showing one outfit change on top of the described movement is asking for two separate physical events at once, and the transition between them is the most likely place to see morphing or an unnatural jump cut inside what was meant to be one continuous shot.

OUTPUT
The finished prompt, followed by one line naming the specific fabric-behavior detail chosen, so it can be checked against the garment's real material before generating.`,
    variables: [
      {
        name: 'model_description',
        description: 'The person modeling the garment.',
        example: 'a woman in her late 20s with a straight, confident walk',
        required: true,
      },
      {
        name: 'garment_description',
        description: 'The garment and its named fabric.',
        example: 'a floor-length silk slip dress in deep emerald',
        required: true,
      },
      {
        name: 'movement_action',
        description: 'The physical movement the model performs.',
        example: 'turning a quarter-circle away from camera and back',
        required: true,
      },
      {
        name: 'fabric_behavior',
        description:
          'How the specific fabric should respond to that movement, with a stated lag or weight.',
        example:
          'the hem lifting slightly and settling half a beat after the turn completes, showing real weight',
        required: true,
      },
      {
        name: 'camera_arc_direction',
        description: 'The single camera arc and its direction.',
        example: 'a slow arc from front-facing to a three-quarter side profile',
        required: true,
      },
      {
        name: 'setting_and_lighting',
        description: 'Where the shoot is set and how light hits the fabric.',
        example:
          'a plain studio backdrop, one soft side light raking across the silk to catch its sheen',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example: 'clean editorial, muted color grade, high-fashion catalog feel',
        required: true,
      },
      {
        name: 'ambient_sound',
        description: 'The minimal native audio for the clip.',
        example: 'a faint room ambience, the soft sound of fabric moving',
        required: true,
      },
      {
        name: 'music_or_silence',
        description: 'Whether a music bed should be generated natively or left for post.',
        example: 'no music — this will be scored separately after export',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'fashion', 'apparel', 'lookbook', 'ecommerce', 'motion'],
    whyItWorks: `Cloth simulation is one of the harder physical behaviors for a generative video model to infer from a garment category alone, which is why naming the specific fabric and describing how it physically responds to the movement — not just naming the movement itself — is the load-bearing part of this prompt. A garment named only as "a dress" gives Veo no signal about weight or stiffness, and the model's default guess tends to land in one of two failure modes: fabric that looks glued to the body and moves in perfect lockstep with it, or fabric that flows with an unnaturally uniform fluidity that no real material actually has, both of which read as artificial the moment a viewer who has ever worn clothing looks closely. Stating an explicit lag — the hem lifting and settling half a beat after the turn completes, rather than simultaneously — gives the model a concrete timing offset to render, and that offset is what visually communicates mass and drape; without it, movement and fabric response happen in the same instant, which is physically impossible for any fabric heavier than a plastic sheet and is a fast, subconscious tell that the footage is synthetic. Matching the camera's own speed to a pace that can actually resolve the fabric's motion addresses a separate but related failure: when the camera arcs faster than the garment's described movement, the model ends up rendering two different velocities inside the same frame, and the fabric is usually where that mismatch shows up first as a smear or a warped silhouette, since it is the most physically soft and least rigid element in the shot. Restricting the clip to one garment event — one movement, one fabric response, no mid-clip outfit change — is not a stylistic limitation but a direct response to how morphing artifacts happen in fixed-duration generation: two separate physical events inside eight seconds force the model to render a transition between them, and a transition between two different garments on the same body is exactly the kind of discontinuity that produces a visibly unnatural blend rather than a clean cut, because nothing in the prompt told the model a cut was supposed to happen there.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-28' }],
    changelog: [
      { date: '2026-07-28', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-food-prep-macro-process',
    category: 'veo',
    title: 'Generate a macro food-prep process clip for a recipe or restaurant reel',
    description:
      'A Veo 3.1 prompt for one close-up food-preparation action — a pour, a sprinkle, a slice — described with explicit liquid and texture physics, structured around a single action rather than a whole recipe compressed into one clip.',
    promptText: `Write a Veo 3.1 prompt for an 8-second macro close-up of a single food-preparation action, for use as one shot inside a longer recipe or restaurant reel edited from several such clips, not as a complete recipe in itself.

SUBJECT AND ACTION
{{food_subject}}, {{single_prep_action}}. Name exactly one action — a pour, a sprinkle, a slice, a swirl — never a sequence of several ("chopping, then sautéing, then plating"), since a macro clip this close to the subject has no room to show more than one motion without the transition between actions collapsing into an ambiguous blur.

TEXTURE AND PHYSICS
{{texture_detail}}. Describe what the specific ingredient does physically as it is acted on — steam rising off a hot surface, a liquid's viscosity as it pours, crumbs scattering from a cut — since fluid and particulate physics are among the hardest things for the model to infer without being told explicitly, and an unstated texture behavior is where macro food clips most often look subtly wrong even when nothing else in the frame is obviously broken.

CAMERA
A locked-off or very slow macro push-in, {{camera_distance}}, no movement beyond that single push — a macro shot this close already reads as intentional and still; adding a second camera move on top of an already-tight macro frame is where footage this close to the subject tends to lose its geometric coherence first.

LIGHTING
{{lighting_description}}, angled to catch {{texture_detail}} specifically — steam needs backlight to read, a glossy sauce needs a raking highlight, a dry ingredient needs harder directional light to show its texture; naming which light does which specific job produces a noticeably different result than a single generic "well lit" instruction.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{diegetic_sound}}, the real sound the action itself would make, no music track — this clip is one ingredient in an edited sequence, and native audio from each individual clip typically gets replaced or layered under a single continuous soundtrack during editing, so keep it realistic rather than produced.

WHAT TO AVOID
Do not ask for the finished dish to appear plated at the end of this clip if the named action is a mid-process step — an eight-second macro clip of chopping does not also have room for a coherent jump to a fully plated result, and asking for both compresses two unrelated visual states into one shot the model will resolve by blending them into neither.

OUTPUT
The finished prompt, followed by one line naming which single action and which single texture behavior this specific clip is responsible for, so a set of these can be planned as separate shots for one edited sequence.`,
    variables: [
      {
        name: 'food_subject',
        description: 'The specific ingredient or dish being prepped.',
        example: 'fresh cracked black pepper',
        required: true,
      },
      {
        name: 'single_prep_action',
        description: 'The one preparation action shown.',
        example: 'being ground and falling onto a glistening seared steak',
        required: true,
      },
      {
        name: 'texture_detail',
        description: 'The specific physical texture or fluid behavior to render.',
        example: 'a thin curl of steam rising off the steak as the pepper lands',
        required: true,
      },
      {
        name: 'camera_distance',
        description: 'How close the macro shot sits and its single push direction.',
        example:
          'extreme close-up, pushing in another few centimeters over the full clip',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'The lighting setup and what it needs to reveal.',
        example: 'a single warm backlight positioned to silhouette the rising steam',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall visual treatment.',
        example: 'moody, restaurant-dark, high contrast',
        required: true,
      },
      {
        name: 'diegetic_sound',
        description: 'The realistic sound the action produces.',
        example: 'a soft sizzle and the faint grind of a pepper mill',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'food', 'macro', 'recipe', 'restaurant', 'native-audio'],
    whyItWorks: `Fluid and particulate physics — steam, pours, scattering crumbs, melting fat — are consistently among the harder behaviors for a generative video model to render convincingly without an explicit description, because unlike rigid-body motion there is no single obvious shape the material should hold from one frame to the next, and an unstated behavior tends to default to something that moves plausibly at a glance but falls apart under close attention, which is exactly the level of scrutiny a macro shot invites. Naming the specific texture behavior — steam rising as backlit, a liquid's actual viscosity as it pours, crumbs scattering on impact — gives the model a concrete physical target instead of leaving it to infer weight and flow purely from the ingredient's name, and this is the single highest-leverage line in a food macro prompt because it is the detail viewers unconsciously check first when judging whether food footage looks real. Restricting the clip to exactly one preparation action addresses the same fixed-duration constraint that shows up across other Veo use cases, but it is sharper here because a macro frame has essentially no negative space to absorb an ambiguous transition — a wide shot can imply a cut with a camera move or a change of framing, but a locked-off extreme close-up has nowhere for a second action to plausibly begin, so asking for two prep steps in one macro clip produces a blurred, indeterminate blend rather than a clean progression. Naming which specific light is doing which specific job — a backlight for steam, a raking highlight for a glossy sauce, harder directional light for a dry ingredient's texture — is a materially different instruction than "well lit," because texture only reads as texture under light that is angled to catch it; the same ingredient under flat, even lighting loses the surface detail that makes macro food photography convincing in the first place, generated or otherwise. Finally, treating the native audio as one raw ingredient sound rather than a produced music cue respects how these clips actually get used: a macro food reel is almost always an edited sequence of several such shots under one continuous soundtrack, and a clip that generates its own competing music track just creates something that has to be stripped back out before it can be laid under the real edit.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-22' }],
    changelog: [
      { date: '2026-07-22', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-nature-landscape-establishing-shot',
    category: 'veo',
    title: 'Generate a nature or landscape establishing shot with weather-true audio',
    description:
      'A Veo 3.1 prompt for a static or slow-drift landscape establishing shot, with the weather and time-of-day described as a matched visual/audio pair rather than a visual-only instruction that leaves the native soundscape to chance.',
    promptText: `Write a Veo 3.1 prompt for an 8-second landscape or nature establishing shot — the kind of wide, scene-setting shot that opens a sequence rather than one built around a single subject's action.

LOCATION AND TIME OF DAY
{{location}}, at {{time_of_day}}. Name the specific light quality that time of day produces — the long shadows and warm color of late afternoon, the flat blue-grey of overcast noon — rather than only naming the clock time, since the light quality is what the model actually renders and the clock time alone underdetermines it.

CAMERA
{{camera_choice}} — either a fully static locked-off frame, or a very slow drift in one single direction. A landscape establishing shot earns almost nothing from an eventful camera move; naming the movement as deliberately minimal, or naming it as fully static, removes the temptation to over-direct a shot whose entire job is to sit still and let the place register.

WEATHER AND ATMOSPHERE
{{weather_condition}}, described as a concrete visual effect — mist clinging low over water, wind visibly moving through tall grass, rain streaking diagonally in one direction — not as an abstract label like "moody weather," which gives the model nothing specific to render and tends to produce generic overcast lighting regardless of what was actually intended.

WILDLIFE OR MOVEMENT IN FRAME
{{movement_in_frame}}, if any — and if none, say explicitly "no animals, no people, no vehicles in frame" rather than leaving it unstated, since an empty landscape prompt left ambiguous on this point sometimes has the model populate it with an unrequested bird, boat, or distant figure that then becomes an unplanned second subject competing with the landscape itself.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{matched_ambient_audio}} — the sound that specific weather and location actually produce, matched to the visual, not a generic nature-soundtrack bed. Wind visible in the grass needs audible wind; a fully still frame with no visible weather movement should have a correspondingly quiet, minimal soundscape rather than an inconsistent gust of wind sound with nothing on screen moving to justify it.

WHAT TO AVOID
Do not combine more than one weather condition in the same shot — mist and direct hard sunlight rarely occur together in reality, and asking for both at once produces lighting that reads as physically inconsistent even to a viewer who could not say exactly why it looks off.

OUTPUT
The finished prompt, followed by one line confirming that the named visual weather effect and the named audio are describing the same real-world condition, not two different ones stitched together.`,
    variables: [
      {
        name: 'location',
        description: 'The specific landscape or nature location.',
        example: 'a pine forest on a steep mountainside, fog pooling in the valley below',
        required: true,
      },
      {
        name: 'time_of_day',
        description: 'The time of day and its light quality.',
        example: 'early morning, cool blue light just before direct sun clears the ridge',
        required: true,
      },
      {
        name: 'camera_choice',
        description: 'Whether the shot is static or a slow single-direction drift.',
        example: 'a fully static, locked-off wide shot',
        required: true,
      },
      {
        name: 'weather_condition',
        description: 'The specific weather rendered as a concrete visual effect.',
        example:
          'thin fog drifting slowly across the valley floor, thickest near the treeline',
        required: true,
      },
      {
        name: 'movement_in_frame',
        description:
          'Any living movement in the frame, or an explicit statement that there is none.',
        example: 'no animals, no people, no vehicles in frame',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example:
          'quiet, desaturated, documentary-natural — not oversaturated or stylized',
        required: true,
      },
      {
        name: 'matched_ambient_audio',
        description:
          'The specific ambient sound matched to the named weather and location.',
        example:
          'distant birdsong, a light breeze through pine needles, no wind gusts since the fog is still',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'nature', 'landscape', 'establishing-shot', 'native-audio', 'b-roll'],
    whyItWorks: `Naming a time of day by its light quality rather than only its clock label matters because "early morning" underdetermines what the model should actually render — early morning can mean cool pre-dawn blue, warm direct low sun, or flat overcast grey depending on season and location, and only the light-quality description resolves which of those the model should paint, whereas the clock time alone leaves that choice to whatever the training distribution's most common "early morning" happens to be. Describing weather as a concrete visual effect — mist clinging low, wind visibly moving through grass, rain streaking in one direction — rather than an abstract mood label like "moody" gives the model something to actually simulate; an abstract weather word tends to get resolved into generic overcast lighting because that is the safest visual interpretation available when nothing specific was named, which is why two different prompts both requesting "moody weather" so often produce visually similar, forgettably grey results. Explicitly stating that no animals, people, or vehicles belong in frame — rather than leaving an empty landscape's population unaddressed — closes a specific and easy-to-miss gap: a landscape prompt with an unstated subject sometimes gets an unrequested bird, distant boat, or human figure inserted by the model as a default way of giving the frame a focal point, and that unplanned addition becomes a second subject competing with the landscape the shot was actually meant to showcase. Matching the ambient audio explicitly to the same weather condition named in the visual layer, rather than defaulting to a generic nature soundtrack, is what keeps the native audio physically consistent with what is on screen — wind visibly bending grass with no audible wind, or a fully still frame paired with an audible gust, are both small mismatches that a viewer registers as wrong even without being able to name the discrepancy, because sound and visible motion are processed together as a single physical event, not as two independent channels. Finally, ruling out combining two incompatible weather conditions in one shot — mist and hard direct sunlight, for instance — targets a subtler version of the same coherence problem: those conditions are physically inconsistent together in the real world often enough that a model trained on real footage renders their combination as visibly uncanny lighting, even when each condition individually would have looked completely convincing on its own.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-23' }],
    changelog: [
      { date: '2026-07-23', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-scifi-concept-trailer-clip',
    category: 'veo',
    title:
      'Generate a sci-fi concept clip that keeps camera language physically grounded',
    description:
      'A Veo 3.1 prompt for a speculative sci-fi or fantasy concept clip that isolates the one fantastical element from an otherwise physically ordinary camera and lighting description, since grounding everything except the invented element is what keeps the result coherent rather than uniformly synthetic-looking.',
    promptText: `Write a Veo 3.1 prompt for an 8-second speculative sci-fi or fantasy concept clip. The core discipline here is isolating exactly one fantastical or impossible element and describing everything else — camera, lighting, human or environmental detail — in the same grounded, physically ordinary language used for a realistic shot, since a prompt that treats every element as equally fantastical tends to produce a result that reads as uniformly synthetic rather than as one believable world with one extraordinary thing happening in it.

THE ONE FANTASTICAL ELEMENT
{{fantastical_element}}. Describe its physical behavior in concrete terms — how it moves, what it does to light, what it displaces — as if describing a real practical effect on a film set, not as an abstract concept. "A glowing energy shard" is abstract; "a shard casting a shifting blue light that flickers across nearby surfaces like a struck arc-welder" is a concrete lighting behavior the model can actually render.

EVERYTHING ELSE, GROUNDED
{{grounded_scene_description}}. Describe the human subject, the setting, and the ordinary physical details — clothing texture, surface material, ordinary shadows — with the same specificity a realistic commercial or documentary prompt would use, deliberately unremarkable next to the one fantastical element.

CAMERA
{{camera_movement}}, a single real-world camera movement — handheld, a slow dolly, a static tripod shot — described in the same practical-cinematography language a director of photography would use on an ordinary set, not a sweeping, physically impossible camera path; an impossible camera move stacked on top of an already-fantastical subject compounds the places the model has to invent physically ungrounded motion, and the result tends to lose coherence faster than either element would alone.

LIGHTING
{{lighting_description}}, with the fantastical element named as the one light source or light-affecting object that breaks from otherwise natural, practical-looking lighting.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{audio_description}} — a grounded ambient bed plus one sound specifically tied to the fantastical element's behavior, described physically (a low electrical hum, a sharp crack) rather than abstractly ("an otherworldly sound").

WHAT TO AVOID
Do not introduce a second fantastical element in the same clip — two invented physical impossibilities sharing one eight-second shot forces the model to reconcile two unfamiliar behaviors at once, which is where sci-fi concept clips most often devolve into an incoherent, generically "special-effects-y" blur rather than one specific, memorable idea rendered clearly.

OUTPUT
The finished prompt, followed by one line naming exactly which single detail in the scene is the fantastical one, confirming everything else was described in grounded, ordinary terms.`,
    variables: [
      {
        name: 'fantastical_element',
        description:
          'The single invented or impossible element in the scene, described physically.',
        example:
          'a floating shard of crystalline energy hovering a few inches above an outstretched palm, casting a shifting blue light that flickers like a struck arc-welder',
        required: true,
      },
      {
        name: 'grounded_scene_description',
        description: 'Everything else, described in ordinary realistic terms.',
        example:
          'a woman in a worn canvas jacket standing in an abandoned concrete parking structure, rain-damp floor, a distant flickering fluorescent light down the corridor',
        required: true,
      },
      {
        name: 'camera_movement',
        description: 'The single, physically ordinary camera movement.',
        example:
          'a slow handheld push-in, slight natural sway, as if a person were actually holding the camera',
        required: true,
      },
      {
        name: 'lighting_description',
        description:
          'The overall lighting, naming the fantastical element as the one break from natural light.',
        example:
          'otherwise dim, practical fluorescent-lit corridor lighting, with the shard as the single unnatural light source in the frame',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall visual treatment.',
        example:
          'gritty, desaturated, grounded sci-fi — closer to a thriller than a fantasy epic',
        required: true,
      },
      {
        name: 'audio_description',
        description:
          'The ambient bed and the specific physical sound tied to the fantastical element.',
        example:
          'distant dripping water and a faint electrical hum that rises in pitch as the shard flickers brighter',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'sci-fi', 'concept', 'vfx', 'fantasy', 'native-audio'],
    whyItWorks: `The single biggest lever in a speculative concept clip is contrast, not density — a model asked to invent one unfamiliar physical behavior against an otherwise ordinary, well-understood scene has a much narrower problem to solve than a model asked to invent an entire world's worth of unfamiliar physics at once, and that narrower problem is exactly what isolating one fantastical element and grounding everything else in concrete, camera-ready language is designed to produce. Describing the fantastical element's behavior in the same physical, practical-effects vocabulary a real film set would use for an actual prop light — how it moves, what it does to nearby surfaces, how its light behaves — rather than an abstract descriptor gives the model a specific rendering target instead of an open-ended concept it has to interpret from scratch; "a glowing energy shard" could visually mean almost anything, while a described flicker pattern likened to an arc-welder gives it one concrete visual reference to converge on. Keeping the camera movement itself grounded in ordinary cinematography language — a real handheld push, a real dolly, described the way a working camera operator would describe it — matters because a camera move that is itself physically impossible compounds the amount of ungrounded invention happening in the same eight seconds; the fantastical element is already asking the model to render something it has limited real-world reference for, and stacking an equally unfamiliar camera behavior on top of it removes the one anchor (ordinary, physically plausible motion) that would otherwise keep the shot legible. Restricting the clip to exactly one invented element, rather than layering two speculative ideas into the same shot, follows the same logic that governs combined camera moves elsewhere in Veo prompting: each additional unfamiliar element the model has to reconcile within a fixed short duration multiplies the chances of an incoherent blend, and concept clips built around two competing fantastical ideas at once are the ones most likely to read as generic "special-effects" noise rather than one specific, ownable visual idea a viewer actually remembers afterward.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-24' }],
    changelog: [
      { date: '2026-07-24', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-documentary-historical-reenactment',
    category: 'veo',
    title: 'Generate a documentary-style historical reenactment b-roll clip',
    description:
      'A Veo 3.1 prompt for archival-feeling reenactment b-roll, built around named period-accurate detail and deliberate camera imperfection, since a clean, modern-feeling shot is the fastest way to break the period illusion a documentary reenactment depends on.',
    promptText: `Write a Veo 3.1 prompt for an 8-second historical reenactment b-roll clip in the style of documentary archival footage — footage meant to feel like it was actually captured in the period depicted, or shot to deliberately evoke that era's camera technology, not a clean modern shot with period costumes added on top.

SUBJECT AND ACTION
{{historical_subject}}, {{period_action}}. Name the specific era and location precisely enough that period-accurate detail can actually be checked — "a dockworker in 1920s Liverpool loading crates" gives Veo far more to get right or wrong than "an old-timey worker."

PERIOD-ACCURATE DETAIL
{{period_detail}}. Name the specific objects, clothing, and environmental detail that belong to this exact period and place, since an underspecified historical prompt tends to default to a generalized, slightly wrong "vintage" look that blends details from several different decades rather than committing to the one that was actually asked for.

CAMERA AND FILM STOCK LANGUAGE
{{archival_camera_style}} — describe the imperfections deliberately: slight zoom drift, soft focus at the frame edges, visible grain, a slightly unsteady handheld quality consistent with the camera technology of the period. These imperfections are not a stylistic afterthought here; they are the primary signal that separates footage that reads as archival from footage that reads as a modern shoot wearing a sepia filter.

LIGHTING
{{lighting_description}}, consistent with available light sources of the period — no clearly modern light quality (crisp LED-panel evenness, for instance) that would anachronistically leak into a shot meant to feel decades or centuries old.

STYLE AND MOOD
{{visual_style}}. Name the specific film or photographic reference point if one exists — "grainy 16mm newsreel" reads very differently to the model than "old and grainy."

AUDIO
{{period_audio}} — the ambient sound of the period activity, with the audio fidelity itself described as period-consistent (thin, narrow-band, slightly hissy) rather than the clean, full-range audio a modern recording would have, since crisp modern-fidelity audio under archival-looking picture is one of the fastest ways the illusion breaks.

WHAT TO AVOID
Do not include any object, material, or detail that did not exist in the named period — a visible detail that is anachronistic (a modern zipper, a plastic object, contemporary signage) is more damaging to the reenactment's credibility than any camera imperfection, since it is the kind of error an attentive viewer catches immediately and it undermines every other correct detail in the frame.

OUTPUT
The finished prompt, followed by one line naming the specific period and location committed to, so every detail in the prompt can be checked against that one place and decade rather than a vague "old-fashioned" composite.`,
    variables: [
      {
        name: 'historical_subject',
        description: 'The specific person or group depicted.',
        example: 'a dockworker in his 30s',
        required: true,
      },
      {
        name: 'period_action',
        description: 'The specific activity, tied to the named period.',
        example: 'hauling a wooden crate up a gangplank onto a steam-powered cargo ship',
        required: true,
      },
      {
        name: 'period_detail',
        description: 'Specific era- and location-accurate objects and clothing.',
        example:
          "1920s Liverpool docks — a flat cap, a heavy wool coat, wooden crates stamped with period shipping marks, coal smoke from the ship's funnel",
        required: true,
      },
      {
        name: 'archival_camera_style',
        description: 'The specific archival camera imperfections to render.',
        example:
          'grainy 16mm newsreel look, slight handheld sway, soft vignette at the frame edges',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'Lighting consistent with period-available light sources.',
        example:
          'flat overcast daylight, no artificial fill, consistent with a real outdoor 1920s film shoot',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall visual and photographic reference point.',
        example:
          'monochrome, high-contrast, grainy — like a period newsreel, not a modern black-and-white filter',
        required: true,
      },
      {
        name: 'period_audio',
        description: 'The ambient sound, with fidelity described as period-consistent.',
        example:
          'dockyard clatter and distant ship horns, thin and narrow-band, faint hiss consistent with period sound recording',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'documentary', 'historical', 'reenactment', 'archival', 'b-roll'],
    whyItWorks: `Naming the exact decade and place, rather than a vague "old-fashioned" era, changes what the model has to render from a generalized composite guess into something that can actually be checked against a real reference point — an underspecified historical prompt tends to blend period signifiers from several different decades into one imprecise "vintage" look, because without a specific anchor the model has no reason to prefer 1920s detail over 1950s detail, and the two eras look meaningfully different once you know to look. Treating camera imperfection as the primary signal rather than a stylistic garnish reflects how archival footage actually communicates its own authenticity to a viewer: grain, soft edges, drift, and unsteady handheld quality are not decorative, they are the visible fingerprint of the actual recording technology of the period, and a shot that is otherwise perfectly composed and pin-sharp reads as a modern production no matter how accurate the costuming is, because modern optical clarity is itself an anachronism the eye picks up on before consciously cataloguing any specific period detail. Describing the audio's fidelity as period-consistent — thin, narrow-band, slightly hissy — rather than only naming the ambient sound itself matters for the same reason the visual grain does: full-range, clean modern audio fidelity under a grainy archival-looking picture is a mismatch a viewer registers even without being able to name it, because sound quality and picture quality are processed as one combined signal about how old and how technologically limited the recording actually was. Explicitly ruling out anachronistic objects is the single highest-cost failure to prevent, not because it is visually the most disruptive element on its own, but because of how selectively viewers scrutinize reenactment footage — a single visible anachronism (a modern zipper, contemporary signage, a plastic object) is the kind of error an attentive viewer catches immediately and generalizes from, retroactively undermining trust in every other correct period detail in the same frame, which is a disproportionate cost for one small, avoidable mistake.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-29' }],
    changelog: [
      { date: '2026-07-29', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-animated-logo-brand-sting',
    category: 'veo',
    title:
      'Generate an animated logo sting without asking Veo to render crisp typography',
    description:
      'A Veo 3.1 prompt for a short animated brand intro sting that renders the logo as a physical, lit object rather than as on-screen text, since text rendering is a known weak point for generated video and a material description sidesteps it entirely.',
    promptText: `Write a Veo 3.1 prompt for a 3-5 second animated logo sting, built around treating the brand mark as a physical, lit object in a scene — not as flat on-screen text or a graphic overlay, which generated video renders unreliably at the crispness a brand mark actually needs.

THE LOGOMARK AS A PHYSICAL OBJECT
{{logo_shape_description}}, rendered as {{physical_material}}. Describe the logo's actual shape in physical, sculptural terms — its edges, its thickness, how light would fall across it as a real object — rather than describing it as text or a 2D graphic, since Veo can render a described physical object with real geometry far more reliably than it can render small, precise typography, which tends to come out warped, misspelled, or illegible at the sizes and durations a sting requires.

REVEAL ACTION
{{reveal_action}}. Name a single physical action that brings the mark into view or into full clarity — light sweeping across it, it rotating into a front-facing position, a surface pulling back to reveal it — described as one continuous physical event, not several separate motion ideas stacked together.

LIGHTING
{{lighting_description}}, timed to the reveal action so the mark becomes clearest and most legible at the exact moment the sting is meant to land, typically the final second.

ENVIRONMENT
{{environment_description}} — kept minimal and dark enough that the logo object is unambiguously the only subject in frame.

STYLE AND MOOD
{{visual_style}}, matching {{brand_tone}}.

AUDIO
{{sonic_logo_description}} — a short, specific sound design cue timed to land on the reveal, described physically (a soft chime, a low resonant thud, a rising tone) rather than abstractly ("an epic sound").

WHAT TO AVOID
Do not ask Veo to render the brand's actual wordmark or any legible text as part of the generated video, even as a secondary element next to the physical mark — if the brand name needs to appear as legible type, add it as a separate overlay in post-production after export, since text generated inside the video itself is the single least reliable element Veo produces and a sting is exactly the short, scrutinized format where a misspelled or warped word is most damaging.

OUTPUT
The finished prompt, followed by one line confirming that no on-screen text was requested inside the generated video itself, and where a wordmark overlay would need to be added afterward if one is required.`,
    variables: [
      {
        name: 'logo_shape_description',
        description: 'The brand mark described purely as a physical shape.',
        example:
          'a rounded triangular mark with a single clean notch cut into its top edge',
        required: true,
      },
      {
        name: 'physical_material',
        description: 'The physical material the mark is rendered as.',
        example: 'brushed matte metal',
        required: true,
      },
      {
        name: 'reveal_action',
        description: 'The single physical action that brings the mark into view.',
        example:
          'a soft light sweeping across the shape from left to right as it settles into a front-facing position',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'The lighting, timed to peak at the reveal moment.',
        example:
          'a single moving key light, growing brighter as it sweeps, fully lighting the mark in the final second',
        required: true,
      },
      {
        name: 'environment_description',
        description: 'The minimal background environment.',
        example: 'a plain near-black void with no visible floor or horizon line',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall look, matched to the brand tone.',
        example: 'clean, premium, minimal — no lens flares or particle effects',
        required: true,
      },
      {
        name: 'brand_tone',
        description: 'The brand personality this sting should read as.',
        example: 'a fintech brand aiming for trustworthy and understated, not flashy',
        required: true,
      },
      {
        name: 'sonic_logo_description',
        description: 'The physical sound cue timed to the reveal.',
        example:
          'a single low resonant thud landing exactly as the light fully reveals the shape',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'logo', 'branding', 'sting', 'motion-graphics', 'native-audio'],
    whyItWorks: `Generated video's least reliable output is small, precise typography — legible text at logo-sting scale requires exact letterform geometry held perfectly stable across every frame, and diffusion-based video models routinely warp, misspell, or blur exactly this kind of fine, high-frequency detail, which is why the core move in this prompt is sidestepping the problem entirely rather than trying to prompt around it: describing the brand mark as a physical sculptural object instead of as text asks the model to render something it is comparatively good at — object geometry, material, and light — instead of something it is comparatively bad at. Naming the mark's edges, thickness, and material gives the model an actual physical form to hold consistent frame to frame, in the same way a described product or prop stays coherent across a shot, whereas a request to render "the logo" as a flat graphic gives it nothing but a 2D shape with no physical logic to anchor its consistency, which is part of why 2D graphic overlays inside generated video tend to drift, flicker, or subtly change shape across a few seconds even when nothing else in the frame is moving. Explicitly ruling out any on-screen legible text, even as a secondary element, closes the actual gap this workaround leaves: since the physical-object approach cannot render a spelled-out wordmark at all, the prompt has to be honest that a text-bearing sting needs a second, separate step — a title-safe overlay added in post — rather than pretending the generated video alone can deliver both a lit 3D mark and crisp accompanying type in the same shot. Timing the lighting to peak at the exact reveal moment, and pairing the sound cue to the same instant, matters specifically because a sting's entire function is to land recognition in a very short, scrutinized window — three to five seconds leaves no room for the visual and audio payoff to arrive a beat apart, and naming that timing explicitly rather than trusting the model's own pacing defaults is what keeps the light, the reveal, and the native sound cue converging on the same frame instead of drifting slightly out of alignment with each other.`,
    exampleOutput: `A 4-second clip: a brushed-metal triangular mark sits in near-total darkness, a single warm light sweeping in from the left as the shape rotates into a front-facing position; the light reaches full brightness exactly as a low resonant thud lands, leaving the mark clearly lit and centered for the final half-second.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-30' }],
    changelog: [
      { date: '2026-07-30', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-ugc-testimonial-style-ad',
    category: 'veo',
    title: 'Generate a UGC-style testimonial ad clip that reads as unproduced',
    description:
      'A Veo 3.1 prompt for a vertical, selfie-framed testimonial clip that deliberately requests the imperfections of real user-generated content, since a produced-looking testimonial is the fastest way an audience discounts it as an ad rather than a review.',
    promptText: `Write a Veo 3.1 prompt for an 8-second vertical, selfie-style testimonial clip in the style of authentic user-generated content — the specific genre defined by its imperfections, not despite them, so those imperfections need to be requested explicitly rather than left to a default that will smooth them out.

SPEAKER
{{speaker_description}}, holding the camera at arm's length in a selfie-style framing, speaking directly to camera.

SETTING
{{setting}}, an ordinary, real, slightly cluttered space — not a staged or styled backdrop, since a testimonial filmed in an obviously produced setting undercuts its own credibility before a single word is spoken.

DIALOGUE
{{speaker_name}} says: "{{testimonial_line}}"
Write it as a real person would actually speak, not as ad copy — include a natural filler word or a slight self-correction if it fits, since a testimonial that sounds too polished is one of the fastest signals an audience uses to discount it as scripted.

CAMERA
Handheld, held by the speaker themselves, with the natural micro-shake of an actual selfie-style shot — not a smoothed, stabilized gimbal move. State explicitly that stabilization should look like a person's own hand, not a locked or gimbal-smoothed frame, since Veo's default handheld interpretation sometimes skews smoother than genuine phone-in-hand footage actually looks.

LIGHTING
{{lighting_description}}, ordinary available light — a window, an overhead room light, nothing set up as a proper key light. Explicitly rule out a visible softbox or ring-light glow unless the described setting genuinely includes one, since an obviously lit face is one of the clearest tells that a "testimonial" was actually shot as a production.

AUDIO
{{room_audio}}, with the speaker's voice carrying the natural acoustic signature of the named room — some echo in a bare room, a flatter sound in a soft-furnished one — plus whatever ordinary ambient sound the space would actually have, not a clean, isolated studio voice track.

STYLE AND MOOD
{{visual_style}}. Genuinely unpolished — slightly uneven exposure, a phone-camera color response, not a color grade.

WHAT TO AVOID
Do not ask for any element that reads as intentionally produced — a music bed, a lower-third graphic, a smooth camera move, or dramatic lighting — inside this generation; if a produced element is needed for the final ad, add it in post over this deliberately raw base clip, not inside the same generation that is trying to look unproduced.

OUTPUT
The finished prompt, followed by one line naming the specific imperfection chosen (a filler word, a hand-shake, room echo) that is doing the most work to sell authenticity.`,
    variables: [
      {
        name: 'speaker_description',
        description: 'Who is speaking on camera.',
        example: 'a woman in her early 30s, hair pulled back, wearing a plain t-shirt',
        required: true,
      },
      {
        name: 'setting',
        description: 'The ordinary, unstaged space the clip is filmed in.',
        example: 'her own kitchen, dishes visible on the counter behind her',
        required: true,
      },
      {
        name: 'speaker_name',
        description:
          'The name attributed to the testimonial line, for dialogue attribution.',
        example: 'Priya',
        required: true,
      },
      {
        name: 'testimonial_line',
        description: 'The spoken testimonial, written like real speech, not ad copy.',
        example:
          'Okay so I was, like, genuinely skeptical about this — but I actually use it every single morning now.',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'The ordinary available light source.',
        example: 'morning light from a kitchen window to her left',
        required: true,
      },
      {
        name: 'room_audio',
        description: 'The room acoustic and ambient sound.',
        example:
          'a slight kitchen echo, a faint hum from a running dishwasher in the background',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall unpolished visual treatment.',
        example:
          'slightly overexposed near the window, ordinary phone-camera color, no grade applied',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'ugc', 'testimonial', 'advertising', 'vertical', 'native-audio'],
    whyItWorks: `The entire premise of UGC-style advertising is that its credibility comes from reading as unproduced, which means every default Veo applies toward a cleaner, more polished result is actively working against the goal here, and the prompt has to counteract that default explicitly rather than just omitting production cues and hoping the result lands raw by default. Writing the testimonial line as real speech — including a filler word or a slight self-correction — rather than as tightened ad copy targets the specific way audiences detect scripted content: real spoken language is disfluent in small, consistent ways, and a testimonial that is grammatically clean and rhythmically even is one of the fastest tells that it was written rather than spoken, regardless of how casual the setting looks. Explicitly requesting the natural micro-shake of a genuine selfie-style shot rather than a smoothed handheld look matters because Veo's own interpretation of "handheld" sometimes lands closer to a stabilized gimbal move than to actual phone-in-hand footage, and that smoother default is exactly the kind of visual polish that reads as produced the moment it is set next to real UGC content in the same feed. Naming the room's acoustic signature — echo in a bare kitchen versus a flatter sound in a soft-furnished room — and pairing it with a clean voice track is a mismatch that real UGC never has: authentic phone audio always carries the room it was recorded in, and a clean isolated voice over a visually lived-in space is a subtle audio-visual inconsistency that undermines the illusion even when neither element looks wrong in isolation. Finally, explicitly deferring any genuinely produced element — a music bed, a graphic, dramatic lighting — to a later post-production pass over this deliberately raw base clip, rather than asking Veo to generate both the raw authenticity and the polished ad elements in the same shot, respects the fact that those two things are in direct tension: a single generation asked to be simultaneously raw and produced tends to land in an uncanny middle ground that convincingly reads as neither.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-31' }],
    changelog: [
      { date: '2026-07-31', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-multishot-continuation-sequence',
    category: 'veo',
    title: 'Plan a multi-shot narrative sequence using Veo Flow scene extension',
    description:
      "A prompt for planning a multi-shot narrative built on Flow's scene-extension feature, which seeds each new 8-second segment from the previous clip's final frame — structured to explicitly state what must carry over from the prior shot, since anything left unstated gets silently redrawn rather than continued.",
    promptText: `Write a set of chained Veo 3.1 prompts for a multi-shot narrative sequence to be generated using Flow's scene-extension feature, where each new segment is seeded from the final frame of the previous one. This is fundamentally different from writing several independent prompts about the same scene — the extension feature carries visual continuity forward from the actual last frame, but only the continuity facts stated in the new prompt govern what happens to that carried-over state; anything left unstated is not guaranteed to persist and is often silently redrawn.

OVERALL SEQUENCE
{{sequence_summary}}, broken into {{number_of_shots}} chained 8-second segments.

SHOT ONE (the seed)
{{shot_one_description}}, ending on {{shot_one_end_state}} — describe precisely what the final frame should show, since this exact final frame is what the extension feature hands to the next prompt as its starting point.

SHOT TWO (extension from shot one's final frame)
CARRIED OVER FROM THE PREVIOUS SHOT: {{continuity_facts}}. State every fact from shot one's ending that must still be true — the character's position, what they are holding, the time of day, the lighting direction — since the extension model treats the new prompt's text as the authority on what happens next, and a continuity detail the new prompt does not mention is not automatically protected just because it was true in the previous frame.
NEW ACTION: {{shot_two_new_action}}, ending on {{shot_two_end_state}}.

SHOT THREE (extension from shot two's final frame), if needed
CARRIED OVER: {{shot_three_continuity_facts}}.
NEW ACTION: {{shot_three_new_action}}.

CAMERA CONTINUITY
State explicitly in each extension prompt whether the camera holds its position and framing from the previous shot's end or makes a deliberate new move, since an unstated camera instruction on an extension is one of the more common places the sequence produces an unintended jump rather than a continuous or deliberately cut transition.

AUDIO CONTINUITY
If an ambient sound or music element was established in shot one, restate it in each subsequent extension prompt rather than assuming it continues — native audio does not automatically carry across chained generations the way the visual seed frame does.

WHAT TO AVOID
Do not assume a detail survives into the next segment just because it was visible in the previous one's final frame — restate anything load-bearing to the story. Do not chain more than three or four segments without reviewing the actual generated output between each one; continuity drift compounds across a chain, and a small unstated detail lost in segment two becomes a larger, harder-to-fix inconsistency by segment four.

OUTPUT
The full set of chained prompts in generation order, followed by one line per transition naming exactly which continuity facts were carried forward explicitly.`,
    variables: [
      {
        name: 'sequence_summary',
        description: 'The overall narrative arc across the full chained sequence.',
        example:
          'a runner training alone at dawn who is joined partway through by a second runner',
        required: true,
      },
      {
        name: 'number_of_shots',
        description: 'How many chained 8-second segments the sequence is broken into.',
        example: '3',
        required: true,
      },
      {
        name: 'shot_one_description',
        description: 'The first, seed shot.',
        example:
          'a lone runner jogging along an empty riverside path at dawn, mist over the water',
        required: true,
      },
      {
        name: 'shot_one_end_state',
        description: 'Exactly what the final frame of shot one should show.',
        example:
          'the runner mid-stride, seen from behind, approaching a bridge underpass ahead',
        required: true,
      },
      {
        name: 'continuity_facts',
        description:
          "What must explicitly carry over from shot one's ending into shot two.",
        example:
          'same runner, same pace, same dawn mist and lighting direction, still approaching the same bridge underpass',
        required: true,
      },
      {
        name: 'shot_two_new_action',
        description: 'The new action introduced in shot two.',
        example:
          'a second runner falls into stride alongside them as they both emerge from under the bridge',
        required: true,
      },
      {
        name: 'shot_two_end_state',
        description: "Exactly what shot two's final frame should show.",
        example:
          'both runners now running side by side, facing forward toward the rising sun',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1', 'Google Flow'],
    tags: [
      'video',
      'narrative',
      'continuity',
      'multi-shot',
      'scene-extension',
      'storyboard',
    ],
    whyItWorks: `Flow's scene-extension feature works by seeding a new generation from the actual pixels of the previous clip's final frame, which is a real mechanical fact about how the continuation works, not a creative-writing convention — but that seed only supplies the starting visual state, and what happens across the new eight seconds is governed entirely by the new prompt's own text, which is why an unstated continuity fact is not protected simply because it was visibly true a moment ago. This is the specific failure mode the "carried over from the previous shot" section is built to prevent: a chained sequence that only describes the new action in each segment, without restating what must still be true from before, routinely loses small details between segments — a prop disappears from a character's hand, lighting direction subtly shifts, a background element present in the seed frame is redrawn out of existence — because the extension model has no separate memory of "why" the previous frame looked the way it did, only the pixels themselves as a starting point to build the next eight seconds from. Treating audio the same way, and restating an ambient or musical element in every subsequent extension prompt rather than assuming it persists, matters because native audio generation is tied to each individual generation's own prompt text, and there is no audio equivalent of the visual seed-frame carryover — a sound established in shot one has genuinely nothing pulling it forward into shot two unless the new prompt asks for it again. Capping the chain at three or four segments before reviewing actual output, rather than planning a long sequence entirely up front and generating it end to end, respects how continuity errors compound: a small unstated detail lost in segment two is not just a local error, it becomes the new seed state that segment three builds from, so by segment four an unreviewed chain can have drifted from the original plan in ways that are far more expensive to fix retroactively than they would have been to catch after segment two.`,
    verifiedAgainst: [
      { tool: 'Veo 3.1', version: '3.1', date: '2026-08-01' },
      { tool: 'Google Flow', version: '1.5', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Veo 3.1 via Google Flow scene extension.',
      },
    ],
  },
  {
    slug: 'veo-character-consistency-reference-image',
    category: 'veo',
    title: "Keep a character's face consistent across shots using a Flow reference image",
    description:
      'A prompt structured for Flow\'s "ingredients to video" reference-image feature, which anchors a character\'s appearance from an actual uploaded image rather than a text description — written to deliberately avoid re-describing the face in text, since a conflicting text description competes with the image the model is supposed to be locking onto.',
    promptText: `Write a Veo 3.1 prompt intended to be used together with an uploaded reference image in Flow's ingredients-to-video mode, where the reference image — not the text description — is what should govern the character's actual facial appearance across every generated shot. The discipline here is describing action, setting, and camera in full detail while deliberately not re-describing the face, hair, or body type the reference image already establishes, since a text description that conflicts even slightly with the reference image gives the model two different sources of truth about what the character looks like, and it will not reliably favor the image over the text.

REFERENCE IMAGE
{{reference_image_description}} — a note describing what the uploaded image actually shows, for your own tracking, not a substitute for the image itself; the actual appearance comes from the file, not from this line.

WHAT TO DESCRIBE IN TEXT
{{action_and_setting}}. Describe what the character is doing, wearing in this specific shot (if different from the reference image — a costume change is fine to describe in text), and where they are, in full detail — this is exactly the information the reference image cannot supply on its own.

WHAT NOT TO RE-DESCRIBE IN TEXT
Do not restate the character's face, hair color, hair style, body type, or any other physical trait already visible in the reference image, even in passing — every one of those restated details is a chance for the text to say something subtly different from the image, and Flow does not reliably resolve that conflict in the image's favor.

CAMERA
{{camera_direction}} for this specific shot.

LIGHTING AND ENVIRONMENT
{{lighting_and_environment}}, matched to whatever look this shot needs, independent of the reference image's own lighting, since the reference image is only anchoring appearance, not the lighting or setting of the new shot.

STYLE AND MOOD
{{visual_style}}.

CONSISTENCY CHECK ACROSS MULTIPLE SHOTS
{{shots_needing_this_character}}. For each additional shot using the same reference image, repeat this same discipline — describe the new action and setting, never the face — so the character reads as the same person across every shot for the reasons stated above, not because the text happened to describe them identically each time.

WHAT TO AVOID
Do not swap in a different reference image mid-sequence for the same character without expecting a visible discontinuity — a character's appearance is only as consistent as the single reference image anchoring it, and two different photos of even the same real person can anchor subtly different appearances across a sequence.

OUTPUT
The finished prompt for this shot, followed by one line confirming no facial or body description was restated in the text, and a running list of which reference image is anchoring which character across the full sequence.`,
    variables: [
      {
        name: 'reference_image_description',
        description:
          'A tracking note describing what the uploaded reference image shows.',
        example:
          'a headshot of a man in his 40s with short greying hair, uploaded as the character anchor',
        required: true,
      },
      {
        name: 'action_and_setting',
        description:
          'What the character does and wears in this specific shot, and where.',
        example:
          'the man, now wearing a navy suit jacket over the same build shown in the reference, walking into a glass-walled office lobby',
        required: true,
      },
      {
        name: 'camera_direction',
        description: 'The camera movement for this specific shot.',
        example:
          'a slow tracking shot following him from a three-quarter angle as he crosses the lobby',
        required: true,
      },
      {
        name: 'lighting_and_environment',
        description: 'Lighting and setting for this new shot.',
        example:
          'bright, even daylight through floor-to-ceiling glass, a modern corporate lobby',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example: 'clean corporate commercial look, neutral color grade',
        required: true,
      },
      {
        name: 'shots_needing_this_character',
        description:
          'The other shots in the sequence that need this same reference-anchored character.',
        example:
          'a second shot of him sitting down at a boardroom table, and a third of him shaking hands with a colleague',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1', 'Google Flow'],
    tags: [
      'video',
      'character-consistency',
      'reference-image',
      'flow',
      'narrative',
      'branding',
    ],
    whyItWorks: `Flow's ingredients-to-video mode anchors a character's appearance from the pixels of an actual uploaded image rather than from a text description, which is a categorically different mechanism than describing a face in words and hoping the same words produce the same face twice — text-to-video generation has no persistent memory of "the same character" between separate prompts, so two independently written text descriptions of "a man in his 40s with short greying hair" will produce two different faces, while the same reference image anchoring two separate generations produces a recognizably consistent one. This is exactly why re-describing the face in text alongside the reference image is actively counterproductive rather than merely redundant: doing so gives the model two sources of truth about the same attribute, and when the text's wording drifts even slightly from what the image actually shows — a slightly different hair length, an age description that does not quite match — the model has no reliable rule for which source to trust, and the resulting face is often neither fully the reference image nor fully the text description, but some inconsistent blend of both. Restricting the text to action, setting, and camera — the information the reference image genuinely cannot supply — respects the actual division of labor between the two inputs: the image's job is appearance, the text's job is everything the image is a single still frame and cannot express, which is what the character is doing, wearing differently, and where they are in this specific shot. Explicitly warning against swapping reference images mid-sequence addresses a specific and easy mistake: because the anchor is the image itself, not a persistent abstract "character," two different photographs of even the same real person carry subtly different lighting, angle, and expression information, and switching the anchor mid-sequence introduces exactly the kind of visible discontinuity the reference-image workflow exists to prevent in the first place.`,
    verifiedAgainst: [
      { tool: 'Veo 3.1', version: '3.1', date: '2026-08-02' },
      { tool: 'Google Flow', version: '1.5', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Veo 3.1 via Flow ingredients-to-video.',
      },
    ],
  },
  {
    slug: 'veo-automotive-commercial-reveal',
    category: 'veo',
    title: 'Generate an automotive commercial reveal clip with coherent wheel motion',
    description:
      'A Veo 3.1 prompt for a car commercial reveal shot, structured to separate the described motion blur on rotating wheels from the sharp focus on the body, since treating the whole car as one uniform speed is a common cause of a vehicle that looks like it is floating rather than driving.',
    promptText: `Write a Veo 3.1 prompt for an 8-second automotive commercial reveal shot — a moving or static hero shot of a vehicle, structured around one deliberate action and one camera move, matching the discipline any product shot needs but adjusted for the specific ways vehicles fail to render believably in motion.

VEHICLE AND ACTION
{{vehicle_description}}, {{vehicle_action}}. Name exactly one action — a reveal from behind a cover, a drive-past, a static rotating turntable shot — never several combined, since a car simultaneously driving and having its cover pulled off is two separate physical events competing for the same eight seconds.

WHEEL AND MOTION DETAIL
If the vehicle is moving, describe the wheels' motion separately from the body's motion: {{wheel_motion_detail}}. Naming the wheels as spinning with visible motion blur while the body itself stays sharp and in focus is the detail that most often gets left implicit, and an implicit instruction here is where generated vehicles most often look like they are floating or sliding rather than actually driving, because the model defaults to treating the whole vehicle as one uniformly sharp or uniformly blurred object.

CAMERA
{{camera_movement}}, a single tracking or static setup — if tracking a moving vehicle, state that the camera moves at matching speed alongside it, since a camera moving at a mismatched speed relative to the vehicle is a second, independent source of the same "floating" artifact.

ENVIRONMENT AND LIGHTING
{{environment_description}}, with light and reflections described as interacting with the vehicle's specific paint finish — {{paint_finish}} — since a generic "shiny car" instruction under-specifies exactly what the reflected highlights should look like as the vehicle or camera moves.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{audio_description}} — the vehicle's engine or road sound if moving, described physically (a low engine growl rising in pitch, tires on wet asphalt) rather than abstractly, plus environment sound, no music track unless explicitly needed.

WHAT TO AVOID
Do not request a car interior shot and an exterior shot in the same eight-second generation — a cut between interior and exterior is a real edit, not something one continuous generated shot can plausibly contain, and asking for both tends to produce a warped, in-between composite of neither.

OUTPUT
The finished prompt, followed by one line naming the single action and confirming the wheel-motion detail was specified separately from the body's.`,
    variables: [
      {
        name: 'vehicle_description',
        description: 'The specific vehicle.',
        example: 'a matte-grey electric sedan with a low, sloped roofline',
        required: true,
      },
      {
        name: 'vehicle_action',
        description: 'The one action the vehicle performs.',
        example: 'driving past camera at moderate speed along a coastal road',
        required: true,
      },
      {
        name: 'wheel_motion_detail',
        description: "The wheels' motion described separately from the body's sharpness.",
        example:
          'wheels showing clear rotational motion blur while the body panels stay crisp and in focus',
        required: true,
      },
      {
        name: 'camera_movement',
        description: 'The single camera setup and its relative speed to the vehicle.',
        example:
          'a tracking shot moving alongside the car at matching speed, staying level with the front door',
        required: true,
      },
      {
        name: 'environment_description',
        description: 'The setting the vehicle moves through.',
        example: 'a two-lane coastal road with the ocean visible over a low guardrail',
        required: true,
      },
      {
        name: 'paint_finish',
        description: "The vehicle's specific paint finish, for reflection behavior.",
        example:
          'a matte satin finish that reflects light as a soft gradient rather than a sharp highlight',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example: 'clean, modern automotive commercial look, slightly cool color grade',
        required: true,
      },
      {
        name: 'audio_description',
        description: 'The physically described engine, road, and environment sound.',
        example:
          'a quiet electric-motor whine and tire noise on asphalt, faint ocean waves in the background',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'automotive', 'commercial', 'product-video', 'native-audio'],
    whyItWorks: `Vehicles moving at speed present a specific rendering problem most other product categories do not: a real car's wheels rotate far faster than its body translates across the frame, which means the wheels should show heavy rotational motion blur at the exact same instant the body stays crisp and sharp — and if a prompt only says "a car driving past" without separating those two motion states explicitly, the model tends to default to one uniform treatment for the whole vehicle, either blurring the entire car (which looks like a focus mistake) or keeping the wheels unnaturally sharp and static-looking (which is the more common failure and the one that produces the distinctive "floating" look where a vehicle appears to glide rather than drive). Matching the camera's tracking speed explicitly to the vehicle's own described speed addresses a second, independent version of the same problem from the camera side rather than the subject side — a camera drifting even slightly faster or slower than the vehicle it is tracking introduces a relative-motion mismatch between foreground and background that reads as wrong even when the vehicle itself is rendered correctly, because the background's streak length and the vehicle's own sharpness stop agreeing with each other. Naming the specific paint finish and how light interacts with it — a soft gradient highlight on a matte finish versus a sharp specular highlight on a gloss finish — matters because "shiny car" underspecifies the actual visual signature that finish produces as the vehicle or camera moves; a matte and a high-gloss paint job reflect a moving light source in visibly different ways, and leaving that unstated tends to produce a generic, medium-glossy default that matches neither. Ruling out combining an interior shot and an exterior shot in the same generation reflects the same continuous-shot constraint that governs other Veo prompts: a cut from inside the cabin to outside the vehicle is a real edit a human editor makes between two separately filmed setups, not something a single continuous camera move can physically contain, and asking one generation to do both produces a warped composite that commits fully to neither vantage point.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-08-03' }],
    changelog: [
      { date: '2026-08-03', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-architecture-interior-exterior-flythrough',
    category: 'veo',
    title: 'Generate an architectural flythrough that respects real spatial scale',
    description:
      "A Veo 3.1 prompt for an architectural exterior or interior flythrough, structured around a stated camera height and speed that keeps the building's scale physically coherent, since an undescribed flythrough speed is a common cause of a structure whose proportions subtly warp as the camera moves through it.",
    promptText: `Write a Veo 3.1 prompt for an 8-second architectural flythrough — either an exterior approach or an interior glide, not both in the same generation — structured around explicit camera height and speed so the building's actual scale stays coherent as the shot moves.

STRUCTURE AND SHOT TYPE
{{structure_description}}. State clearly whether this is an exterior approach shot or an interior glide, {{shot_type}}, since the two require different camera logic and mixing them in one generation asks the model to invent an impossible transition between outside and inside within a single continuous move.

CAMERA HEIGHT AND SPEED
{{camera_height}}, moving at {{camera_speed}}. Naming an explicit height — eye-level, a low sweeping angle near the ground, an elevated drone-style height — anchors how large the structure should read relative to the camera, and naming an explicit speed (a slow, deliberate glide versus a faster establishing sweep) is what keeps a large structure's proportions from subtly compressing or stretching as the camera covers ground; an unstated speed leaves the model to guess how much distance the camera is meant to cover in eight seconds relative to the building's actual size, and a wrong guess is exactly what produces a structure that looks the wrong scale.

CAMERA PATH
{{camera_path}}, described as one continuous physical route through or around the structure, in the actual order features will be passed, matching the same continuity discipline a real-estate interior walkthrough needs — a described path with an implausible turn or an impossible line of sight through a solid wall is where flythroughs most often show visible warping.

LIGHTING AND TIME OF DAY
{{lighting_and_time}}, consistent across the whole path — no light that would abruptly shift character as the camera reaches a different part of the structure within the same continuous shot.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{ambient_audio}}, quiet and consistent with the described setting, no music unless the use case specifically needs one.

WHAT TO AVOID
Do not ask for a camera path that passes through a solid wall or floor as an implied transition between rooms or between exterior and interior — a flythrough camera has to follow a path a real camera could physically take, through a door, a window, or an open threshold, or the model will render the geometry as warping to accommodate a route that should not exist.

OUTPUT
The finished prompt, followed by one line confirming whether this clip is exterior or interior, and naming the actual physical opening the camera path uses if it crosses a boundary.`,
    variables: [
      {
        name: 'structure_description',
        description: 'The building or structure being shown.',
        example: 'a modern three-story glass-and-timber house on a wooded hillside',
        required: true,
      },
      {
        name: 'shot_type',
        description: 'Whether this is an exterior approach or interior glide.',
        example: 'an exterior approach shot',
        required: true,
      },
      {
        name: 'camera_height',
        description: 'The explicit height the camera is set at.',
        example: 'an elevated height roughly level with the second-story windows',
        required: true,
      },
      {
        name: 'camera_speed',
        description: 'The explicit pace of the camera move.',
        example:
          'a slow, deliberate glide, covering the equivalent of about thirty meters over the full clip',
        required: true,
      },
      {
        name: 'camera_path',
        description:
          'The continuous physical route the camera takes, in the actual order features appear.',
        example:
          'approaching from the treeline, passing the front entrance, curving to reveal the full glass facade',
        required: true,
      },
      {
        name: 'lighting_and_time',
        description: 'Consistent lighting and time of day across the whole path.',
        example:
          'late-afternoon golden light from the west, consistent across the full approach',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example: 'clean architectural photography look, true-to-color, no stylized grade',
        required: true,
      },
      {
        name: 'ambient_audio',
        description: 'The quiet ambient sound matched to the setting.',
        example: 'wind through nearby trees, distant birdsong',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: [
      'video',
      'architecture',
      'flythrough',
      'real-estate',
      'continuous-shot',
      'b-roll',
    ],
    whyItWorks: `A building's apparent scale in a moving shot is a function of how much ground the camera covers relative to how large the structure actually is, and neither of those quantities is knowable to the model unless both are stated — an unnamed camera speed leaves the model to guess how much distance an eight-second glide should cover, and because a large structure and a small one require very different amounts of travel to read at a believable pace, a wrong guess is exactly what produces a building that looks subtly the wrong size relative to its own described features, an error that is hard to name precisely but immediately reads as "off" to anyone who has ever walked past a real building of that type. Stating an explicit camera height does similar work from a different angle: eye-level, a low sweeping angle, and an elevated drone-style height each imply a different relationship between camera and structure, and that relationship is part of what communicates scale to a viewer independent of the structure's absolute size — the same building shot from a low, ground-hugging angle reads as more monumental than the identical building shot from an elevated overview, and leaving the height unstated removes a real compositional lever the model would otherwise apply somewhat arbitrarily. Requiring the camera path to describe one continuous, physically plausible route — through an actual door or opening, never through a solid wall as an implied cut — matters because a flythrough's entire premise is that it is one uninterrupted camera move, and asking the model to imply a transition it cannot physically render (passing through solid material) forces it to warp the geometry around an impossible instruction rather than simply failing to comply, since the model still has to produce eight seconds of continuous frames from wherever the impossible path was described. Explicitly separating exterior and interior into different generations, rather than asking for both in one continuous flythrough, follows from the same logic: crossing from outside to inside a building is a real spatial transition that would require passing through a specific physical threshold at a specific moment, and a single generation asked to cover both without that threshold explicitly placed in the path tends to produce a warped, ambiguous blend of the two spaces rather than a coherent passage between them.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-08-04' }],
    changelog: [
      { date: '2026-08-04', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-sports-action-sequence',
    category: 'veo',
    title:
      'Generate a sports action clip without mixing real-time and slow-motion in one shot',
    description:
      "A Veo 3.1 prompt for a single-athlete action sequence, structured to commit explicitly to either real-time speed or slow motion for the whole clip, since asking for a speed change mid-shot is a common cause of a body's motion warping through the transition.",
    promptText: `Write a Veo 3.1 prompt for an 8-second sports action clip centered on one athlete's single continuous action, committing explicitly to either real-time pace or slow motion for the entire clip — not a speed change partway through, which asks the model to render an unstated transition between two different motion rates within one continuous body's movement.

ATHLETE AND ACTION
{{athlete_description}}, {{single_action}}. Name one continuous athletic action — a sprint stride, a jump, a swing, a dive — not a sequence of several distinct movements, since a body performing two separate athletic actions back to back within eight seconds needs a transition between them that the model has to invent, and human joints and limbs are exactly where that invented transition tends to visibly warp.

SPEED COMMITMENT
{{speed_choice}} for the full clip. If slow motion, describe what specifically should read as slowed — hang time at the peak of a jump, water or sweat droplets suspended mid-air, fabric moving with visible delay — since naming the specific slowed detail gives the model something concrete to render at reduced apparent speed, rather than leaving "slow motion" as an abstract instruction with no specified physical anchor.

CAMERA
{{camera_movement}}, a single move matched to the speed choice — a fast, energetic camera move paired with real-time action, or a smoother, more deliberate move if the clip is slow motion, since a frantic camera move on top of a slow-motion subject fights the very quality slow motion is meant to convey.

ENVIRONMENT AND LIGHTING
{{environment_description}}.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{audio_description}} — if the clip is slow motion, describe the audio as similarly time-stretched and lower in pitch (a deep, drawn-out impact sound) rather than a normal-speed sound layered under a slowed picture, since audio playing at its ordinary pace under visibly slowed motion is an immediate and obvious mismatch.

WHAT TO AVOID
Do not ask for the athlete to perform a second, different action after the first completes within the same eight-second clip — plan a second clip for the next beat instead, and if a sequence of actions is genuinely needed, generate them as separate clips to be cut together, matching the same discipline other multi-action Veo prompts in this library rely on.

OUTPUT
The finished prompt, followed by one line confirming the single committed speed choice and the single named action.`,
    variables: [
      {
        name: 'athlete_description',
        description: 'The athlete performing the action.',
        example: 'a sprinter mid-race, muscles visibly straining',
        required: true,
      },
      {
        name: 'single_action',
        description: 'The one continuous athletic action shown.',
        example: 'launching off the starting blocks into a full sprint stride',
        required: true,
      },
      {
        name: 'speed_choice',
        description:
          'Whether the whole clip is real-time or slow motion, with the specific detail to slow.',
        example:
          'slow motion, with the visible spray of track dust kicked up behind each foot strike hanging in the air',
        required: true,
      },
      {
        name: 'camera_movement',
        description: 'The single camera move, matched to the chosen speed.',
        example:
          'a smooth, deliberate low tracking shot moving alongside at the same pace as the runner',
        required: true,
      },
      {
        name: 'environment_description',
        description: 'The setting.',
        example:
          'an outdoor track under bright stadium floodlights, blurred crowd in the background',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example: 'high-contrast, slightly desaturated, broadcast sports look',
        required: true,
      },
      {
        name: 'audio_description',
        description: 'Audio matched in time-stretch and pitch to the chosen speed.',
        example:
          'a deep, drawn-out foot-strike thud and a low, stretched crowd roar, both time-stretched to match the slow motion',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'sports', 'action', 'slow-motion', 'native-audio'],
    whyItWorks: `Human motion through joints — a sprinting stride, a jump's takeoff and landing, a swing's follow-through — is one of the more physically constrained things a video model has to render correctly, because unlike a rotating product or a drifting camera, a body's motion has to obey real biomechanical continuity from one frame to the next, and asking for two separate athletic actions inside one continuous eight-second clip forces the model to invent a transition between them that has to still look like one physically plausible body, which is exactly the kind of joint-and-limb continuity that tends to visibly warp when the model has no real reference for what movement should bridge the two. Committing explicitly to either real-time or slow motion for the entire clip, rather than implying a speed change partway through, avoids a related problem: a described speed change mid-action asks the model to render the same limb decelerating or accelerating at a moment nothing in the physical action itself would naturally justify, and that arbitrary-seeming rate change is a second, independent source of the same kind of joint-continuity distortion. Naming a specific physical detail that should read as slowed — suspended dust, hang time at a jump's peak, fabric moving with visible delay — rather than leaving "slow motion" as an abstract instruction gives slow motion something concrete to actually demonstrate; without a named anchor, the model's interpretation of "slow motion" can end up looking closer to a subtly reduced-speed real-time clip than to footage that visibly earns the term through details only slow motion reveals. Matching the audio's own time-stretch and pitch to the chosen visual speed is not a stylistic flourish but a direct consistency requirement: real slow-motion footage's audio is either dropped entirely or itself pitched and stretched down, and a normal-paced sound effect playing under visibly slowed motion is an immediate mismatch a viewer registers as wrong before they consciously identify why, since the ear and eye are processing the same physical event and expect them to agree on its actual duration.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-08-05' }],
    changelog: [
      { date: '2026-08-05', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-macro-slow-motion-liquid-splash',
    category: 'veo',
    title: 'Generate a macro slow-motion liquid splash clip with named fluid physics',
    description:
      'A Veo 3.1 prompt for a macro slow-motion splash or pour, built around explicitly named viscosity and droplet behavior, since fluid dynamics is one of the hardest physical behaviors to infer without being told exactly how the specific liquid should move.',
    promptText: `Write a Veo 3.1 prompt for an 8-second macro slow-motion clip of a single liquid splash, pour, or impact, structured around explicitly named fluid physics rather than a generic "splash in slow motion" instruction, since the specific behavior of a liquid — how viscous it is, how large its droplets are, how it separates on impact — has to be stated for the model to render it correctly rather than defaulting to a generic water-like behavior regardless of what liquid was actually named.

LIQUID AND ACTION
{{liquid_description}}, {{splash_action}}. Name the liquid specifically — water, honey, cream, wine — not just "liquid," since viscosity is the single largest driver of how a fluid should move and a generic instruction defaults to a thin, water-like behavior even when a thick liquid like honey was actually described elsewhere in the prompt.

FLUID PHYSICS DETAIL
{{viscosity_and_droplet_behavior}}. Describe the specific droplet size and separation behavior for this liquid — thin water breaks into fine, fast-scattering droplets; a thick syrup separates into slower, larger ropes and blobs that hang and stretch rather than scatter — since this physical detail is what actually distinguishes one liquid from another on screen far more than color does.

CAMERA
A locked-off extreme macro shot, {{camera_framing}}, capturing the moment of impact and its immediate aftermath — no camera movement, since a moving camera this close to a fast, chaotic fluid event compounds the amount of motion the model has to resolve correctly at once.

SLOW MOTION DETAIL
The moment should read as significantly slowed — describe the specific detail that sells the slow motion, {{slow_motion_anchor}}, such as individual droplets visibly suspended mid-air or a surface tension bubble taking a full second to collapse.

LIGHTING
{{lighting_description}}, angled specifically to catch the liquid's surface — backlight to make droplets read as individually lit spheres, a raking side light to show a viscous liquid's sheen — matched to the fluid physics named above.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{audio_description}} — if genuinely slow motion, describe the impact sound as time-stretched and lower in pitch, matching the same audio-speed discipline any slow-motion clip needs, rather than a normal-speed splash sound under visibly slowed footage.

WHAT TO AVOID
Do not name a viscous liquid and then also describe its behavior using thin-liquid language like "splashing" or "spraying" — those verbs carry an implicit low-viscosity assumption that will fight the named liquid's actual physical properties, producing a result that looks like water dyed the wrong color rather than the actual liquid described.

OUTPUT
The finished prompt, followed by one line confirming the named liquid's viscosity matches every verb used to describe its motion.`,
    variables: [
      {
        name: 'liquid_description',
        description: 'The specific liquid, named precisely.',
        example: 'thick raw honey',
        required: true,
      },
      {
        name: 'splash_action',
        description: 'The single splash, pour, or impact action.',
        example: 'being poured from a height onto a stack of pancakes',
        required: true,
      },
      {
        name: 'viscosity_and_droplet_behavior',
        description: "The liquid's specific viscosity and how it separates on impact.",
        example:
          'a thick, unbroken ribbon that folds and pools rather than scattering, with slow, heavy drips trailing behind the pour',
        required: true,
      },
      {
        name: 'camera_framing',
        description: 'The specific macro framing.',
        example:
          'framed tightly on the point where the honey first contacts the top pancake',
        required: true,
      },
      {
        name: 'slow_motion_anchor',
        description: 'The specific detail that visually sells the slow motion.',
        example:
          'a single trailing drip stretching and elongating before finally breaking free and falling',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'Lighting angled to reveal the fluid physics.',
        example:
          'a warm backlight positioned to make the honey glow amber as it catches the light',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example: 'warm, appetizing, high-detail food commercial look',
        required: true,
      },
      {
        name: 'audio_description',
        description:
          'The time-stretched, lower-pitched impact sound matching the slow motion.',
        example:
          'a low, slow, thick pouring sound, deeper in pitch than a normal-speed pour',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'macro', 'slow-motion', 'food', 'product-video', 'fluid-physics'],
    whyItWorks: `Fluid dynamics is one of the harder physical behaviors for a generative video model to infer correctly, because a liquid's movement is determined almost entirely by a property — viscosity — that is invisible in a single still frame and only becomes apparent through how the fluid behaves over time, which means naming the liquid alone ("honey") is necessary but not sufficient; the model also needs the specific behavioral consequence of that viscosity spelled out, since a generic splash instruction defaults to the thin, fast, fine-droplet behavior of water regardless of what liquid was named, unless the droplet size and separation pattern for this specific liquid is described directly. This is exactly why naming the verb matters as much as naming the liquid: describing a thick liquid's motion with thin-liquid verbs like "splashing" or "spraying" smuggles in a low-viscosity assumption that directly contradicts the named liquid, and the model resolves that contradiction by producing something that looks like water dyed the intended color rather than a liquid with the intended physical weight and behavior — the verb choice is doing real physical work, not just stylistic flavor. Anchoring the slow motion to one specific, concrete detail — a trailing drip stretching before it breaks free, a droplet suspended mid-air — rather than leaving "slow motion" unanchored gives the model something to actually demonstrate as evidence of the slowed timescale; without that anchor, the difference between "slow motion" and "filmed at a slightly reduced real-time speed" can be difficult for the model to commit to distinctly, since both would technically satisfy an unspecified instruction to "slow it down." Locking the camera off entirely rather than adding any movement addresses a compounding-complexity problem specific to fast, chaotic fluid events at macro scale: a splash or pour already asks the model to resolve a large amount of fine, fast-changing detail within a tight frame, and adding camera movement on top forces it to simultaneously track that motion relative to a moving reference point, which is where macro fluid shots most often lose coherence at the fluid's edges — exactly the detail the shot exists to showcase.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-08-06' }],
    changelog: [
      { date: '2026-08-06', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-time-lapse-environmental-change',
    category: 'veo',
    title:
      'Generate a time-lapse style clip by describing environmental change, not a speed setting',
    description:
      "A Veo 3.1 prompt for a time-lapse-style scene, written around describing the actual state change an environment goes through — moving shadows, shifting sky color, cloud travel — since Veo has no literal time-lapse speed control and responds to described change over the clip's fixed duration instead.",
    promptText: `Write a Veo 3.1 prompt for an 8-second time-lapse-style clip. Veo has no literal fast-forward or frames-per-second control exposed in the prompt itself, so a time-lapse effect has to be produced by describing an environmental state change large enough to read as compressed time within the fixed eight-second duration, not by simply labeling the clip "time-lapse" and expecting the model to infer an appropriate speed on its own.

SCENE AND SUBJECT
{{scene_description}}, held from {{camera_position}} for the entire clip — a time-lapse in this format is a static or very slow-drift shot of a place, not a moving subject, since the compressed-time effect comes from the environment changing around a fixed vantage point.

ENVIRONMENTAL CHANGE TO SHOW
{{environmental_change}}. Describe the actual before-and-after state the environment moves through — the sun's position and shadow length shifting noticeably, clouds visibly traveling and reshaping, the sky's color shifting from one hue toward another — as concretely as possible, since this described change, not a labeled "time-lapse" instruction, is what the model actually has to render across the duration.

PACE OF CHANGE
{{pace_description}}. State roughly how much real-world time this eight-second clip is meant to compress — a few hours of a sunset, or a full day-to-night cycle — since the amount of described change should scale with how much compression is being asked for; a clip claiming to compress an entire day needs correspondingly dramatic named shifts in light and sky color, not the same subtle change that would suit a compressed twenty minutes.

WHAT STAYS FIXED
{{static_elements}}. Name what should remain visually unchanged throughout — a building's position, a mountain's silhouette — since an unstated static element sometimes drifts or subtly changes anyway if nothing anchors it as fixed against everything else that is deliberately changing.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{audio_description}} — keep this understated or largely absent, since a genuinely time-compressed environment has no real continuous soundtrack to match; most time-lapse footage is silent or carries a separately added score, and native audio generated to match a compressed timescale tends to read as an odd, smeared blend rather than anything coherent.

WHAT TO AVOID
Do not include a moving person, vehicle, or animal in a time-lapse shot unless the intent is specifically a "hyperlapse" style with fast, blurred motion for living subjects — a person rendered at the same compressed rate as the sky and shadows around them produces an uncanny, physically inconsistent result, since a body cannot move at a genuinely time-lapsed rate the way light and weather can.

OUTPUT
The finished prompt, followed by one line stating how much real-world time this specific eight-second clip is meant to represent, so the named environmental change can be checked against that scale.`,
    variables: [
      {
        name: 'scene_description',
        description: 'The scene being shown over compressed time.',
        example: 'a city skyline seen from a rooftop, facing west',
        required: true,
      },
      {
        name: 'camera_position',
        description: 'The fixed or very-slow-drift camera position.',
        example: 'a static wide shot from a fixed rooftop vantage point',
        required: true,
      },
      {
        name: 'environmental_change',
        description: 'The specific before-and-after environmental state change.',
        example:
          'the sky shifting from bright blue through orange and deep purple as the sun sets behind the buildings, city lights beginning to switch on',
        required: true,
      },
      {
        name: 'pace_description',
        description: 'How much real-world time the clip compresses.',
        example: 'roughly two hours of a full sunset compressed into the eight seconds',
        required: true,
      },
      {
        name: 'static_elements',
        description: 'What should remain visually fixed and unchanged.',
        example:
          'the building silhouettes and skyline shape stay exactly fixed against the changing sky',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example: 'clean, high-contrast, saturated sunset color palette',
        required: true,
      },
      {
        name: 'audio_description',
        description: 'The minimal or absent audio treatment.',
        example: 'near-silent, a very faint distant city hum, no music',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'time-lapse', 'environment', 'b-roll', 'landscape'],
    whyItWorks: `Veo has no exposed control that literally speeds up rendered time the way a real camera's intervalometer does, which means the label "time-lapse" by itself is not an instruction the model can act on directly — what actually produces the effect is describing an environmental state change large enough that rendering it within a fixed eight-second clip reads as compressed time, and that is a fundamentally different kind of instruction than naming a genre or a technique. This is why the pace-of-change guidance matters as much as the change itself: the amount of described transformation has to scale with how much real time is being claimed as compressed, since a clip labeled as compressing a full day needs a correspondingly dramatic shift in light and sky color to actually read as a day's worth of change, while the same dramatic shift would look wrong and unmotivated if the prompt only claimed to compress twenty minutes — the described change is the only signal available for how much time supposedly passed, and an unscaled description defaults to whatever subtle-to-moderate shift the model considers a generic sunset regardless of the claimed timescale. Explicitly naming which elements should stay fixed throughout, rather than assuming a static skyline or mountain simply stays put by default, closes a real gap: everything in the described scene is otherwise a candidate for change over the clip's duration, and without an explicit anchor, elements that were only meant to provide a stable reference point for the changing sky can drift or subtly reshape along with everything else, undermining the fixed vantage point the whole effect depends on for contrast. Ruling out moving people, vehicles, or animals unless a fast-motion hyperlapse effect is specifically intended reflects a real physical inconsistency: light, weather, and shadow position can plausibly change at a compressed rate because nothing about their motion has a fixed, known real-world speed a viewer intuitively checks against, but a human body has an intuitively familiar walking or moving pace, and rendering a person at the same compressed rate as the sky around them produces a specific uncanny mismatch — a person who appears to glide or flicker unnaturally fast while everything else compresses at what reads as a slower, more ambient rate.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-08-07' }],
    changelog: [
      { date: '2026-08-07', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-anime-2d-cel-shaded-style',
    category: 'veo',
    title: 'Generate an anime-style 2D clip that commits fully to flat cel-shading',
    description:
      'A Veo 3.1 prompt for a 2D anime-style clip, built around explicit cel-shading and line-art vocabulary rather than the single word "anime," since an underspecified style label tends to produce a photoreal-leaning hybrid instead of a fully committed flat-shaded look.',
    promptText: `Write a Veo 3.1 prompt for an 8-second clip in a 2D anime-influenced animation style, structured around explicit cel-shading and line-art vocabulary rather than relying on the single word "anime" to carry the whole style instruction, since that one word underspecifies exactly which visual conventions should apply and tends to produce a hybrid result that leans partway back toward photorealism rather than committing fully to a flat-shaded look.

SUBJECT AND ACTION
{{subject_description}}, {{action}}. Describe the action as it would actually read in this style — anime motion is frequently more stylized and less physically continuous than live-action motion, favoring held poses and sharp directional movement over smooth interpolation, so naming that expectation explicitly steers the model away from defaulting to realistic, smoothly interpolated motion layered under a flat-shaded look.

LINE AND SHADING STYLE
{{line_and_shading_style}}. Name the specific rendering conventions — clean black outlines, flat color fills with hard-edged shadow shapes rather than soft gradients, limited color palette per character — since these specific technical choices are what visually define the style, far more precisely than the word "anime" alone communicates.

ERA AND INFLUENCE REFERENCE
{{era_reference}}, if a specific visual era or influence matters — naming a specific stylistic period ("90s cel animation" versus "modern digital anime") changes the actual line weight, color saturation, and shading approach the model leans toward, since those two eras look meaningfully different from each other.

ENVIRONMENT AND BACKGROUND
{{background_style}}, rendered in the same flat, stylized treatment as the foreground subject — a photoreal or heavily 3D-rendered background behind a flat-shaded 2D character is a common and immediately visible mismatch, since the two rendering styles do not blend convincingly in the same frame.

CAMERA
{{camera_movement}} — anime camera language often favors simpler, more graphic moves (a hard cut-feeling push, a static hold with only the subject animating) over the smooth, continuous camera moves live-action favors; naming that expectation keeps the camera language consistent with the rest of the stylistic commitment.

AUDIO
{{audio_description}}, matched tonally to the style rather than to realistic ambient sound.

WHAT TO AVOID
Do not describe any element of the scene — lighting, texture, a background object — in photorealistic terms alongside the cel-shaded instruction; a single photoreal detail dropped into an otherwise flat-shaded scene is where this style most visibly breaks, since the model will render that one detail with realistic shading and texture that clashes against everything else in the frame.

OUTPUT
The finished prompt, followed by one line confirming that every element described — subject, background, and camera — commits to the same named stylistic register with nothing left in photorealistic language.`,
    variables: [
      {
        name: 'subject_description',
        description: 'The character or subject.',
        example: 'a young swordfighter with spiky red hair and a torn cloak',
        required: true,
      },
      {
        name: 'action',
        description:
          'The action, described in stylized rather than realistic motion terms.',
        example:
          'drawing a sword in one sharp, held-pose motion, cloak whipping out behind in a stylized snap rather than a smooth drift',
        required: true,
      },
      {
        name: 'line_and_shading_style',
        description: 'The specific line and shading conventions.',
        example:
          'clean bold black outlines, flat color fills, hard-edged triangular shadow shapes, no soft gradients',
        required: true,
      },
      {
        name: 'era_reference',
        description: 'A specific stylistic era or influence, if relevant.',
        example:
          'late-90s cel animation, slightly heavier line weight and more muted palette than modern digital anime',
        required: true,
      },
      {
        name: 'background_style',
        description: 'The background, rendered in the same flat stylistic treatment.',
        example:
          'a simplified painted-style rocky cliff backdrop, flat color blocks, no photoreal texture',
        required: true,
      },
      {
        name: 'camera_movement',
        description: 'The camera language, matched to the stylistic register.',
        example:
          'a static hold with only the character animating, a hard graphic push-in on the final held pose',
        required: true,
      },
      {
        name: 'audio_description',
        description: 'Audio matched tonally to the style.',
        example:
          'a sharp stylized sword-draw sound effect, a low dramatic sting, no realistic ambient room tone',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'anime', '2d-animation', 'cel-shading', 'stylized'],
    whyItWorks: `The single word "anime" carries an enormous range of actual visual conventions bundled inside it, and asking Veo to render "an anime-style clip" without specifying which of those conventions apply gives the model a wide, ambiguous target that it frequently resolves as a compromise — some cel-shading vocabulary layered over motion, lighting, or texture choices that lean back toward the photorealistic training data the model has vastly more of, which is why explicitly naming the line and shading conventions (hard-edged flat shadow shapes, clean outlines, no soft gradients) does real work that the single genre word does not: it specifies the actual rendering rules rather than a vague aesthetic direction. Naming the expected motion style matters for a related but distinct reason — anime animation genuinely uses a different visual grammar for movement than live-action or photoreal 3D does, favoring held poses and sharp directional snaps over continuous physically-interpolated motion, and a model asked only for "anime style" visually but given an action description written the way a live-action action beat would be described tends to render smoothly interpolated realistic motion underneath a flat-shaded skin, producing a visibly hybrid result that commits to neither convention fully. Naming a specific era or influence reference sharpens the target further, since "90s cel animation" and "modern digital anime" genuinely differ in line weight, color saturation, and shading approach, and a model given only the unqualified genre word has to default to some blend of eras rather than one identifiable look. The rule against mixing any photorealistic detail into an otherwise flat-shaded scene addresses the most visible way this style actually breaks in practice: a single element — a background rendered with real-world texture and lighting gradients, a prop shaded with photoreal specular highlights — sitting next to flat-shaded, outlined 2D elements creates an immediately visible clash, because the two rendering logics do not blend into one coherent frame the way a live-action shot with one slightly off detail might still hold together; stylized flat shading and photorealistic shading are different enough as systems that any leftover photoreal element reads as an obvious seam rather than a subtle imperfection.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-08-08' }],
    changelog: [
      { date: '2026-08-08', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-stop-motion-claymation-style',
    category: 'veo',
    title: 'Generate a stop-motion claymation-style clip using tactile material cues',
    description:
      'A Veo 3.1 prompt for a claymation-style clip built around described physical texture — visible tool marks, fingerprints, slight surface irregularity — since Veo does not literally render at a reduced frame rate and has to be steered toward the look through material description instead.',
    promptText: `Write a Veo 3.1 prompt for an 8-second clip in a stop-motion claymation style. Veo generates smooth continuous motion by default and has no literal control for rendering at a reduced stop-motion frame rate, so the claymation look has to come from describing the physical material and its imperfections explicitly, rather than from a technical frame-rate instruction the model cannot actually act on.

CHARACTER AND MATERIAL
{{character_description}}, sculpted from {{clay_material_detail}}. Describe the material's actual surface qualities — visible fingerprints and tool marks left in the clay, slightly uneven or lumpy surfaces rather than a perfectly smooth CGI finish, matte non-reflective color — since these tactile details are what a viewer's eye reads as "handmade" far more reliably than motion timing does.

SET AND PROPS
{{set_description}}, built from the same tactile, handmade materials as the character — miniature props with visible texture, a background that reads as a physical tabletop set rather than a digitally rendered environment.

ACTION
{{action_description}}. Name one simple, deliberate action — claymation movement in the real technique is inherently a little imprecise and slightly jerky between poses, and describing the action as "deliberate, held poses connected by short, slightly abrupt movement" rather than smooth continuous motion nudges the model's interpretation of the movement itself closer to the actual look, even without a literal frame-rate control.

CAMERA
{{camera_movement}} — a simple, minimal camera move, since elaborate camera choreography reads as distinctly un-claymation; real stop-motion sets are almost always shot with simple, limited camera setups because of the medium's own practical constraints, and matching that limitation in the prompt reinforces the aesthetic.

LIGHTING
{{lighting_description}}, with visible, slightly imperfect shadows consistent with practical tabletop lighting rather than a polished studio setup.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{audio_description}} — describe the sound with a slightly lo-fi, practical quality, since claymation's audio character is typically simpler and less produced than a fully mixed modern soundtrack.

WHAT TO AVOID
Do not describe the clay surfaces as smooth, glossy, or perfectly uniform — a smooth, glossy surface reads as CGI rendered to look vaguely clay-colored rather than as an actual handmade sculpture, and it is the single fastest way this prompt drifts away from the claymation look it is meant to produce.

OUTPUT
The finished prompt, followed by one line confirming every described surface — character, props, and set — carries the same handmade material imperfection.`,
    variables: [
      {
        name: 'character_description',
        description: 'The claymation character.',
        example: 'a small round-bodied fox character with oversized clay ears',
        required: true,
      },
      {
        name: 'clay_material_detail',
        description: "The clay's specific tactile qualities.",
        example:
          'orange plasticine with visible fingerprint indentations along the body and slightly uneven, lumpy limbs',
        required: true,
      },
      {
        name: 'set_description',
        description: 'The set and props, in matching tactile materials.',
        example:
          'a miniature tabletop forest set with felt moss, twig trees, and a visibly handmade cardboard sky backdrop',
        required: true,
      },
      {
        name: 'action_description',
        description: 'The single deliberate action, described with held poses.',
        example:
          'the fox hopping forward in three short, deliberate hops, each landing held briefly before the next',
        required: true,
      },
      {
        name: 'camera_movement',
        description: 'The simple, minimal camera move.',
        example:
          'a static shot, or a very slight, simple push-in with no complex movement',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'Practical, slightly imperfect tabletop lighting.',
        example:
          'a single warm desk-lamp-style light casting a soft, slightly uneven shadow behind the fox',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example: 'warm, handmade, storybook charm — like a classic stop-motion short',
        required: true,
      },
      {
        name: 'audio_description',
        description: 'A lo-fi, practical sound treatment.',
        example: 'a soft, simple foley-style thump for each hop, no polished music score',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'stop-motion', 'claymation', 'stylized', '2d-animation'],
    whyItWorks: `Real stop-motion claymation gets its visual signature from two things that have nothing to do with frame rate at the level a viewer actually notices — the tactile imperfection of hand-sculpted clay and a slightly imprecise, pose-to-pose quality of movement — and since Veo has no literal frame-rate dial to invoke, describing those two things directly is the only lever actually available to steer the model toward the look, which is why the material-surface instructions do more real work here than any attempt to name a technical frame-rate would. Naming specific surface imperfections — fingerprints, tool marks, slightly lumpy uneven limbs — targets the exact visual detail that reads as "handmade" to a viewer's eye faster than motion timing does, and it is also the detail most easily lost if left unstated, since a model asked only for "claymation style" without material specifics has a strong pull toward rendering a smooth, glossy, CGI-clean surface that is vaguely clay-colored rather than an object that looks like actual clay someone's hands shaped. Describing the action as held poses connected by short, slightly abrupt movement rather than smooth continuous motion is doing the closest available approximation of the real technique's actual constraint — genuine stop-motion is built frame by frame from physically repositioned poses, which produces a subtly different motion quality than continuously filmed live action, and while Veo cannot literally replicate that frame-by-frame process, describing the resulting motion quality in words nudges its continuous-motion default toward something closer to that held-pose rhythm than an unqualified "claymation" label would. Explicitly ruling out smooth or glossy surfaces closes the most common way this whole approach fails: even with every other instruction correct, a single described smooth or glossy surface anywhere in the frame pulls the result back toward a CGI-rendered look, because smoothness and gloss are strong, specific visual signals the model associates far more with rendered 3D graphics than with photographed physical clay, and one such detail can undercut every other correctly-described tactile cue in the same shot.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-08-08' }],
    changelog: [
      { date: '2026-08-08', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-retro-vhs-analog-aesthetic',
    category: 'veo',
    title: 'Generate a retro VHS-style clip with named analog signal artifacts',
    description:
      'A Veo 3.1 prompt for a retro analog-video aesthetic, built around naming specific VHS signal artifacts — scan lines, chromatic fringing, tape warp, tracking noise — since a vague "retro" or "vintage" label tends to produce only a warm color grade without the actual analog degradation that sells the format.',
    promptText: `Write a Veo 3.1 prompt for an 8-second clip styled to look like it was recorded on and played back from analog VHS tape, built around naming the specific signal artifacts that format actually produces, since a vague instruction like "retro" or "vintage look" tends to get resolved as a warm color grade and some added grain, without the distinctive analog degradation that is what actually makes footage read as VHS rather than just old-looking.

SUBJECT AND ACTION
{{subject_description}}, {{action}}.

VHS SIGNAL ARTIFACTS
{{artifact_list}}. Name the specific artifacts wanted — horizontal scan lines rolling slowly up the frame, chromatic fringing where red and blue channels visibly separate at high-contrast edges, a soft tape-warp waver at the frame edges, faint horizontal tracking noise bands, slightly blown-out and bleeding highlights — since each of these is a distinct, nameable visual signature, and naming several together rather than relying on one generic "VHS filter" word produces a result closer to how those artifacts actually compound in real degraded tape footage.

COLOR AND CONTRAST
{{color_treatment}}. Describe the specific color shift — slightly muted, faintly warm-shifted, or with a specific tint bias — since real VHS color reproduction is a distinct, describable degradation, not simply "faded."

CAMERA
{{camera_movement}} — a simple period-appropriate camcorder move, since VHS-era home video cameras had real physical limitations (a slightly slow, imprecise zoom, occasional autofocus hunting) that a viewer associates with the era; naming that specific camera limitation reinforces the format rather than pairing period-accurate signal artifacts with an impossibly smooth, modern-feeling camera move.

ENVIRONMENT AND LIGHTING
{{setting_description}}.

STYLE AND MOOD
{{visual_style}}.

AUDIO
{{audio_description}}, with the audio itself described as narrow-band and slightly hissy, consistent with analog tape audio fidelity, not a clean modern recording — a crisp modern audio track under a heavily VHS-degraded picture is a mismatch that undercuts the illusion the same way it would in an archival-documentary prompt.

WHAT TO AVOID
Do not ask for the VHS artifacts on top of an otherwise pristine, sharply detailed, high-dynamic-range image — real VHS footage's overall resolution and dynamic range were themselves limited, so a prompt describing crisp, sharp, high-detail visuals plus VHS artifacts layered on top produces an internally inconsistent result; describe the base image itself as lower-resolution and softer, with the named artifacts as the visible degradation on top of that already-softer base.

OUTPUT
The finished prompt, followed by one line listing which specific named artifacts were included, so the result can be checked against that exact list rather than a vague "VHS look."`,
    variables: [
      {
        name: 'subject_description',
        description: 'The subject of the clip.',
        example: 'a family gathered around a birthday cake in a living room',
        required: true,
      },
      {
        name: 'action',
        description: 'The action shown.',
        example: 'blowing out candles as everyone claps',
        required: true,
      },
      {
        name: 'artifact_list',
        description: 'The specific named VHS signal artifacts to include.',
        example:
          'faint horizontal scan lines, mild chromatic fringing at the candle flames, a soft tape-warp waver near the frame edges',
        required: true,
      },
      {
        name: 'color_treatment',
        description: 'The specific color degradation.',
        example:
          'slightly warm-shifted with a faint magenta tint bias, mildly muted contrast',
        required: true,
      },
      {
        name: 'camera_movement',
        description: 'The period-appropriate camcorder limitation.',
        example:
          'a slightly slow, imprecise zoom-in with a brief moment of autofocus hunting before it settles',
        required: true,
      },
      {
        name: 'setting_description',
        description: 'The setting and lighting.',
        example:
          'a warmly lit living room, ordinary overhead lamp light, slightly overexposed near the candles',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'Overall visual treatment.',
        example: 'soft, slightly low-resolution, nostalgic home-video feel',
        required: true,
      },
      {
        name: 'audio_description',
        description: 'The narrow-band, slightly hissy audio treatment.',
        example:
          'laughter and clapping, thin and narrow-band with a faint constant tape hiss underneath',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'vhs', 'retro', 'analog', 'stylized', 'nostalgia'],
    whyItWorks: `A vague instruction like "retro" or "vintage" underspecifies which of several very different degraded-media looks is actually intended, and left that open, a model tends to resolve it toward the safest, most generic interpretation — a warm color grade with some added grain — because that combination shows up across many different "old-looking" requests in its training data, while VHS specifically has a distinct set of signal-processing artifacts (scan lines, chromatic fringing, tape warp, tracking noise) that are genuinely different from film grain or a simple sepia tint and have to be named individually to be reliably rendered rather than substituted for. Naming several of those artifacts together rather than relying on one catch-all "VHS filter" instruction matters because real degraded tape footage shows these artifacts compounding simultaneously — scan lines and chromatic fringing and a soft edge waver typically co-occur in genuine VHS playback, not in isolation — and a prompt that names only one of them produces a result that reads as a single stylized effect applied to modern footage rather than as an integrated analog signal chain degrading the whole image at once. Describing the base image itself as lower-resolution and softer, rather than pristine and sharp with artifacts layered on top, targets a specific internal-consistency failure: real VHS's actual limitation was never just surface artifacts on an otherwise perfect image, the format's fundamental resolution and dynamic range were themselves limited, so asking for crisp, high-detail visuals plus VHS-style artifacts produces two contradictory claims about the same footage's underlying quality, and the model has no principled way to reconcile "sharp and detailed" with "degraded analog tape" other than picking one and letting the other slip. Naming the period-appropriate camcorder limitation — a slow, imprecise zoom, momentary autofocus hunting — closes the same kind of gap the archival-documentary prompt in this library addresses for camera movement generally: a technically perfect, smooth, modern camera move paired with authentic-looking analog signal artifacts is a mismatch a viewer will register even without naming it, because the two signals (how the footage was captured, and how the tape degraded afterward) are supposed to belong to the same limited-era technology, not to a modern camera with a vintage filter slapped on top.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-08-09' }],
    changelog: [
      { date: '2026-08-09', note: 'Initial publish, verified against Veo 3.1.' },
    ],
  },
  {
    slug: 'veo-fix-common-motion-artifacts',
    category: 'veo',
    title:
      'Rewrite a failing Veo prompt to remove the compound actions causing motion artifacts',
    description:
      'A diagnostic prompt-rewriting workflow for a Veo clip that came out warped or morphing — decomposes the failing prompt into its separate actions, isolates which one is the likely cause, and uses the negativePrompt field to suppress specific recurring artifacts rather than relying on it to fix a compound-action problem it cannot solve.',
    promptText: `Diagnose and rewrite a Veo 3.1 prompt that produced a clip with visible motion artifacts — warped limbs, morphing between two states, geometry that distorts mid-shot, or an object that changes shape unexpectedly. This is a rewriting task, not a generation task: the goal is a corrected prompt, plus an explanation of which specific instruction most likely caused the artifact, since a negative prompt alone typically cannot fix an artifact whose root cause is a compound action asking for two incompatible things inside one continuous shot.

FAILING PROMPT
{{original_prompt}}

WHAT THE OUTPUT ACTUALLY SHOWED
{{observed_artifact}}. Describe exactly what looked wrong and roughly when in the clip it happened, since the timing often points to which described element was active at that moment.

DIAGNOSIS STEP
Break the failing prompt into its separate instructions — one subject, one action, one camera move, one lighting change, and so on — and identify which two or more of them are actually asking for incompatible or simultaneous things within the same continuous shot. {{suspected_cause}}. State this suspicion explicitly and check it against where in the clip the artifact appeared; an artifact appearing at the exact moment two described actions would have to overlap is strong evidence that compound action, not a rendering fluke, caused it.

REWRITE PRINCIPLE
Rewrite the prompt to contain exactly one subject action and exactly one camera movement for this clip's duration. If the original intent genuinely needed two distinct actions or a mid-shot transition, split it into two separate generations — a first shot and a continuation — rather than trying to force both into one clip, following the same one-action-per-shot discipline other prompts in this library rely on.

NEGATIVE PROMPT FIELD
If the interface exposes a negative-prompt field (the Vertex AI Veo API accepts one directly; some consumer interfaces do not expose it), add {{negative_prompt_terms}} — specific recurring artifact terms like "warped hands, extra limbs, morphing, blurry text, distorted geometry" — as a genuine second line of defense against a small residual chance of the same artifact recurring, not as the primary fix; a negative prompt suppresses the model's tendency toward a named failure mode, it does not resolve a positive prompt that is still structurally asking for two incompatible things at once.

WHAT TO AVOID
Do not treat the negative-prompt field as a substitute for fixing the actual compound-action problem in the positive prompt — adding "no morphing" to a prompt that still describes two overlapping actions addresses the symptom's name without removing its actual cause, and the underlying structural conflict usually still produces the artifact.

OUTPUT
1. The specific instruction identified as the likely cause, with reasoning.
2. The rewritten, single-action prompt.
3. If a second shot is genuinely needed, that shot's separate prompt.
4. The negative-prompt terms to add, if the interface supports them.`,
    variables: [
      {
        name: 'original_prompt',
        description: 'The exact prompt that produced the failing clip.',
        example:
          'A chef flipping a pancake while the camera orbits around the pan and zooms in, kitchen steam rising, warm lighting.',
        required: true,
      },
      {
        name: 'observed_artifact',
        description:
          'What actually went wrong in the generated output, and roughly when.',
        example:
          "the chef's hand and wrist visibly warped and re-formed twice, both times right as the camera appeared to be mid-orbit around the pan",
        required: true,
      },
      {
        name: 'suspected_cause',
        description:
          'An initial guess at which combined instruction is the likely cause, to check against the diagnosis.',
        example:
          'the combined orbit-and-zoom camera move is likely fighting the flipping hand motion, since both are independent movements the model has to resolve in the same frames',
        required: true,
      },
      {
        name: 'negative_prompt_terms',
        description:
          'The specific artifact terms to add to the negative-prompt field, if supported.',
        example:
          'warped hands, extra fingers, morphing, distorted geometry, blurry motion smear',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: [
      'video',
      'troubleshooting',
      'negative-prompt',
      'prompt-engineering',
      'quality-control',
    ],
    whyItWorks: `The most common root cause of visible motion artifacts in short generated clips is not a rendering failure in isolation but a structural conflict inside the positive prompt itself — two or more instructions asking the model to resolve incompatible motion within the same continuous frames, most often a compound camera move (an orbit and a zoom together) fighting a subject's own independent motion (a hand flipping something) — which is why this workflow's first move is decomposing the failing prompt into its separate instructions rather than jumping straight to a negative-prompt patch; a patch applied without first identifying the structural cause treats a symptom's name as if naming it were the same as removing it. Checking the artifact's timing against which described elements were active at that moment is a genuinely diagnostic step, not a formality — an artifact that consistently appears at the exact point two named motions would have to overlap is strong evidence the conflict is structural and will recur under the same combined instruction, whereas an artifact with no clear correlation to any specific overlapping instruction is more likely a one-off rendering fluke a straightforward regeneration might fix without any rewrite at all. Explicitly distinguishing the negative-prompt field's real function — suppressing the model's tendency toward a named failure mode as a second line of defense — from what it cannot do — resolve a positive prompt that is still structurally asking for two incompatible motions at once — matters because it is a genuinely common and reasonable-seeming mistake to treat "no morphing, no warped hands" as a fix once it is available; the negative prompt can measurably reduce the frequency or severity of a named artifact type, but it operates on the output's tendencies in general, not on the specific structural conflict a particular prompt's compound action created, so relying on it alone while leaving the compound action in place typically leaves the same underlying conflict intact and produces the same class of artifact regardless of what was added to the negative-prompt field.`,
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-08-05' }],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Veo 3.1 including Vertex AI negativePrompt field behavior.',
      },
    ],
  },
  {
    slug: 'veo-youtube-channel-intro-bumper',
    category: 'veo',
    title: `Generate a recurring YouTube channel intro bumper that stays consistent across every upload`,
    description: `A Veo 3.1 prompt for a 5-8 second channel-branding bumper meant to be reused at the top of every video, locking down the exact visual and audio elements that must stay identical from generation to generation.`,
    promptText: `Write a Veo 3.1 prompt for a short channel intro bumper — 5 to 8 seconds — that will be reused unchanged at the start of every future upload on this channel, not a one-off clip for a single video. Because this asset gets watched dozens or hundreds of times across a channel's history, the priority is a locked, repeatable identity rather than novelty.

BRAND ELEMENT AND ACTION
{{brand_visual_element}}, {{reveal_action}}. Describe the single motion this element performs once, completely, inside the clip — a bumper that implies an action continuing past the frame's end will look unfinished on every single repeat viewing, which compounds into a real annoyance at reuse volume in a way a one-off clip's imperfection never would.

CAMERA
A single locked-off or very slow push, no more movement than that. A bumper is watched by returning viewers who already recognize it; an overly kinetic camera move reads as novel the first time and fatiguing by the tenth, so keep the move minimal and let the branded element itself carry the motion.

COLOR AND STYLE
{{brand_color_palette}}. State the exact palette rather than a mood word, since this is the one clip on the channel that must match brand guidelines precisely instead of leaving room for the model's own interpretation of "energetic" or "modern."

SOUND MARK
{{audio_sting}}, landing at the exact moment the reveal completes, no music bed underneath beyond the sting itself. Describe it as a literal sound, not a mood — this native audio becomes the channel's recognizable sonic mark, so it needs the same precision as a jingle a composer would actually score.

WHAT TO AVOID
Do not include a channel name, logo text, or any words rendered as on-screen text as part of the generated video — Veo-rendered text is not reliably crisp or spelled correctly at the small sizes a channel name needs, so add real logo/text elements in post over this generated background instead of asking the model to render them natively. Do not vary the color palette or the camera move between takes if multiple attempts are generated to pick the best one; only the {{brand_visual_element}}'s exact motion should be allowed to differ across attempts, or the channel will end up with several bumpers that all look subtly different instead of one consistent identity.

OUTPUT
The finished prompt, followed by one line confirming the palette and camera move are stated precisely enough to reproduce identically across multiple generation attempts.`,
    variables: [
      {
        name: 'brand_visual_element',
        description: `The core branded visual object or shape the bumper is built around.`,
        example: `a rotating low-poly geometric globe made of thin glowing lines`,
        required: true,
      },
      {
        name: 'reveal_action',
        description: `The single complete motion that element performs.`,
        example: `assembling from scattered fragments into the whole globe shape and settling still`,
        required: true,
      },
      {
        name: 'brand_color_palette',
        description: `The exact brand colors to render, stated as specific hues, not a mood word.`,
        example: `deep navy background, lines in a bright cyan-to-white gradient`,
        required: true,
      },
      {
        name: 'audio_sting',
        description: `The literal native sound the reveal produces, as the channel's sonic mark.`,
        example: `a short rising digital chime that resolves into a low clean tone`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [`video`, `youtube`, `branding`, `intro`, `native-audio`, `channel-identity`],
    whyItWorks: `A channel bumper is unlike almost every other Veo use case in this library because it is watched repeatedly by the same audience rather than once, which flips the usual creative priority from novelty to exact repeatability — this is why the prompt insists on stating the palette as literal hues and the camera move as a single minimal option rather than leaving room for the model's own interpretation, since two generations of the "same" bumper that differ visibly in color or camera energy read as two different intros rather than one consistent brand identity across an uploader's history. Requiring the branded element's motion to complete fully within the clip rather than implying continuation past the frame addresses a failure that only becomes a real problem at reuse scale: a single clip that feels slightly unfinished is a minor flaw, but the same slightly-unfinished feeling repeating at the top of every video on a channel compounds into something viewers register consciously after enough repetitions, even if they could not describe why the first viewing felt fine. Explicitly ruling out on-screen text is a direct response to a known Veo limitation — text rendered natively inside generated video is not reliably legible or correctly spelled at small sizes, and a channel name is exactly the kind of text a viewer will actually try to read, so the practical fix is to generate a clean branded background and composite the real logo and name over it afterward rather than gambling on native text rendering for an asset that represents the channel on every single video. Naming the audio sting as a literal, describable sound rather than a mood word matters for the same reason it matters elsewhere in Veo's native audio generation: a sonic brand mark that a viewer learns to recognize needs a concrete, renderable sound description, not an adjective the model has to translate into audio on its own, and doing that translation consistently across regenerations is a much less reliable process than describing the actual sound directly.`,
    exampleOutput: `A 6-second bumper: fragmented cyan lines drift together against a deep navy field, resolving into a rotating low-poly globe that settles still as a rising digital chime lands on the exact frame it stops turning, then holds for a beat of clean silence.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
  {
    slug: 'veo-storyboard-reference-previs-clip',
    category: 'veo',
    title: `Turn a single storyboard panel into a previs test clip before committing a full production budget`,
    description: `A Veo 3.1 prompt for generating one previsualization shot from a single storyboard panel, structured so continuity notes (character look, lighting, lens) carry forward identically to every other panel generated from the same board.`,
    promptText: `You are converting one panel from a storyboard into a short Veo 3.1 previs clip, to test whether a planned shot will work before committing a real production budget to shooting or fully animating it. This is one panel out of a larger board, so continuity with the other panels matters more than any single clip looking impressive on its own.

PANEL CONTENT
{{panel_description}} — describe exactly what the storyboard panel shows: the framing, the subject's position, and the single action the panel implies happens across this shot.

CONTINUITY LOCK
{{continuity_details}}. Repeat these exact character, wardrobe, and environment details in every panel generated from this board, word for word where possible — previs is only useful as a sequence if the same character reads as the same character from panel to panel, and small unintentional wording drift between separate generations is the most common way Veo renders a subtly different-looking person or space across what is meant to be one continuous scene.

CAMERA
{{shot_type_and_lens}}, matching exactly what the storyboard panel indicates — do not add camera movement the panel itself doesn't show, since previs exists to test the planned shot as drawn, not a more elaborate version of it that will not match what gets budgeted and scheduled.

LIGHTING AND MOOD
{{lighting_note}}, kept consistent with the lighting direction used across the rest of the board's panels, even though this prompt only covers one of them.

AUDIO
Minimal or no native audio — {{audio_note}}. Previs is a visual and blocking test, not a final audio pass, so keep any generated sound simple enough that it does not distract from judging whether the shot itself works.

WHAT TO AVOID
Do not polish this clip's visual style beyond what the storyboard intends to communicate — an overly finished-looking previs can mislead a team into thinking the shot is closer to final than it is, and the point of this exercise is to test blocking and camera choices cheaply, not to produce hero footage.

OUTPUT
The finished prompt, followed by one line noting which panel number this clip represents and which continuity details must be copied unchanged into the next panel's prompt.`,
    variables: [
      {
        name: 'panel_description',
        description: `What this specific storyboard panel shows.`,
        example: `panel 4: a wide shot of a detective entering a rain-slicked alley, stopping mid-stride to look up at a fire escape`,
        required: true,
      },
      {
        name: 'continuity_details',
        description: `Exact character, wardrobe, and environment wording to repeat across every panel in the board.`,
        example: `a detective in a grey trench coat with a torn left cuff, an alley lined with rusted fire escapes and overflowing bins, wet asphalt reflecting neon signage`,
        required: true,
      },
      {
        name: 'shot_type_and_lens',
        description: `The exact shot type and lens feel the panel calls for, with no added movement.`,
        example: `wide shot, static frame, slight low angle, no camera movement`,
        required: true,
      },
      {
        name: 'lighting_note',
        description: `The lighting direction used consistently across the board.`,
        example: `cold blue-green neon spill from off-screen signage, hard rim light from a streetlamp behind the subject`,
        required: true,
      },
      {
        name: 'audio_note',
        description: `How minimal the audio pass should be for this test clip.`,
        example: `just faint rain ambience, nothing else`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [`video`, `storyboard`, `previs`, `pre-production`, `continuity`, `filmmaking`],
    whyItWorks: `Previs exists to answer one question cheaply — does this planned shot actually work — and the biggest way that value gets undermined with a generative tool is continuity drift across panels, which is why this prompt insists on repeating continuity details in near-identical wording across every panel's generation rather than paraphrasing the same character or space differently each time; Veo has no memory of a previous generation, so any unintentional variation in how a character or environment is described between panel prompts reads to the model as license to render a subtly different person or place, and a board where the detective looks slightly different in every panel fails at its one job of letting a team evaluate a sequence as a sequence. Matching the shot type and lens exactly to what the storyboard panel indicates, rather than embellishing it with additional camera movement, matters because previs is a planning tool meant to be tested against a real production's actual budget and schedule — a previs clip with a more elaborate camera move than what was actually storyboarded and budgeted for sets an expectation the eventual shoot may not be able to deliver, defeating the purpose of testing the shot as planned. Deliberately keeping the visual polish and audio pass minimal rather than letting Veo default toward its most finished-looking output addresses a subtler risk: a previs clip that looks close to final can be mistaken by a team for a more complete answer than it actually is, when its real job is only to test blocking, framing, and pacing before anyone commits real resources to executing the shot for real. Restricting native audio to a bare ambience note rather than a full soundscape keeps attention on the visual question the test is actually meant to answer, rather than letting an impressive-sounding but ultimately irrelevant audio layer bias the team's read of whether the shot itself is working.`,
    exampleOutput: `A static wide previs clip: the detective in the torn-cuff grey trench coat stops mid-stride on wet asphalt lit by cold blue-green neon spill, looking up toward an unseen fire escape as faint rain ambience plays underneath, no camera movement, no score.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
  {
    slug: 'veo-three-beat-short-form-story-clip',
    category: 'veo',
    title: `Compress a complete three-beat mini-story into a single 8-second Veo clip`,
    description: `A Veo 3.1 prompt for a self-contained short-form narrative clip built around a strict setup-turn-payoff structure timed to named seconds within the fixed 8-second window, rather than an open-ended scene description.`,
    promptText: `Build a Veo 3.1 prompt for one complete short-form story told entirely within a single 8-second clip — a setup, a turn, and a payoff, not a fragment of a longer video. Because the whole story has to land inside one fixed-length generation, every beat needs an approximate second range assigned to it before the visual description is written.

BEAT 1 — SETUP (seconds 0-3)
{{setup_scene}}. Establish the situation fast; this beat only has about three seconds to do its job, so describe the single detail that makes the situation legible rather than several competing details.

BEAT 2 — TURN (seconds 3-6)
{{turn_moment}}. Name the exact visual change that signals the turn — a new object entering frame, an expression shifting, a camera reveal — since an unnamed, implied turn tends to get rendered by Veo as a continuation of beat one rather than a distinct second beat.

BEAT 3 — PAYOFF (seconds 6-8)
{{payoff_moment}}, landing in the final two seconds. State what visually resolves the story here specifically so the ending reads as intentional rather than the clip simply running out of time.

CAMERA
{{camera_approach}} — describe it as one continuous move or one fixed frame across all three beats, since Veo generates a single uncut shot; if the story needs a visual gear-change at the turn, achieve it through what happens in frame, not through an implied cut the model has no instruction to perform.

AUDIO
{{sound_progression}}, changing character at the same second range as the turn to reinforce it — silence into a sudden sound, or a quiet tone shifting to a sharp one, timed to the visual beat rather than added as a flat, unchanging bed across the whole eight seconds.

WHAT TO AVOID
Do not write more than three beats — a fourth beat squeezed into this window has, on average, under two seconds to register, which is below the point where Veo can render a beat as legible rather than as a blurred transition between its neighbors. Do not leave the turn's second range unstated; an unanchored "at some point it changes" gives the model no timing target and the turn tends to land either too early, undercutting the setup, or too late, crowding out the payoff.

OUTPUT
The finished prompt, followed by the three second-ranges chosen for setup, turn, and payoff, so the pacing can be checked before generating.`,
    variables: [
      {
        name: 'setup_scene',
        description: `The situation established in the first ~3 seconds.`,
        example: `a man sits alone at an empty bus stop bench, checking his watch`,
        required: true,
      },
      {
        name: 'turn_moment',
        description: `The specific visual change that signals the story's turn.`,
        example: `a second person sits down at the far end of the same bench, holding an identical watch up to compare`,
        required: true,
      },
      {
        name: 'payoff_moment',
        description: `What resolves the story in the final ~2 seconds.`,
        example: `both men laugh and shake hands, clearly recognizing each other as the bus pulls away unboarded`,
        required: true,
      },
      {
        name: 'camera_approach',
        description: `The single continuous camera treatment across all three beats.`,
        example: `a static medium shot on the bench, no movement, letting the second man's entry do all the work`,
        required: true,
      },
      {
        name: 'sound_progression',
        description: `How the native audio should shift character at the turn.`,
        example: `quiet street ambience shifting into two overlapping laughs right as the handshake happens`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [`video`, `short-form`, `storytelling`, `narrative`, `native-audio`, `social`],
    whyItWorks: `Fitting a complete story into a single fixed-duration Veo generation only works if the beats are pinned to approximate second ranges before the visual description is written, because the model has no separate notion of narrative structure — it renders motion continuously across the duration it is given, so an unanchored instruction like "something changes" leaves entirely to chance whether that change lands early enough to still leave room for a payoff or late enough to undercut the setup, whereas naming seconds 0-3, 3-6, and 6-8 gives it three concrete windows to fill in sequence. Requiring the turn to be named as a specific, nameable visual event — a new object entering frame, an expression shifting — rather than an implied shift addresses a real rendering behavior: without an explicit new visual element or action to anchor the second beat, Veo tends to treat the continued absence of change as an instruction to keep extending beat one, and a clip meant to have three distinct beats ends up reading as one long establishing shot with a rushed ending tacked on. Capping the structure at three beats rather than allowing a fourth is a direct response to how little time is actually available once a story is divided evenly across eight seconds — a fourth beat gets under two seconds on average, which is below the threshold where Veo can render a beat as a legible, distinct event rather than a blurred transitional smear between its neighbors, since generative video models need a minimum number of frames to establish a new visual state before that state reads as intentional rather than accidental. Timing the audio's own character change to the same second range as the visual turn — rather than running one flat ambient bed under the whole clip — uses Veo's native audio generation to reinforce the story's structure rather than ignore it, since a sound shift synchronized to the visual turn gives a viewer two simultaneous, reinforcing signals that something changed, which reads as a stronger beat than either channel would alone.`,
    exampleOutput: `An 8-second clip: a man checks his watch alone on a bus stop bench (0-3s), a stranger sits at the far end and holds up an identical watch (3-6s), and by the final two seconds both men are laughing and shaking hands as the bus pulls away unboarded, the quiet street ambience breaking into overlapping laughter exactly as the handshake lands.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
  {
    slug: 'veo-slow-motion-emotional-beat-clip',
    category: 'veo',
    title: `Generate a slow-motion emotional close-up beat without it reading as generic slow-mo filler`,
    description: `A Veo 3.1 prompt for one cinematic slow-motion character beat, built around naming the exact micro-expression change the slow-down exists to reveal, since an unstated emotional target is what makes generated slow-motion default to hollow, decorative prettiness.`,
    promptText: `Write a Veo 3.1 prompt for an 8-second cinematic slow-motion close-up on a single character, built specifically around one micro-expression change — slow motion in film exists to give a viewer time to actually see something happening on a face or in a gesture that normal speed would blur past, not to make an otherwise unremarkable moment look prettier by slowing it down.

CHARACTER AND EXPRESSION CHANGE
{{character_description}}, {{expression_change}}. Name the specific facial or physical shift the slow motion exists to reveal — a held breath released, a forced smile faltering, a hand tightening — since slow motion with no named change to actually track defaults to generic, decorative prettiness rather than an emotional beat with a point.

CAMERA
{{camera_framing}}, static or a very slow, barely perceptible push, letting the slowed subject carry all the motion in the frame. A camera move competing with the subject's own slowed movement splits the viewer's attention exactly where the whole point is to hold it in one place.

ENVIRONMENT AND LIGHT
{{setting_and_light}}, describing how light interacts with the specific expression change named above — light catching a tear forming, or dimming slightly as a smile fades, ties the environment to the emotional beat instead of sitting inertly behind it.

STYLE AND PACE
{{visual_style}}. State plainly that this is a slow-motion shot, not merely a "dramatic" or "emotional" one — an unstated slow-motion instruction risks Veo rendering the moment at ordinary speed with dramatic lighting instead, which is a different result than what an emotional beat this specific actually needs.

AUDIO
{{audio_texture}}, itself slowed or thinned to match the visual pace — real slow-motion footage typically carries a lower, stretched audio texture rather than audio running at ordinary speed under visuals running at a quarter of it, and an audio track left at normal pace under a slowed image is one of the fastest ways a slow-motion shot reads as artificial.

WHAT TO AVOID
Do not combine this beat with a second character's simultaneous reaction in the same frame — a single slow-motion close-up has room to track one person's one change convincingly; splitting that attention across two faces at once dilutes both and gives Veo two competing focal points to render at reduced speed.

OUTPUT
The finished prompt, followed by one line naming exactly which micro-expression change this shot is built to reveal, so it can be checked that the slow motion has an actual emotional job to do.`,
    variables: [
      {
        name: 'character_description',
        description: `The character the close-up centers on.`,
        example: `a father in his 60s, weathered hands, sitting in a hospital waiting room chair`,
        required: true,
      },
      {
        name: 'expression_change',
        description: `The specific micro-expression or gesture change the slow motion exists to track.`,
        example: `his forced, steady expression cracking for a single second before he composes himself again`,
        required: true,
      },
      {
        name: 'camera_framing',
        description: `The shot framing and any minimal camera movement.`,
        example: `tight close-up on his face and hands, static frame`,
        required: true,
      },
      {
        name: 'setting_and_light',
        description: `Where the scene is set and how light interacts with the expression change.`,
        example: `a fluorescent-lit hospital corridor, harsh overhead light flickering slightly as his composure breaks`,
        required: true,
      },
      {
        name: 'visual_style',
        description: `The overall look, explicitly stated as slow motion.`,
        example: `muted, desaturated color, genuinely slow motion at roughly quarter speed, not merely dramatic lighting at normal speed`,
        required: true,
      },
      {
        name: 'audio_texture',
        description: `The native audio, itself thinned or stretched to match the slowed visual pace.`,
        example: `a low, stretched ambient hum and a slowed exhale, no music`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [`video`, `cinematic`, `slow-motion`, `close-up`, `emotional`, `native-audio`],
    whyItWorks: `Slow motion in real cinematography is a tool for revealing a specific change a viewer would otherwise miss at normal speed, not a generic aesthetic filter, and this prompt is built around that distinction — naming the exact micro-expression change the shot exists to track gives Veo an actual event to slow down around, whereas a slow-motion request with no named change defaults to a decorative, hollow prettiness because there is nothing specific for the reduced speed to be revealing. Explicitly stating that the shot is slow motion rather than only describing it as "dramatic" or "emotional" closes a real gap in how the model can interpret an unstated pace: those adjectives are just as satisfiable by ordinary-speed footage with moody lighting, and a prompt that relies on the mood words alone risks getting exactly that instead of the actually slowed motion the emotional beat depends on. Slowing or thinning the native audio to match the visual pace, rather than leaving it running at ordinary speed under a quarter-speed image, targets one of the fastest tells that separates convincing slow motion from an obviously synthetic one — real slow-motion footage's audio characteristically stretches and lowers along with the image, and a normal-paced soundtrack under visibly slowed visuals is a mismatch viewers register even without technical vocabulary for what feels wrong. Restricting the beat to a single character's single expression change, rather than tracking two people's reactions in the same frame, respects a fixed cognitive and rendering budget: an eight-second slow-motion close-up already asks a viewer to hold sustained attention on one small, subtle change, and splitting that attention across two faces gives the model two competing focal points to render at reduced speed simultaneously, which tends to produce a shot where neither person's change reads clearly. Keeping the camera nearly still, rather than adding its own movement on top of the subject's slowed motion, ensures the one motion actually worth watching — the expression changing — is the only motion competing for the viewer's eye.`,
    exampleOutput: `An 8-second tight close-up on the father's weathered face under flickering fluorescent light: his composed expression holds, then visibly cracks for a single slowed second before steadying again, a low stretched hum and a slowed exhale underneath, no music, no camera movement.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
  {
    slug: 'veo-product-feature-callout-demo-clip',
    category: 'veo',
    title: `Generate a functional product-demo clip that proves one feature actually works`,
    description: `A Veo 3.1 prompt for a hands-on demo clip built around one specific feature being used and visibly working, rather than a hero showcase shot, with the proof-of-function moment pinned to an explicit second so it does not get lost in the clip.`,
    promptText: `Write a Veo 3.1 prompt for an 8-second functional product demo — a clip whose job is to show one specific feature actually being used and visibly working, not a beauty shot of the product sitting still. The difference matters: a hero showcase sells desire, a feature demo has to prove function, and this prompt is for the second job.

PRODUCT AND FEATURE
{{product}}, demonstrating {{specific_feature}}. Name exactly one feature — a demo trying to show three capabilities in eight seconds ends up proving none of them clearly, since each one needs enough uninterrupted time on screen for a viewer to actually register what happened.

HANDS AND ACTION
{{hand_action}}, performed by hands entering frame naturally rather than a disembodied product moving on its own. Describe the specific physical action step by step — press, twist, slide — since an unspecific "uses the product" gives Veo no concrete motion to render and it tends to default to a vague, unconvincing gesture.

PROOF MOMENT
{{proof_of_function}}, visible by second {{proof_second}} at the latest. Name the exact visual evidence that the feature worked — a light changing color, a seal closing, a screen updating — and pin it to roughly when in the clip it needs to land, since a demo whose proof moment is vague or arrives too late to register clearly fails at the one job a feature demo has.

CAMERA
{{camera_framing}}, close enough to read the proof moment clearly, not a wide shot that leaves the actual evidence too small to see. A demo clip earns nothing from cinematic distance if the proof it exists to show becomes hard to make out.

ENVIRONMENT AND LIGHTING
{{setting}}, bright and even enough that the proof moment is not obscured by shadow or glare at the exact instant it needs to be legible.

AUDIO
{{functional_sound}}, the real sound the mechanism itself makes performing this action, timed to land exactly on the proof moment — a functional click, hiss, or chime confirms the action worked the same instant the visual does, reinforcing it rather than trailing behind it.

WHAT TO AVOID
Do not add a second feature demonstration or a second product variant in the same clip — this is one proof, of one feature, once, clearly; stacking a second feature in the remaining seconds compresses both below the time needed to register.

OUTPUT
The finished prompt, followed by one line stating the exact second the proof moment lands and what visual evidence confirms the feature worked, so it can be checked before generating.`,
    variables: [
      {
        name: 'product',
        description: `The specific product being demonstrated.`,
        example: `a insulated travel mug with a twist-lock lid`,
        required: true,
      },
      {
        name: 'specific_feature',
        description: `The single feature this clip proves, not the whole product.`,
        example: `the twist-lock lid sealing fully leak-proof`,
        required: true,
      },
      {
        name: 'hand_action',
        description: `The specific physical action performed on the product.`,
        example: `a hand twisting the lid a quarter turn until it clicks into place`,
        required: true,
      },
      {
        name: 'proof_of_function',
        description: `The exact visual evidence the feature worked.`,
        example: `a small indicator ring turning from red to green as the lid locks`,
        required: true,
      },
      {
        name: 'proof_second',
        description: `The latest second by which the proof moment must be visible.`,
        example: `5`,
        required: true,
      },
      {
        name: 'camera_framing',
        description: `How close the camera is, close enough to read the proof moment clearly.`,
        example: `close-up on the lid and indicator ring, filling most of the frame`,
        required: true,
      },
      {
        name: 'setting',
        description: `Where the demo is shot and how it is lit.`,
        example: `a clean kitchen counter, bright even daylight from a nearby window`,
        required: true,
      },
      {
        name: 'functional_sound',
        description: `The real mechanical sound tied to the proof moment.`,
        example: `a sharp mechanical click exactly as the ring turns green`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [
      `video`,
      `product-demo`,
      `commercial`,
      `ecommerce`,
      `native-audio`,
      `feature-proof`,
    ],
    whyItWorks: `A functional demo and a hero showcase are solving different problems, and the failure mode this prompt is built to avoid is treating a demo prompt like a showcase prompt — a beauty shot sells desire through an appealing static or rotating view, while a demo has to prove a mechanism actually does what it claims, which requires an explicit action, a visible before-and-after state, and a specific second by which that proof has to register on screen. Naming exactly one feature rather than several is the single biggest lever here because eight seconds divided across multiple capabilities gives each one too little uninterrupted screen time to actually prove anything — a viewer needs a beginning state, an action, and a resulting changed state to register a feature as demonstrated, and that sequence has a real minimum duration below which it reads as a vague gesture rather than a completed proof. Pinning the proof moment to an explicit second, rather than leaving it to happen "at some point," matters because Veo has no separate concept of dramatic pacing for a functional demo the way it might loosely default toward for a narrative beat — an unanchored proof moment is as likely to land in the first second, before the action reads as intentional, as it is to land in the last second, leaving no time for a viewer to register the change before the clip ends. Describing the hands performing a specific step-by-step mechanical action, rather than an unspecific "uses the product," gives the model a concrete motion to render instead of an abstract concept it has to interpret on its own, and that concreteness is exactly what separates a demo that looks like it is actually demonstrating a real mechanism from one that looks like generic product-handling footage. Timing the functional sound — a click, a hiss, a chime — to land exactly on the proof moment uses native audio as a second confirming channel rather than decoration, since a sound that correctly coincides with the visual proof reinforces to a viewer that the mechanism genuinely completed its action at that instant, which is a meaningfully stronger signal than the visual proof alone.`,
    exampleOutput: `A close-up demo clip: a hand twists the travel mug's lid a quarter turn, a mechanical click sounds exactly as a small indicator ring visibly turns from red to green by the fourth second, confirming the seal locked, all on a bright, evenly lit kitchen counter.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
  {
    slug: 'veo-problem-solution-ad-spot-clip',
    category: 'veo',
    title: `Generate a classic problem-solution ad spot compressed into one 8-second Veo clip`,
    description: `A Veo 3.1 prompt for a direct-response style ad built on the frustration-to-relief structure, with the exact frame of the transition named so the before/after contrast reads clearly instead of blurring into one ambiguous middle state.`,
    promptText: `1. Establish the problem. Describe {{frustration_scenario}} in the first roughly three seconds — a specific, visibly frustrating moment, not an abstract statement of a pain point. Veo needs a concrete visual frustration to render (a spill, a jam, a wasted attempt), not a mood, so name the literal thing going wrong.

2. Name the exact transition frame. State plainly that the shift from problem to solution happens at approximately second {{transition_second}}, and describe {{transition_trigger}} as the visible cause of that shift — the product entering frame, being used, or simply appearing. An ad that leaves this transition vague tends to get rendered by Veo as a slow fade between two states rather than a clean, legible before/after cut, which weakens the exact contrast the ad depends on.

3. Show the resolved state. Describe {{relief_scenario}} in the remaining seconds — visibly calmer, faster, or cleaner than the opening frustration, using the same setting and same subject as the opening so the contrast reads as one person's situation changing, not two unrelated scenes stitched together.

4. Camera. {{camera_treatment}} — keep the camera language consistent across both the problem and solution halves (same framing style, same movement type) so the visual contrast comes from what changes in the scene, not from an unrelated change in how it's shot.

5. Product visibility. {{product_placement}}, visible clearly at the transition point without over-lingering on it — the product's appearance is the pivot the whole ad turns on, so it needs a clean, legible frame, not a rushed glimpse or an oversold hero close-up that breaks the ad's naturalistic tone.

6. Audio. {{audio_shift}}, changing character at the same second as the visual transition — a frustrated sound (a sigh, a clatter) giving way to a calmer one (a satisfied exhale, a smooth click) reinforces the before/after structure through both channels at once.

7. What to avoid. Do not soften the opening frustration to the point it reads as only mildly annoying — a weak problem undercuts the entire structure the ad depends on, since the relief in the second half only lands if the first half's frustration was genuinely legible as a real problem. Do not add on-screen text or a price callout as part of the generated video; overlay that afterward.

8. Output. The finished prompt, followed by the transition second chosen and the one-line contrast between the opening frustration and the closing relief, so the ad's core structure can be checked before generating.`,
    variables: [
      {
        name: 'frustration_scenario',
        description: `The specific, visibly frustrating problem shown at the start.`,
        example: `someone repeatedly untangling a knotted charging cable, dropping their phone in the process`,
        required: true,
      },
      {
        name: 'transition_second',
        description: `The approximate second the shift from problem to solution happens.`,
        example: `3`,
        required: true,
      },
      {
        name: 'transition_trigger',
        description: `The visible cause of the shift, usually the product entering or being used.`,
        example: `the same person picking up a coiled, magnetic cable organizer instead`,
        required: true,
      },
      {
        name: 'relief_scenario',
        description: `The visibly resolved state in the same setting as the opening.`,
        example: `the cable now neatly wound and clipped, the phone charging cleanly on the same desk`,
        required: true,
      },
      {
        name: 'camera_treatment',
        description: `The consistent camera style used across both halves.`,
        example: `a static medium shot on the desk, unchanged throughout`,
        required: true,
      },
      {
        name: 'product_placement',
        description: `How and when the product itself is shown clearly.`,
        example: `the cable organizer visible in a clear close hand-shot exactly as it's picked up`,
        required: true,
      },
      {
        name: 'audio_shift',
        description: `How the native audio changes character at the transition.`,
        example: `a frustrated sigh and cable clatter shifting into a quiet, satisfied exhale and a soft magnetic click`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [
      `video`,
      `advertising`,
      `direct-response`,
      `problem-solution`,
      `native-audio`,
      `commercial`,
    ],
    whyItWorks: `The problem-solution ad structure only works if the contrast between its two halves reads clearly, and the single most fragile point in compressing that structure into eight seconds is the transition itself — which is why this prompt insists on naming an approximate transition second and its visible trigger explicitly, rather than letting the shift happen implicitly, because an unanchored transition tends to get rendered by Veo as a gradual fade or blend between the frustrated and relieved states rather than the clean before/after cut the format depends on, and a blended transition is a weaker, muddier ad than one with a clearly readable pivot. Keeping the camera treatment identical across both halves — same framing style, same movement type — is a deliberate constraint that isolates the contrast to what actually changes in the scene rather than letting a shift in cinematography do work the story itself should be doing; an ad that changes both the situation and the camera language at the same moment gives a viewer two simultaneous changes to process, diluting the clarity of the specific contrast the ad is trying to sell. Requiring the opening frustration to be genuinely, visibly frustrating rather than softened addresses a common failure in generated ad content: a mild, understated problem gives the second half's relief nothing meaningful to resolve, and the entire emotional structure of a problem-solution ad depends on the first half registering as a real, specific annoyance a viewer recognizes, not an abstract or watered-down gesture at one. Timing the audio's shift in character to land at the same second as the visual transition uses Veo's native audio generation as a second reinforcing signal for the pivot rather than an independent decoration — a sigh and clatter giving way to a satisfied exhale exactly as the product appears tells a viewer through two channels simultaneously that something changed, which registers as a stronger, more legible beat than either channel alone would produce.`,
    exampleOutput: `An 8-second ad: a hand fumbles a tangled charging cable and drops the phone in frustration for the first three seconds, then at second three the same hand picks up a magnetic cable organizer instead, the cable neatly wound within the next few seconds as the phone charges cleanly on the desk, a frustrated sigh giving way to a soft satisfied exhale and a clean magnetic click right at the pivot.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
  {
    slug: 'veo-abstract-concept-visual-metaphor-clip',
    category: 'veo',
    title: `Explain an abstract concept through a single concrete visual metaphor instead of literal illustration`,
    description: `A Veo 3.1 prompt for an explainer clip that translates one abstract idea into one physical, concrete metaphor Veo can actually render, since abstract concepts described literally tend to generate vague, generic stock-footage-style results.`,
    promptText: `Write a Veo 3.1 prompt for an 8-second explainer clip that communicates one abstract concept through a single concrete visual metaphor, not through a literal illustration of the concept itself. Abstract ideas — trust, growth, complexity, momentum — have no physical form for a video model to render directly; asking for "a video about trust" gives Veo nothing concrete to depict and tends to produce generic, forgettable stock-footage-style results, so the actual creative work here is choosing one physical thing that behaves the way the abstract idea behaves.

THE CONCEPT AND ITS METAPHOR
{{abstract_concept}}, represented as {{physical_metaphor}}. State plainly what real-world physical object or process stands in for the idea, and make sure its physical behavior actually mirrors the concept's behavior — a metaphor chosen for its visual is not enough if its mechanics don't structurally match what's being explained.

THE METAPHOR'S ACTION
{{metaphor_action}}, describing exactly how the physical object behaves across the eight seconds in a way that mirrors the abstract concept's own behavior. This is the core of the clip: Veo needs a concrete physical action to render, and the action's own logic — building, cracking, aligning, spreading — is what actually carries the explanation, more than any label or word overlay could.

CAMERA
{{camera_approach}}, close enough to let the metaphor's physical detail read clearly, since an explainer metaphor that's hard to see clearly fails at communicating regardless of how well-chosen the metaphor itself is.

STYLE AND MOOD
{{visual_style}}, clean and uncluttered so the one metaphor is the only thing competing for attention in the frame.

AUDIO
{{sound_matching_action}}, the literal sound the physical metaphor's action would make, reinforcing the mechanic being shown rather than an unrelated mood track.

WHAT TO AVOID
Do not add a second metaphor for the same concept in the same clip — two different physical stand-ins for one idea forces a viewer to reconcile two separate visual logics at once, which tends to confuse the explanation rather than reinforce it. Do not rely on on-screen text or labels to explain what the metaphor means; if the physical action doesn't communicate the concept on its own, the metaphor needs to be reconsidered rather than propped up with text Veo does not reliably render clearly anyway.

OUTPUT
The finished prompt, followed by one line stating explicitly how the chosen metaphor's physical behavior maps onto the abstract concept's actual behavior, so the mapping can be checked for whether it actually explains anything before generating.`,
    variables: [
      {
        name: 'abstract_concept',
        description: `The abstract idea being explained.`,
        example: `compounding growth`,
        required: true,
      },
      {
        name: 'physical_metaphor',
        description: `The concrete physical object or process standing in for the concept.`,
        example: `a single seed sprouting and its root system visibly branching and multiplying underground`,
        required: true,
      },
      {
        name: 'metaphor_action',
        description: `The specific physical behavior of the metaphor across the clip.`,
        example: `the root system doubling its branches at a visibly accelerating rate the longer it grows, not a constant steady spread`,
        required: true,
      },
      {
        name: 'camera_approach',
        description: `The camera treatment, close enough to read the physical detail clearly.`,
        example: `a slow macro push-in on the branching roots, static otherwise`,
        required: true,
      },
      {
        name: 'visual_style',
        description: `The overall visual treatment.`,
        example: `clean, warm-lit, soil and root textures rendered clearly against a simple dark background`,
        required: true,
      },
      {
        name: 'sound_matching_action',
        description: `The literal sound tied to the metaphor's physical action.`,
        example: `a subtle, layering series of soft cracking and rustling sounds that grows denser as the roots multiply`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [
      `video`,
      `explainer`,
      `metaphor`,
      `abstract-concept`,
      `native-audio`,
      `marketing`,
    ],
    whyItWorks: `Abstract concepts have no direct visual referent, which is precisely the problem this prompt structure is built to solve — a request to generate "a video about trust" or "a video about growth" gives Veo nothing concrete to render, and the model's default response to an under-specified abstract subject is to fall back on generic, visually forgettable stock-footage tropes, because there is no specific physical thing being asked for. Choosing a physical metaphor whose actual mechanics mirror the concept's own behavior, rather than one chosen only because it looks visually appealing, is the load-bearing creative decision here — a root system whose growth rate visibly accelerates the longer it runs is a structurally accurate stand-in for compounding growth specifically, in a way a metaphor chosen purely for its aesthetics but with mismatched mechanics would not be, no matter how well it was rendered. Instructing the clip to rely on the metaphor's physical action alone to carry the explanation, rather than propping it up with on-screen text, is a direct response to two separate constraints: first, that Veo does not reliably render small, legible on-screen text, and second, that a metaphor which needs a caption to explain itself was probably the wrong metaphor to begin with — the physical logic of the action shown should be doing the explanatory work on its own. Ruling out a second competing metaphor for the same concept in a single clip matters because eight seconds is barely enough time to establish and resolve one physical action clearly, let alone ask a viewer to track two separate visual logics simultaneously and reconcile what they have in common; a single clear metaphor executed fully outperforms two half-explained ones every time. Tying the native audio to the literal sound the physical metaphor's action would produce, rather than an unrelated ambient mood track, reinforces the same physical logic doing the explanatory work visually, giving the concept two consistent, mutually reinforcing channels instead of one visual channel undercut by an audio track pulling attention somewhere unrelated.`,
    exampleOutput: `An 8-second macro clip: a single seed's root system branches underground, each new split visibly faster and denser than the last, soft layered cracking and rustling growing thicker as the branching accelerates, ending on a dense, rapidly multiplying tangle of roots against warm-lit soil.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
  {
    slug: 'veo-shot-list-continuity-batch-generation',
    category: 'veo',
    title: `Turn a full shot list into a batch of continuity-locked Veo generations instead of one impossible mega-prompt`,
    description: `A Veo 3.1 prompt template for generating one shot at a time from a multi-shot list, with a locked continuity block repeated identically across every shot in the list so a character, setting, and style stay visually consistent across separately generated clips meant to be edited together.`,
    promptText: `You are generating one shot out of a full shot list, where the finished sequence will be several separately generated Veo 3.1 clips edited together, not one clip trying to cover the whole list. Each shot needs its own prompt built from this same template, with the continuity block copied forward unchanged into every one of them.

CONTINUITY BLOCK — REPEAT IDENTICALLY IN EVERY SHOT'S PROMPT
{{continuity_block}}. This exact wording — character appearance, wardrobe, location description, and named visual style — must appear the same way in every shot generated from this list; Veo has no memory between separate generations, so any drift in how this block is worded from shot to shot is rendered as an actual visual difference in the character or setting, not just a difference in description.

THIS SHOT'S CONTENT
Shot {{shot_number}} of {{total_shots}}: {{shot_description}}. Describe only what this specific shot needs to show — its own subject, action, and framing — layered on top of the continuity block above, not a re-description of the whole scene.

CAMERA FOR THIS SHOT
{{shot_camera}}. Each shot in a list typically has its own distinct camera treatment (wide, close, tracking) that varies shot to shot even while the continuity block stays fixed — state this shot's specific camera choice clearly so it reads as intentionally different coverage of the same continuous scene, not an unrelated new scene.

LIGHTING CONSISTENCY
{{lighting_continuity_note}}, matched to the same time of day and light quality used across the rest of the shot list, even though only this one shot is being generated right now.

AUDIO
{{shot_audio}}, kept in the same sonic register as the other shots in the list so the edited sequence doesn't jump between inconsistent ambient beds from one cut to the next.

WHAT TO AVOID
Do not rewrite or paraphrase the continuity block between shots even slightly, even if a different phrasing feels more natural for this particular shot — treat it as a fixed asset to be pasted, not rewritten, since paraphrased continuity is the single most common cause of a shot list's separately generated clips looking like different characters or different rooms when edited together.

OUTPUT
The finished prompt for this one shot, followed by a note confirming the continuity block matches word-for-word what was used in the previous shot's prompt, so drift can be caught before generating.`,
    variables: [
      {
        name: 'continuity_block',
        description: `The fixed character, wardrobe, location, and style description reused identically across every shot.`,
        example: `a woman in her 30s, short red hair, wearing a forest-green field jacket; a misty pine forest clearing at dawn; muted, naturalistic color grade throughout`,
        required: true,
      },
      {
        name: 'shot_number',
        description: `This shot's position in the list.`,
        example: `3`,
        required: true,
      },
      {
        name: 'total_shots',
        description: `The total number of shots in the full list.`,
        example: `6`,
        required: true,
      },
      {
        name: 'shot_description',
        description: `What is unique to this specific shot's subject and action.`,
        example: `she crouches to examine a set of animal tracks pressed into the wet ground`,
        required: true,
      },
      {
        name: 'shot_camera',
        description: `This shot's specific camera treatment.`,
        example: `a low-angle close-up on her hand tracing the track's edge`,
        required: true,
      },
      {
        name: 'lighting_continuity_note',
        description: `How lighting should match the rest of the list's established time of day.`,
        example: `the same low, cool dawn light and thin ground mist as the establishing shot`,
        required: true,
      },
      {
        name: 'shot_audio',
        description: `This shot's native audio, kept in the same sonic register as the rest of the list.`,
        example: `quiet birdsong and a faint rustle of damp leaves, matching the ambient bed used in the other shots`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [
      `video`,
      `shot-list`,
      `continuity`,
      `filmmaking`,
      `pre-production`,
      `batch-generation`,
    ],
    whyItWorks: `A shot list assumes a viewer will experience several separately captured angles as one continuous scene, and the core challenge in generating that with Veo is that the model has no memory carried over between separate generations — each shot prompt is evaluated fresh, with no awareness of what a previous shot in the same list looked like, which is why this template's entire structure is built around a continuity block that has to be copied forward identically, word for word, rather than paraphrased shot to shot. This is not a stylistic preference but a direct consequence of how the model actually works: any variation in how a character's appearance or a location is worded between two shots gets interpreted as an actual instruction to render a different-looking character or space, not as a harmless rephrasing of the same intended visual, so a shot list where each prompt describes the same red-haired woman in slightly different words will very plausibly generate several visually distinct women across the finished sequence. Explicitly separating the fixed continuity block from the shot-specific content — camera, action, framing — lets each shot vary in exactly the ways a real shot list is supposed to vary (different angles, different framings of the same scene) while holding everything that should stay constant genuinely constant, which mirrors how a real multi-camera or multi-setup shoot maintains continuity notes across coverage even though each individual shot is captured separately. Matching lighting language and audio register across shots for the same underlying reason a film production keeps a continuity supervisor on set — a sequence edited from generations with subtly different color temperature or ambient sound from cut to cut reads as spliced-together mismatched footage rather than one continuous scene, undermining the entire premise of a shot list, which is that all its individual shots belong to the same moment in the same place.`,
    exampleOutput: `Shot 3 of 6: a low-angle close-up on the red-haired woman's field-jacketed hand tracing an animal track pressed into wet ground, the same cool dawn light and thin mist established in shot 1, quiet birdsong and damp leaf rustle matching the ambient bed used across the rest of the list.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
  {
    slug: 'veo-highlight-recap-montage-clip',
    category: 'veo',
    title: `Generate a single-shot highlight recap that implies a montage without actually cutting between scenes`,
    description: `A Veo 3.1 prompt for compressing the feeling of a highlight-reel recap into one uncut generated clip, using layered simultaneous action within a single continuous shot instead of asking the model to perform cuts it cannot reliably execute inside one generation.`,
    promptText: `Write a Veo 3.1 prompt for an 8-second clip that gives the impression of a highlight-reel recap — the kind of fast, energetic montage that normally implies many cut-together moments — while actually describing one single continuous shot, since Veo generates one uncut take per clip and a prompt describing several distinct discrete scenes gets rendered as one confused, blended scene rather than a series of clean cuts.

THE ILLUSION OF MONTAGE
Describe {{single_continuous_scene}} as one real, continuous moment containing enough layered simultaneous activity that it reads as energetic and eventful, the way a montage feels, without actually asking for separate distinct scenes. A wide shot of a genuinely busy, multi-layered real moment can carry the same "a lot just happened" feeling a cut-together montage gives, without needing any cuts at all.

LAYERED ACTIVITY
{{background_activity}} happening simultaneously with {{foreground_activity}}, both real and continuous within the same single shot — this layering of several things visibly happening at once inside one frame is what substitutes for a montage's usual multiple distinct scenes.

CAMERA
{{camera_movement}}, a single sweeping move that reveals different parts of the layered activity as it travels, giving a sense of covering ground the way a montage covers ground, entirely within one uncut take.

ENERGY AND PACE
{{pace_description}}, fast and kinetic in how the layered activity itself moves, since the energetic feeling has to come from what's happening in the single frame, not from cuts the model isn't being asked to and cannot reliably perform within one generation.

AUDIO
{{energetic_soundscape}}, a dense, layered ambient mix appropriate to a highlight-feeling moment — crowd noise, overlapping activity sounds — building the same sense of "a lot happening at once" through sound that the visual layering builds through the image.

WHAT TO AVOID
Do not describe this as "a montage of several moments" or list discrete separate scenes expecting Veo to cut between them — a single generation has no cut mechanism, and a prompt describing multiple distinct scenes will be rendered as one blended, incoherent space attempting to contain all of them at once. If a true multi-scene montage is actually needed, generate each scene as its own separate clip and edit them together afterward rather than asking one generation to do it.

OUTPUT
The finished prompt, followed by one line confirming this describes one single continuous shot with layered simultaneous activity, not multiple discrete scenes expecting an in-generation cut.`,
    variables: [
      {
        name: 'single_continuous_scene',
        description: `The one real, continuous moment the whole clip actually takes place within.`,
        example: `a packed finish line at a city marathon in the final minute before the winner crosses`,
        required: true,
      },
      {
        name: 'background_activity',
        description: `What happens in the background simultaneously.`,
        example: `a dense crowd cheering and waving signs behind the barricades`,
        required: true,
      },
      {
        name: 'foreground_activity',
        description: `What happens in the foreground simultaneously.`,
        example: `the lead runners visibly straining, pulling ahead of the pack in the final stretch`,
        required: true,
      },
      {
        name: 'camera_movement',
        description: `The single sweeping camera move that reveals the layered activity.`,
        example: `a fast lateral tracking move alongside the runners, sweeping past the cheering crowd`,
        required: true,
      },
      {
        name: 'pace_description',
        description: `How kinetic and fast the layered activity itself should feel.`,
        example: `urgent, breathless, bodies straining at full sprint`,
        required: true,
      },
      {
        name: 'energetic_soundscape',
        description: `The dense layered native audio mix.`,
        example: `roaring crowd noise, an air horn, overlapping shouted encouragement`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [`video`, `recap`, `highlight`, `montage`, `native-audio`, `sports-and-events`],
    whyItWorks: `The instinct to ask a video generator for "a montage" runs directly into a hard limitation of how Veo actually produces output: each generation is one continuous, uncut take, with no mechanism for switching between distinct scenes inside a single clip, so a prompt that describes several discrete moments expecting the model to cut between them the way an editor would gets rendered instead as one confused space trying to contain fragments of all of them simultaneously, which is a strictly worse result than either a real montage or a clean single shot. The actual workaround this prompt relies on is substituting layered simultaneous activity within one real continuous moment for the multiple distinct scenes a traditional montage would use — a busy marathon finish line already contains a crowd, a background, and straining runners all happening genuinely at once, and describing that real layered density gives a viewer the same "a lot is happening" feeling a cut-together highlight reel produces, without requiring any cuts the model cannot perform. A single sweeping camera move across that layered scene does real work standing in for a montage's usual sense of covering multiple locations or moments — the camera traveling through a busy, multi-layered real space creates a feeling of ground covered and variety seen that is structurally similar to what a montage's multiple cuts accomplish, even though it happens within one uncut take. Building the energetic pace from the density and speed of what's actually happening in frame, rather than expecting cuts to generate the energy, respects the same constraint from a different angle — the excitement a real highlight reel produces through rapid scene changes has to be produced here through how busy and kinetic the single continuous frame itself is, since there is no edit rhythm available inside a single generation to lean on instead. The explicit fallback — generate separate scenes as separate clips and edit them together afterward if a true multi-scene montage is actually needed — is included because that is the only reliable way to get an actual montage from a tool that generates one continuous shot per call; trying to force it into a single generation is the mistake this entire prompt structure exists to prevent.`,
    exampleOutput: `An 8-second single-take clip: the camera tracks fast alongside straining lead runners in the final marathon stretch, a dense cheering crowd waving signs visible behind the barricades throughout, roaring crowd noise and an air horn layered under overlapping shouted encouragement, one continuous sweep, no cuts.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
  {
    slug: 'veo-retention-loop-preview-clip',
    category: 'veo',
    title: `Generate a seamlessly looping preview clip built to hold attention on autoplay feeds`,
    description: `A Veo 3.1 prompt for a short clip engineered to loop invisibly — matching its first and last frame in motion, framing, and native audio — so it holds attention through repeat plays on autoplay-driven feeds instead of showing a visible jarring restart every few seconds.`,
    promptText: `Write a Veo 3.1 prompt for a short clip specifically engineered to loop seamlessly on autoplay feeds — a video whose last frame flows back into its first frame invisibly, so a viewer scrolling past it sees continuous, uninterrupted motion rather than a visible jump or restart every time it repeats. This is a materially different design goal from a normal clip with a clear beginning and end.

CYCLICAL ACTION
{{cyclical_subject}}, performing {{repeating_motion}} — a motion whose end state visually matches its own start state, such as a full rotation, a swing that returns to its origin point, or a loop of liquid pouring and settling back to its starting level. Choose an action that is naturally cyclical rather than one with a clear beginning and end, since a non-cyclical action forces a visible, jarring jump the instant the clip restarts.

CAMERA
{{camera_treatment}}, held in an unchanging position or a movement that itself completes a matching loop — a full slow rotation back to its starting angle, for instance — so the frame itself doesn't jump on restart even if the subject's motion does.

LIGHTING CONSISTENCY
{{lighting_note}}, constant and unchanging throughout, since a lighting shift across the clip (a shadow moving, a highlight traveling) creates a visible discontinuity at the loop point even if the subject's own motion matches perfectly.

STYLE AND MOOD
{{visual_style}}, generally calm and hypnotic rather than a single sharp climactic beat, since a clip built around one big payoff moment has an obvious "ending" a viewer notices restarting, while an evenly-paced cyclical motion disguises the seam.

AUDIO FOR LOOPING
{{loop_audio}}, a continuous, evenly textured ambient sound with no distinct one-time event in it — no single sharp sound near the beginning or end, since a loud, distinct native audio cue right at the seam is the fastest way a viewer notices the clip has restarted even if the visual loop itself is seamless.

WHAT TO AVOID
Do not build this around a single dramatic reveal or payoff moment the way a normal short clip would — a strong singular beat is memorable exactly because it stands out, and a moment designed to stand out is also the moment a viewer will notice repeating identically every few seconds on a loop. Do not vary the lighting or camera framing between the described start and end state even slightly; a near-match is enough for a viewer's eye to catch the seam even when they can't articulate what changed.

OUTPUT
The finished prompt, followed by one line confirming that the described start state and end state of both the subject's motion and the camera framing match closely enough to loop without a visible jump.`,
    variables: [
      {
        name: 'cyclical_subject',
        description: `The subject performing a naturally repeating motion.`,
        example: `a potter's wheel with wet clay spinning on it`,
        required: true,
      },
      {
        name: 'repeating_motion',
        description: `The specific cyclical motion whose end state matches its start state.`,
        example: `one full, even rotation of the wheel, the clay's shape unchanged from where it started`,
        required: true,
      },
      {
        name: 'camera_treatment',
        description: `The camera's unchanging position or its own matching loop.`,
        example: `a static overhead shot, unmoving throughout`,
        required: true,
      },
      {
        name: 'lighting_note',
        description: `The constant, unchanging lighting across the whole clip.`,
        example: `even, unchanging studio light directly overhead with no traveling shadow`,
        required: true,
      },
      {
        name: 'visual_style',
        description: `The overall calm, hypnotic visual treatment.`,
        example: `warm, tactile, close and meditative, no dramatic lighting shifts`,
        required: true,
      },
      {
        name: 'loop_audio',
        description: `The continuous, evenly textured ambient sound with no one-time cue.`,
        example: `a steady, even hum of the wheel's motor and a soft continuous wet-clay sound`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [`video`, `loop`, `retention`, `autoplay`, `native-audio`, `feed`],
    whyItWorks: `Autoplay feeds reward a specific and unusual property most video prompts don't need to think about: a clip whose repeat playback is invisible rather than one that visibly restarts every few seconds, and that property depends entirely on how closely the described end state matches the described start state, both visually and sonically — this is why the prompt's design is organized around choosing a naturally cyclical action rather than one with a clear beginning, middle, and end, since a non-cyclical action necessarily has a visible discontinuity the instant it jumps back to its starting frame, no matter how well each individual play of the clip looks on its own. Holding the camera either genuinely static or in a movement that completes its own matching loop addresses a subtler version of the same problem: even a perfectly matched subject motion will still produce a visible seam if the camera itself has traveled somewhere different by the end of the clip than where it started, because the frame's own composition is part of what a viewer's eye is tracking for continuity, not just the subject within it. Keeping lighting genuinely constant rather than allowing any drift — a moving shadow, a traveling highlight — matters for a reason specific to how human perception catches loop seams: a viewer does not need to consciously notice what changed to register that something is off at the loop point, and even a small, technically minor lighting shift is often enough to produce that vague, hard-to-place sense that the video just did something discontinuous. Explicitly ruling out a single dramatic payoff moment in favor of an evenly-paced, hypnotic motion is the least intuitive but most important instruction here, because the natural instinct when generating any short clip is to build toward one strong beat, and a strong beat is memorable specifically because it stands out from what surrounds it — which is exactly the property that makes a viewer consciously register it repeating identically on a loop, undermining the entire seamless effect the format depends on. Keeping the native audio free of any single sharp one-time sound near the seam closes the last common failure mode, since a loud, distinct audio event is often the first thing that gives away a loop even when the visual seam itself is genuinely well hidden.`,
    exampleOutput: `An evenly looping overhead clip: a potter's wheel spins one full, unbroken rotation with wet clay unchanged in shape from start to finish, a steady even hum and soft continuous wet-clay sound underneath, unchanging overhead light with no traveling shadow, no single sharp sound anywhere in the clip.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
  {
    slug: 'veo-chapter-transition-bumper-clip',
    category: 'veo',
    title: `Generate a matching set of short chapter-transition bumpers for a longer edited video`,
    description: `A Veo 3.1 prompt for a brief transition clip inserted between chapters of a longer video, built with a shared visual motif that stays consistent across every chapter break while a small variable element identifies which chapter is ending or beginning.`,
    promptText: `Write a Veo 3.1 prompt for a short transition bumper — roughly 3-5 seconds — meant to appear between chapters of a longer edited video. Because several of these will be generated, one for each chapter break, most of the clip has to stay identical across every version while exactly one small element changes to distinguish which transition this is.

SHARED MOTIF — KEEP IDENTICAL ACROSS EVERY CHAPTER TRANSITION
{{shared_visual_motif}}. Describe this core visual exactly the same way in every chapter-transition prompt generated for this video; it's the element that makes every transition recognizably part of the same video, and any wording drift between transitions renders as an actual visual inconsistency, not a harmless rephrasing.

THE ONE VARIABLE ELEMENT
{{chapter_identifier_detail}}, the single small detail that changes to mark this specific chapter transition apart from the others — a number, a distinct color accent, a specific small object — kept visually simple enough that it reads clearly within a 3-5 second clip.

CAMERA
{{camera_treatment}}, identical across every transition generated for this video, for the same consistency reason as the shared visual motif.

COLOR AND LIGHTING
{{color_and_lighting}}, held constant across every version except wherever the one variable element specifically requires a different accent color.

AUDIO
{{transition_sound}}, the same core sound identity across every chapter break, with at most a minor pitch or texture variation tied to the one variable element if needed — a fully different sound per chapter would undercut the sense that these are all the same recurring transition device.

WHAT TO AVOID
Do not make the shared motif elaborate enough that regenerating it precisely for every chapter becomes unreliable — a simple, easily-repeatable visual is more valuable here than an impressive one that renders slightly differently each time it's requested. Do not add chapter titles or on-screen text as part of the generated video; overlay chapter names in post since Veo does not reliably render small legible text, and this asset needs to work across many chapters without regenerating for text changes alone.

OUTPUT
The finished prompt for this one chapter transition, followed by one line naming which chapter this represents and confirming the shared motif wording matches what was used in the other chapter transitions for this video.`,
    variables: [
      {
        name: 'shared_visual_motif',
        description: `The core visual that must stay identical across every chapter transition.`,
        example: `a single thin line of light tracing itself across a dark background, forming a simple geometric shape`,
        required: true,
      },
      {
        name: 'chapter_identifier_detail',
        description: `The one small element that changes per chapter.`,
        example: `the line's color shifting to a distinct accent color for this chapter, a soft amber`,
        required: true,
      },
      {
        name: 'camera_treatment',
        description: `The unchanging camera treatment across every transition.`,
        example: `a fully static frame, centered, no movement`,
        required: true,
      },
      {
        name: 'color_and_lighting',
        description: `The base color and lighting held constant across all versions.`,
        example: `a near-black background, otherwise unlit except for the traced line itself`,
        required: true,
      },
      {
        name: 'transition_sound',
        description: `The consistent core sound identity, with minor allowed variation.`,
        example: `a short rising tone as the line traces, pitch shifting slightly per chapter's accent color`,
        required: true,
      },
    ],
    targetTools: [`Veo 3.1`],
    tags: [`video`, `chapters`, `transition`, `bumper`, `native-audio`, `editing`],
    whyItWorks: `A chapter-transition bumper only works as a device if it is instantly recognizable as the same recurring element every time it reappears, which means the design problem here is nearly the inverse of most Veo prompts in this library — instead of maximizing what's distinct and specific to one generation, the goal is holding almost everything identical across many separate generations while isolating exactly one small element that's allowed to vary, and stating that split explicitly in the prompt is what keeps the shared motif from drifting the way an unconstrained creative brief naturally would across repeated regenerations. Because Veo has no memory between generations, the shared visual motif has to be described with the same precision and the same wording each time it's requested for a new chapter, for the identical reason continuity matters in a multi-shot list — any variation in how the core visual is phrased is interpreted by the model as an actual instruction to render something at least slightly different, and a set of chapter bumpers that are each subtly different undermines the whole point of a bumper, which is to be recognized instantly as "the thing that happens between chapters," not evaluated fresh each time. Deliberately keeping the shared motif visually simple, rather than elaborate, is a practical response to the same reliability concern — a complex, detailed motif is harder to reproduce identically across many separate generations than a simple geometric one, and a device meant to repeat across every chapter break needs to prioritize repeatability over one-time visual impressiveness. Ruling out on-screen chapter titles as part of the generated video, the same way a channel-intro bumper rules out logo text, reflects both a real rendering limitation and a practical workflow one: Veo doesn't reliably render small legible text, and a bumper that needed regenerating every time a chapter's title changed would defeat the efficiency of having one reusable, mostly-identical template in the first place — adding real chapter titles in post over a consistent generated background solves both problems at once. Allowing the native audio only a minor pitch or texture variation, rather than a fully different sound per chapter, keeps the sonic identity of the device consistent for the same reason the visual motif needs to stay consistent — a transition device that sounds noticeably different each time it appears reads as several different devices, not one recurring one.`,
    exampleOutput: `A 4-second static bumper: a single thin line of soft amber light traces itself across a near-black background, forming a simple geometric shape, a short rising tone accompanying the trace and settling into quiet as it completes.`,
    verifiedAgainst: [{ tool: 'Veo', version: '3.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against Veo 3.1.`,
      },
    ],
  },
]
