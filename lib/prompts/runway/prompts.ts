import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'runway-brand-consistent-character-clip',
    category: 'runway',
    title: 'Keep the same character consistent across a multi-shot brand clip',
    description:
      'A Runway Gen-4.5 brief structured around a locked character reference so a mascot or recurring presenter looks like the same person or character shot to shot, not a new face each generation.',
    promptText:
      "Character reference: {{character_description}}, kept visually identical to the reference image in face, outfit and proportions across every shot.\nSubject and action: the character {{action}} in a {{location}}.\nCamera: static locked-off medium shot, no camera movement, so attention stays on the character's consistency rather than the frame.\nEnvironment and lighting: {{lighting_setup}}, consistent color temperature across shots to support later editing continuity.\nStyle and mood: {{brand_style}}, clean and on-brand, no stylistic drift from shot to shot.\nAudio: ambient ({{ambient_sound}}) only, no dialogue, reserved for a voiceover track added separately.",
    variables: [
      {
        name: 'character_description',
        description: "The character's fixed visual details, matched to a reference image",
        example:
          'a friendly orange fox mascot in a blue zip hoodie with rounded, soft features',
        required: true,
      },
      {
        name: 'action',
        description: 'What the character is doing in this specific shot',
        example: 'waving and gesturing toward a product display',
        required: true,
      },
      {
        name: 'location',
        description: 'Where the shot is set',
        example: 'a bright, minimal retail storefront',
        required: true,
      },
      {
        name: 'lighting_setup',
        description: 'The lighting description, kept identical across the shot series',
        example: 'soft even daylight from large front windows',
        required: true,
      },
      {
        name: 'brand_style',
        description: "The brand's visual style to hold across every clip",
        example:
          'flat, friendly 3D-toy aesthetic matching the existing brand illustrations',
        required: true,
      },
      {
        name: 'ambient_sound',
        description: 'The background ambient sound only',
        example: 'quiet retail store ambience',
        required: false,
      },
    ],
    targetTools: ['Runway Gen-4.5'],
    tags: ['video', 'character-consistency', 'brand', 'mascot', 'runway'],
    whyItWorks:
      "Gen-4.5's actual differentiator versus earlier Runway models is reference-image-driven character consistency across separate generations, so this prompt is built to be re-run shot after shot with the same character reference and the same fixed description clause held word-for-word — only the action/location/lighting variables change between shots. Locking the camera to a static shot removes one more variable that otherwise competes with the model's attention for consistency budget; a moving camera plus a character it needs to keep matching is a harder joint problem than either alone. Keeping dialogue out of the generated audio and treating ambient sound as the only audio layer is deliberate: it keeps voice/lip-sync (a much weaker point for consistency across shots) out of the clip entirely, so a separate voiceover can be added in post without needing to match generated mouth movement.",
    exampleOutput:
      'A static medium shot of the same orange fox mascot from the reference image, hoodie and proportions unchanged, waving toward a product display under soft window light, quiet store ambience underneath, no camera movement and no stylistic drift from the previous shot in the series.',
    verifiedAgainst: [{ tool: 'Runway Gen-4.5', version: 'Gen-4.5', date: '2026-07-25' }],
    changelog: [
      { date: '2026-07-25', note: 'Published, verified against Runway Gen-4.5.' },
    ],
  },
  {
    slug: 'runway-motion-graphics-brand-loop',
    category: 'runway',
    title: `Generate a seamless branded motion-graphics loop for a product page or ad unit`,
    description: `A Runway Gen-4.5 brief for a short, seamlessly-looping abstract motion-graphics element (think animated background for a landing page hero or a paid social ad unit) built so the first and last frame match cleanly.`,
    promptText: `Subject: abstract {{motion_element}} animating in a continuous loop, no human figures, no logos rendered directly in-frame (logo to be composited separately in post).
Motion: {{motion_behavior}}, moving at a steady, even pace with no sudden accelerations, structured so the final frame's position and color state returns close enough to the first frame to be trimmed into a seamless loop.
Camera: fixed frame, no camera movement or parallax, since any lens drift will make the loop point visible as a jump-cut.
Color and style: {{brand_palette}}, flat modern motion-design aesthetic, no photorealistic textures or shadows that would fight with overlaid text or UI.
Background: {{background_treatment}}, kept simple and uncluttered so it reads correctly behind text at 40% opacity.
Duration and pacing: treat this as a 4-second base loop — describe one full motion cycle, not a longer narrative arc.
Audio: none — this asset is silent by design, muted in every placement.
Negative guidance: avoid any camera shake, avoid embedding readable text or wordmarks in the generation itself, avoid warm-to-cool color shifts across the loop that would make the seam visible.`,
    variables: [
      {
        name: 'motion_element',
        description: `The core abstract shape or object doing the looping motion`,
        example: `a cluster of soft, rounded polygons`,
        required: true,
      },
      {
        name: 'motion_behavior',
        description: `The specific repeating motion pattern`,
        example: `slowly orbiting around a shared center point and gently pulsing in size`,
        required: true,
      },
      {
        name: 'brand_palette',
        description: `The exact brand colors to constrain the palette to`,
        example: `deep navy background with coral and off-white accent shapes`,
        required: true,
      },
      {
        name: 'background_treatment',
        description: `How the background behind the motion element should look`,
        example: `a flat navy gradient with no texture or noise`,
        required: true,
      },
    ],
    targetTools: [`Runway Gen-4.5`],
    tags: [`video`, `motion-graphics`, `loop`, `brand`, `ad-creative`],
    whyItWorks: `Loop-able motion graphics fail in one of two ways with generative video models: the model treats the brief as a one-shot narrative and produces motion that never returns to a matching state, or a moving camera introduces a parallax jump exactly at the loop point that no amount of trimming can hide. This prompt heads off both by explicitly naming the loop constraint in the motion clause ("returns close enough to the first frame to be trimmed into a seamless loop") rather than assuming Gen-4.5 will infer it, and by locking the camera to a fixed frame so the only moving element is the described shape — removing the single biggest source of visible seams. Naming a short base duration (4 seconds) also matters mechanically: asking for one complete motion cycle in a tightly bounded window gives the model a concrete arc to complete, rather than an open-ended "animate forever" instruction that tends to drift in pace over a longer clip. The negative-guidance line calling out embedded text and color drift exists because both are common Gen-4.5 failure modes on abstract motion-design prompts specifically — the model will sometimes render illegible pseudo-text into busy loops, and gradual hue drift across a clip is the most common reason an otherwise well-looped animation still shows a visible cut.`,
    exampleOutput: `A 4-second seamless loop of soft coral and off-white polygons slowly orbiting a shared center against a flat navy background, gently pulsing in size, camera locked, no text, no shadows, first and last frames matching closely enough to cut into a continuous loop.`,
    verifiedAgainst: [{ tool: 'Runway Gen-4.5', version: 'Gen-4.5', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against Runway Gen-4.5.`,
      },
    ],
  },
  {
    slug: 'runway-multi-scene-continuity-plan',
    category: 'runway',
    title: `Lock a reusable continuity reference so a 5-shot product story doesn't drift between generations`,
    description: `A Runway Gen-4.5 brief structured as a master continuity lock plus a per-shot delta table, so a multi-shot product or brand sequence keeps the same subject, lighting and color grade across separate generation calls.`,
    promptText: `MASTER LOCK (hold this exact wording unchanged across every shot in the sequence):
Subject reference: {{subject_reference}}, matched to the attached reference image for shape, material and surface finish.
Lighting lock: {{lighting_lock}}, same key-light direction and color temperature in every shot.
Color grade lock: {{grade_lock}}, no shot in the sequence should shift warmer, cooler, or more saturated than this baseline.
Lens lock: consistent focal length feel across the sequence — no shot should read as noticeably wider or more compressed than the others.

PER-SHOT DELTA (only these fields change shot to shot; everything above stays fixed):
Shot {{shot_number}} — Action: {{shot_action}}. Framing: {{shot_framing}}. Duration: 3-5 seconds.

Continuity check before generating the next shot: compare the just-generated frame against the master lock section above and re-state any lock clause that appears to have drifted (e.g. if the color grade looks warmer, restate the grade lock verbatim in the next call rather than leaving it implicit).
Audio: ambient only, no dialogue, consistent ambience bed across the whole sequence so an editor can crossfade between shots without an audible seam.`,
    variables: [
      {
        name: 'subject_reference',
        description: `The fixed subject held constant across every shot in the sequence`,
        example: `a matte-black ceramic pour-over coffee dripper`,
        required: true,
      },
      {
        name: 'lighting_lock',
        description: `The lighting setup to hold identical across all shots`,
        example: `soft key light from upper-left, warm 3200K, subtle rim light`,
        required: true,
      },
      {
        name: 'grade_lock',
        description: `The color grade baseline to check every subsequent shot against`,
        example: `warm neutral grade, slightly lifted blacks, low saturation`,
        required: true,
      },
      {
        name: 'shot_number',
        description: `Which shot in the sequence this generation call represents`,
        example: `3 of 5`,
        required: true,
      },
      {
        name: 'shot_action',
        description: `What happens in this specific shot only`,
        example: `steam rising as hot water is poured over the grounds`,
        required: true,
      },
      {
        name: 'shot_framing',
        description: `The framing for this specific shot only`,
        example: `close-up, 45-degree angle down onto the dripper`,
        required: true,
      },
    ],
    targetTools: [`Runway Gen-4.5`],
    tags: [`video`, `continuity`, `product-video`, `multi-shot`, `runway`],
    whyItWorks: `Runway Gen-4.5 has no memory between separate generation calls — each shot in a sequence is an independent inference, so continuity across shots only exists if the operator re-supplies the same locked language every time, verbatim, rather than trusting the model to "remember" the previous shot's look. Splitting the brief into a MASTER LOCK block that never changes and a PER-SHOT DELTA block that only carries what's different is the mechanical fix: it stops the common failure mode where an operator paraphrases the lighting or grade slightly differently on shot 4 than shot 1, which reads as almost-but-not-quite matching footage once cut together — worse than an obvious mismatch because it's subtly distracting rather than clearly intentional. The explicit continuity-check step exists because Gen-4.5's grade and lighting interpretation can still drift slightly even with identical wording, particularly on saturation and color temperature; catching that after each shot and restating the lock clause verbatim in the next call is cheaper than regrading five separate clips in post to match. Keeping the lens lock as a stated constraint (rather than a specific focal length number, which the model can't literally honor) targets the more common failure of shots feeling like different "cameras" were used, which breaks continuity even when subject and lighting are correct.`,
    exampleOutput: `Shot 3 of 5: a close-up 45-degree angle onto the same matte-black ceramic dripper from shots 1-2, same warm 3200K key light and rim light, steam rising as water pours over the grounds, grade matching the established warm neutral baseline with lifted blacks, 4 seconds, ambient kitchen sound carried through from the previous shot.`,
    verifiedAgainst: [{ tool: 'Runway Gen-4.5', version: 'Gen-4.5', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Runway Gen-4.5.`,
      },
    ],
  },
  {
    slug: 'runway-youtube-thumbnail-hero-frame',
    category: 'runway',
    title: `Generate a single high-contrast hero frame for a YouTube thumbnail from a video's key moment`,
    description: `A short, direct Runway Gen-4.5 still-frame brief for producing one punchy, legible hero image built specifically to survive being shrunk to a 120px-wide thumbnail.`,
    promptText: `Generate a single still frame, not a moving clip: {{hero_subject}} at the peak of {{peak_moment}}, framed tight enough that the subject fills at least 60% of the frame.
Expression and pose: exaggerated and legible — {{expression_note}} — since this needs to read clearly at thumbnail size, not just at full resolution.
Lighting: high-contrast, {{lighting_style}}, with a clear separation between subject and background so the silhouette stays readable even shrunk down.
Background: simplified and slightly blurred version of {{background_scene}}, no competing focal points.
Color: punchy, slightly boosted saturation on {{accent_color}}, avoiding muddy mid-tones that flatten out at small sizes.
Composition: leave clear negative space in the {{text_zone}} of the frame for a text overlay to be added afterward — do not render any text in the generation itself.
Do not generate: motion blur, multiple competing subjects, or fine detail that would disappear at small size.`,
    variables: [
      {
        name: 'hero_subject',
        description: `The main subject of the thumbnail`,
        example: `a chef mid-flip with a pan of flames`,
        required: true,
      },
      {
        name: 'peak_moment',
        description: `The exact instant being frozen, chosen for maximum visual drama`,
        example: `the flame flare-up right as the pan flips`,
        required: true,
      },
      {
        name: 'expression_note',
        description: `How exaggerated the expression or pose should read`,
        example: `wide-eyed excitement, mouth open mid-shout`,
        required: true,
      },
      {
        name: 'lighting_style',
        description: `The specific high-contrast lighting treatment`,
        example: `warm flame light on the subject against a darkened kitchen background`,
        required: true,
      },
      {
        name: 'background_scene',
        description: `What's behind the subject, kept simple`,
        example: `a professional kitchen line`,
        required: true,
      },
      {
        name: 'accent_color',
        description: `Which color in the frame should carry the punch`,
        example: `the orange-red flame`,
        required: false,
      },
      {
        name: 'text_zone',
        description: `Which part of the frame stays clear for a text overlay`,
        example: `lower third`,
        required: true,
      },
    ],
    targetTools: [`Runway Gen-4.5`],
    tags: [`thumbnail`, `still-frame`, `youtube`, `composition`, `runway`],
    whyItWorks: `A thumbnail lives or dies at a size roughly 15 times smaller than the frame it was generated at, which is why this prompt front-loads instructions most video briefs skip entirely: subject fill percentage, exaggerated legible expression, and a named text-safe zone. Asking Gen-4.5 for a single still rather than a clip also matters mechanically — treating it as a video generation invites motion blur and mid-action ambiguity in the frame the model happens to land on, whereas explicitly requesting one still forces the model to commit to a single, deliberately composed peak moment instead of an arbitrary frame from a moving sequence. The high-contrast lighting and simplified, slightly blurred background instruction exists to preserve the silhouette read at small sizes — busy or evenly-lit backgrounds are the most common reason a technically good generation fails as a thumbnail once shrunk down, because the eye can no longer separate subject from background at 120 pixels wide. Explicitly telling the model not to render text keeps the composition clean for a real overlay added in an editor, since Gen-4.5's native text rendering is inconsistent enough that leaving it in-frame risks unreadable or misspelled pseudo-text that would need to be painted out anyway.`,
    exampleOutput: `A tight, high-contrast still of a chef mid-flip with an orange-red flame flare-up filling most of the frame, wide-eyed exaggerated expression, warm flame light against a blurred darkened kitchen line, clear open space in the lower third for a text overlay, no text rendered in the image.`,
    verifiedAgainst: [{ tool: 'Runway Gen-4.5', version: 'Gen-4.5', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against Runway Gen-4.5.`,
      },
    ],
  },
  {
    slug: 'runway-shot-list-production-brief',
    category: 'runway',
    title: `Turn a rough campaign idea into a Gen-4.5-ready shot list and technical production brief`,
    description: `A structured pre-production prompt that takes a loose creative idea and produces a Runway Gen-4.5-ready shot-by-shot brief, complete with technical settings and explicit rules for what to avoid, so a small team can go straight from idea to generation without a separate planning meeting.`,
    promptText: `You are producing a pre-production brief for a short branded video that will be generated shot-by-shot in Runway Gen-4.5, not written for a live-action shoot.

Inputs:
Campaign idea: {{campaign_idea}}
Target length: {{target_length}}
Platform: {{target_platform}}
Must-include elements: {{must_include}}

Produce the brief in this exact structure:
1. Shot list table — one row per shot, columns: shot number, description, duration (seconds), camera treatment, and a one-line note on how this shot connects visually to the one before it.
2. Technical settings block — recommended aspect ratio for {{target_platform}}, whether each shot should be static or has camera movement, and any shots that require a reference image versus a text-only prompt.
3. Consistency notes — call out every element (character, product, location, color palette) that must stay identical across more than one shot, and flag which shots share that element.
4. Rules for what NOT to generate — an explicit list of things to exclude from every shot (for example: no on-screen logos rendered by the model, no dialogue/lip-sync, no camera moves faster than a slow push, no shot longer than the platform's native limit).
5. Open questions — anything in the campaign idea that's underspecified and needs a decision from the creative lead before generation starts, rather than guessed at.

Do not write the actual Runway generation prompts themselves in this brief — this is the planning document that a separate prompt gets written from, one shot at a time.`,
    variables: [
      {
        name: 'campaign_idea',
        description: `The rough, unstructured creative idea to turn into a plan`,
        example: `a 20-second spot showing a running shoe going from a cluttered closet to a sunrise trail run`,
        required: true,
      },
      {
        name: 'target_length',
        description: `The total intended runtime of the finished video`,
        example: `20 seconds`,
        required: true,
      },
      {
        name: 'target_platform',
        description: `Where the finished video will run, which affects aspect ratio and shot length`,
        example: `Instagram Reels`,
        required: true,
      },
      {
        name: 'must_include',
        description: `Specific elements the campaign requires regardless of creative direction`,
        example: `the shoe's signature red laces must be visible in at least two shots`,
        required: true,
      },
    ],
    targetTools: [`Runway Gen-4.5`],
    tags: [`production-brief`, `shot-list`, `pre-production`, `planning`, `runway`],
    whyItWorks: `The most common way small teams waste Runway generation credits is jumping straight into prompt-writing on an under-planned idea, discovering mid-sequence that the closet-to-trail idea needs the shoe to look identical in shot 1 and shot 6 with no reference image ever specified, and re-generating from scratch. Structuring this as a planning document rather than a generation prompt is deliberate — it forces the consistency notes and technical settings to exist on paper before a single Gen-4.5 call is made, so reference images and locked-language clauses (the kind used in a per-shot continuity brief) get identified up front instead of discovered by trial and error. The explicit 'rules for what NOT to generate' section exists because Gen-4.5's default behavior on ambiguous briefs tends toward adding motion, dialogue, or on-screen text the team didn't ask for; naming exclusions here means every downstream shot prompt inherits the same guardrails instead of each shot's author re-inventing them. The 'open questions' section is the other load-bearing piece: it stops the brief from silently guessing at underspecified details (exact platform aspect ratio, whether the product needs a reference image) and instead surfaces them as decisions for a human, which is cheaper to resolve on paper than after three generations have already gone out with three different guesses baked in.`,
    exampleOutput: `1. Shot list: Shot 1 (0-4s) — cluttered closet, shoe half-buried under other pairs, static frame, establishes contrast with later shots... 2. Technical settings: 9:16 for Reels, shots 1-2 static, shots 3-5 slow push-in, product reference image required for shots featuring the shoe close-up... 3. Consistency notes: red laces and shoe silhouette must match across shots 1, 3 and 6... 4. Do not generate: no logo overlays, no dialogue, no shot exceeding 5 seconds... 5. Open questions: is the sunrise trail a real location reference or fully generated?`,
    verifiedAgainst: [{ tool: 'Runway Gen-4.5', version: 'Gen-4.5', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against Runway Gen-4.5.`,
      },
    ],
  },
]
