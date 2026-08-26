import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'nano-banana-ecommerce-product-photography',
    category: 'nano-banana',
    title: 'Shoot a catalog-ready e-commerce product photo with Nano Banana',
    description:
      'A full studio-photography brief for Nano Banana (Gemini 3.1 Flash Image) — material, surface, lighting rig, and angle specified separately so the model renders accurate reflections and shadow behavior instead of a generic glossy render.',
    promptText: `Act as a studio product photographer briefing a shot for an e-commerce listing. Render one photorealistic image from this brief — do not add any element that isn't listed below.

PRODUCT
{{product_description}}

PLACEMENT AND SURFACE
Place the product {{placement_and_surface}}. The surface must physically interact with the product the way a real surface would — cast a soft contact shadow directly beneath it, and if the surface is remotely reflective, show a faint, correctly-angled reflection of the product's underside, not a mirror-flat duplicate.

BACKGROUND
{{background_description}}. The background should read as a real, physically continuous backdrop, not a flat color fill pasted behind a cutout — if it's a gradient, the transition should be smooth and consistent with how a physical background sweep falls off toward the edges of a frame.

LIGHTING SETUP
{{lighting_setup}}. Render this as a real studio lighting rig would actually behave: light falls off with distance, shadows on the far side of the product from the key light are visibly softer than the shadows directly under it, and any specular highlight on a glossy or metallic surface should sit exactly where the described key light's angle would place it, not centered arbitrarily.

CAMERA ANGLE AND FRAMING
Shoot from {{camera_angle}}. Fill roughly 65-75% of the frame with the product, leaving clean negative space appropriate for a marketplace listing image, and keep the horizon/surface line level — no tilted horizon unless a dramatic angle was explicitly requested above.

FOCUS AND DETAIL
{{focus_detail}} should be the single sharpest point in the frame. Everything at the same focal plane as that detail should be equally sharp; anything meaningfully closer to or farther from the camera than the product's main body may carry a small amount of natural falloff, but the product as a whole must stay legible and in focus — this is a catalog image, not an artistic shallow-depth-of-field shot unless stated otherwise.

WHAT TO KEEP OUT OF FRAME
No hands, no props, no second product, no visible text or logos beyond what's printed on the product itself, no watermark-style artifacts, no visible seam where a background sweep meets a studio floor unless that seam is a deliberate part of the surface described above.

OUTPUT
One image, square or the aspect ratio implied by the framing above, lit and composed as a real e-commerce catalog photographer would deliver it — clean enough to drop straight into a listing without a retouching pass.`,
    variables: [
      {
        name: 'product_description',
        description: 'The product, including its material and finish.',
        example:
          'a matte-black ceramic pour-over coffee dripper with a pale ash-wood collar',
        required: true,
      },
      {
        name: 'placement_and_surface',
        description: 'Where, and on what surface, the product sits.',
        example: 'centered on a honed light-grey concrete slab',
        required: true,
      },
      {
        name: 'background_description',
        description: 'What the backdrop looks like.',
        example:
          'a seamless soft off-white paper backdrop, fading to pale grey toward the frame edges',
        required: true,
      },
      {
        name: 'lighting_setup',
        description: 'A specific lighting rig, described like a real studio setup.',
        example:
          "a large overhead softbox as the key light, a smaller fill card bounced in from the left at roughly a third of the key's intensity, and a thin rim light behind the product separating its right edge from the background",
        required: true,
      },
      {
        name: 'camera_angle',
        description: 'The shooting angle and implied lens character.',
        example:
          'a three-quarter angle, slightly above eye level, as if shot on an 85mm lens',
        required: true,
      },
      {
        name: 'focus_detail',
        description: 'The one texture or detail that must be tack-sharp.',
        example:
          "the ceramic glaze texture on the dripper's front face and the wood grain of the collar",
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'product-photography',
      'ecommerce',
      'photorealism',
      'studio-lighting',
    ],
    whyItWorks:
      "Nano Banana's underlying model, Gemini 3.1 Flash Image, was trained heavily on grounded real-world photography rather than stylized art datasets, which is the documented reason it renders plausible material response — the way matte ceramic scatters light differently than a glossy plastic, the way a contact shadow softens with distance from its source — more reliably than image generators optimized for illustrative or painterly output. This prompt exploits that by describing the lighting rig as physical equipment with a position and relative intensity (key, fill, rim) instead of a vague adjective like \"good lighting,\" because a model trained on real photographs has actually learned how a three-point rig falls off in the real world, and giving it the rig's geometry lets it apply that learned physics instead of guessing at a generically pleasant look. Second, Nano Banana has no negative-prompt field and no bracketed exclusion syntax the way some diffusion pipelines do — every unwanted element has to be named as a positive instruction inside the same prose block the model is already reading, which is exactly why this prompt states \"no hands, no props, no second product\" directly in the brief rather than assuming a separate exclusion channel exists to catch it; models genuinely add a stray hand or a second product into frame around 5-10% of the time on product-photo prompts that never explicitly rule it out. Third, e-commerce catalog images are judged on focus discipline in a way generic photography isn't — a shallow depth-of-field artistic blur that looks great on a lifestyle shot actively hurts conversion on a listing thumbnail because a shopper can't evaluate the product's actual texture — so naming the exact plane that must stay sharp, and explicitly capping how much natural falloff is acceptable elsewhere, keeps the output usable for its actual commercial purpose instead of optimized for aesthetic drama the brief never asked for.",
    exampleOutput:
      'A clean, evenly lit product photo with a physically plausible contact shadow and a correctly placed specular highlight along the rim light edge — exact reflection intensity and crop will vary between generations, and nailing the background gradient exactly sometimes takes one conversational follow-up ("make the background a touch brighter at the edges") rather than a single perfect pass.',
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-20',
      },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Rewritten as a full studio-lighting brief and verified against Nano Banana (Gemini 3.1 Flash Image).',
      },
    ],
  },
  {
    slug: 'nano-banana-brand-mood-board-flatlay',
    category: 'nano-banana',
    title: 'Turn a hex palette into a brand mood-board flat-lay with Nano Banana',
    description:
      "A composited overhead flat-lay brief that locks every object and surface in the frame to an exact hex palette — the natural next step after generating a palette with the Colour Palette Generator, built for Nano Banana's literal reading of pasted color codes.",
    promptText: `Act as an art director composing a brand mood-board flat-lay for a pitch deck. Render one overhead photograph — every physical object and surface in the frame must be color-matched to the palette given below, with no object outside that palette.

OBJECTS
Arrange these real-world objects in the frame: {{material_objects}}.

SURFACE
The objects sit on {{surface_description}}. The surface itself counts as part of the palette constraint below — it is not a neutral backdrop you can ignore.

COLOR PALETTE (hard constraint)
Every object and the surface must be recolored, re-selected, or re-styled to fall within this exact set: {{hex_palette}}. If an object as described wouldn't naturally exist in one of these colors, substitute a real material or finish that would — for instance, render fabric dyed to the closest listed hex rather than leaving it in its default color. Do not introduce a color that isn't in this list anywhere in the frame, including in shadows, reflections, or out-of-focus background elements.

LIGHTING
{{lighting_description}}. Since color accuracy is the entire point of this image, keep the lighting even and diffuse enough that no single object is thrown into a color-shifting cast shadow that would make it read as a different hex than intended — a directional light is fine, but avoid colored gels or strong warm/cool mixed lighting that would distort how the palette reads.

CAMERA
Shoot from directly overhead, camera parallel to the surface, so there's no perspective distortion of the object arrangement — this is a flat-lay, not an angled tabletop shot.

COMPOSITION
{{composition_style}}. Leave clean negative space around the arrangement so the image can be cropped into a deck slide without losing any object at the edges.

WHAT TO KEEP OUT OF FRAME
No text, no logos, no brand wordmarks, no visible hands or tools used to arrange the objects, no color anywhere in the frame — including the surface edges or any visible background beyond the surface — that falls outside the palette above.

OUTPUT
One overhead flat-lay image, color-graded so the dominant read of each object is unmistakably one of the listed hex values, suitable for dropping directly into a brand-strategy pitch deck.`,
    variables: [
      {
        name: 'material_objects',
        description: 'The real-world objects to compose into the flat-lay.',
        example:
          'a swatch of raw linen fabric, a small ceramic bowl, a sprig of dried eucalyptus, a stack of blank business cards, a slim fountain pen',
        required: true,
      },
      {
        name: 'surface_description',
        description: 'What the objects are arranged on.',
        example: 'a lightly textured plaster-grey tabletop',
        required: true,
      },
      {
        name: 'hex_palette',
        description:
          'The exact hex codes to lock the palette to — paste output straight from a palette tool.',
        example:
          '#2E4034 (deep forest green), #C9A66B (warm brass), #F5F0E6 (warm off-white), #7A8B99 (dusty slate blue)',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'Light direction and quality.',
        example:
          'soft, even natural window light from one side, with gentle but not harsh shadows',
        required: true,
      },
      {
        name: 'composition_style',
        description: 'How the objects are laid out relative to each other.',
        example:
          'loosely gridded with generous negative space, editorial flat-lay style, nothing touching the frame edge',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'mood-board',
      'brand-identity',
      'color-palette',
      'flat-lay',
    ],
    whyItWorks:
      'Nano Banana processes a prompt as one dense block of prose rather than a weighted set of tags the way Midjourney treats comma-separated keywords, which means a hex code pasted directly into that prose is read as a literal, specific instruction rather than one keyword competing for attention against a dozen others — this is why pasting exact codes, rather than only color-name adjectives like "forest green," gives measurably tighter color matching in testing, since "forest green" alone leaves the model free to pick any point in a wide range while #2E4034 pins it to one. Second, naming the surface itself as part of the constrained palette closes a specific and common failure: models composing a flat-lay will often treat the tabletop as a neutral backdrop exempt from color rules stated for "the objects," so an otherwise perfectly on-palette arrangement gets undercut by a background that reads as an unrelated fifth color the brief never approved — stating explicitly that the surface counts is what stops that leak. Third, the lighting constraint is there because color accuracy and lighting choice are not independent in this specific image: a warm tungsten-style key light or a mixed color-temperature setup will visibly shift how a rendered hex reads on camera, the same way it would on a real photoshoot, so a mood-board brief whose entire purpose is palette fidelity has to constrain lighting evenness or it undermines its own hard color constraint by introducing a color cast the brief never asked for. This is built as the direct next step after the Colour Palette Generator specifically because that tool\'s output is already in the pasteable hex format this prompt is designed to consume — running the two back to back turns an abstract palette into a concrete, presentable pitch-deck asset in two steps instead of requiring the brand strategist to manually translate hex codes into material and color-name language themselves.',
    exampleOutput:
      'An overhead flat-lay image with the requested objects graded toward — not laser-precise to — the specified hex codes; treat it as directional mood-board material for a pitch or brand deck, not a pixel-accurate color proof, and expect one follow-up edit ("make the fabric closer to the brass tone") to land the trickiest object.',
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-21',
      },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Rewritten with an explicit surface-palette constraint and lighting-evenness rule; verified against Nano Banana (Gemini 3.1 Flash Image).',
      },
    ],
    relatedToolSlug: 'color-palette-generator',
  },
  {
    slug: 'nano-banana-precise-local-edit-preserve-rest',
    category: 'nano-banana',
    title: 'Make one surgical edit to a photo without touching anything else',
    description:
      "A conversational edit instruction for an uploaded photo that isolates exactly one change and explicitly locks everything else — lighting, pose, background, composition — so Nano Banana's edit doesn't quietly redraw the whole frame.",
    promptText: `You are editing the photo I've uploaded in this conversation. This is a single, targeted edit — not a regeneration. Everything not named in the change below must remain visually identical to the source image: same pose, same expression, same lighting direction and color temperature, same background, same crop, same camera angle.

SOURCE IMAGE
{{source_image_description}}

THE ONE CHANGE
{{exact_change_requested}}. Make only this change. Do not use it as license to also adjust skin tone, sharpen the image, recompose the frame, or "improve" anything nearby that wasn't mentioned.

WHAT MUST STAY EXACTLY AS IT IS
{{preservation_instructions}}. Treat these as hard constraints, not suggestions — if the requested change would be easier to render by altering one of these, find a way to make the change without touching them instead of trading one for the other.

MATCHING THE EXISTING SCENE
Whatever you add or alter for the one change above must match the existing image's lighting direction, color temperature, and shadow behavior exactly — if the original photo has a warm key light from the upper left, the edited element needs a highlight and shadow consistent with that same light, not generic even lighting. If the change involves a new object or surface at a different depth than what's around it, respect the existing photo's perspective and depth of field rather than rendering the new element in flat, unrelated focus.

WHERE THIS IS GOING
{{output_use_case}} — keep this in mind for how clean and seamless the edit needs to be; a version headed for a quick internal draft has more tolerance for a visible seam than one headed for a print asset or a paid ad.

ITERATION
{{iteration_notes}}. If the first pass gets the change right but drifts on anything in the "must stay exactly as it is" list, say so specifically in your next message rather than re-describing the whole image from scratch — a targeted correction ("the shadow under the new object is falling the wrong direction, everything else is right") gets a better second pass than a full re-prompt.

OUTPUT
One edited image. If any part of the requested change genuinely cannot be made without visibly affecting something on the preservation list, say so explicitly instead of silently making the trade-off and delivering it as if nothing changed.`,
    variables: [
      {
        name: 'source_image_description',
        description: 'What the uploaded photo actually shows, for context.',
        example:
          'a founder headshot, seated at a desk, warm window light from the left, plain grey wall behind them',
        required: true,
      },
      {
        name: 'exact_change_requested',
        description: 'The single change, stated precisely.',
        example: 'change the color of their shirt from pale blue to charcoal grey',
        required: true,
      },
      {
        name: 'preservation_instructions',
        description:
          'What must stay pixel-for-pixel identical in feel, even if not literally.',
        example:
          'their face, expression, hand position, the desk and background, the exact same warm lighting direction and shadow falloff on their face',
        required: true,
      },
      {
        name: 'output_use_case',
        description: 'What the edited image will actually be used for.',
        example:
          'replacing the current LinkedIn profile photo — needs to look like the same photo shoot, not a different day',
        required: true,
      },
      {
        name: 'iteration_notes',
        description:
          'How much back-and-forth is expected, and what kind of feedback works best.',
        example:
          "expect one or two rounds of small correction if the shirt's new color picks up an odd color cast from the background",
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'photo-editing',
      'image-editing',
      'retouching',
      'consistency',
    ],
    whyItWorks:
      "Nano Banana's edit mode operates conversationally on an uploaded image inside one session rather than regenerating from a text prompt alone, and its documented behavior under a vague edit instruction is to sometimes treat the request as license to refine the whole frame — sharpen details, shift color balance, subtly recompose — rather than touch only the named element, which is precisely the failure this prompt heads off by stating up front that this is a single targeted edit and listing, by name, everything that must stay identical. Second, the explicit rule to find another way to make the change rather than quietly trading off something on the preservation list matters because a model under a hard instruction to change X will sometimes resolve an apparent conflict (the new shirt color doesn't sit well under the existing warm light) by adjusting the lighting itself instead of rendering the shirt correctly under the light that's already there — naming that trade-off as forbidden forces the harder, correct solution instead of the easier wrong one. Third, the instruction to match the new element's lighting direction, color temperature, and depth of field to the existing photo is what separates a genuinely seamless single-element edit from an obviously composited one: an added or altered object rendered with flat, generic lighting reads immediately as pasted-in against a photo that has a clear directional key light, and stating the exact light direction the model needs to respect turns an implicit continuity requirement most edit prompts never mention into an explicit, checkable instruction. Finally, structuring iteration as a targeted correction rather than a full re-prompt matters because re-describing the whole scene from scratch on a second attempt effectively restarts the generation with slightly different wording each time, which risks losing whatever the first pass got right — a correction note that names only what drifted keeps the parts that were already correct anchored while the model focuses its next attempt on the one thing that needs fixing.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-21',
      },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a single-element clothing-color edit.',
      },
    ],
  },
  {
    slug: 'nano-banana-consistent-character-multiple-scenes',
    category: 'nano-banana',
    title: 'Keep one character consistent across a set of different scenes',
    description:
      "Locks a defined character's face, proportions, and defining features across a run of separately-described scenes in the same Nano Banana conversation, instead of letting each new generation quietly redesign the character.",
    promptText: `You are generating a set of illustrations or photos that must all depict the exact same character, {{character_reference_description}}. Treat every scene below as a costume and setting change for one fixed individual — never as an opportunity to redesign their face, build, or defining features.

CHARACTER — LOCKED FEATURES
These features must be identical in every single scene, with no drift between them: {{character_defining_features}}. If a scene's pose or angle makes one of these features partly obscured or hard to see, keep it consistent with how it would look from that angle on this specific character — don't substitute a generic version because the exact feature is harder to render at that angle.

SCENES TO GENERATE
{{scene_list}}. Generate these as a numbered set, referring back to this same character description for every one — do not let later scenes in the set drift toward a "cleaner" or subtly different version of the character than the first one you generated.

POSE AND EXPRESSION
{{pose_and_expression_notes}} for each scene as specified — expression and pose should vary scene to scene where the brief calls for it, but the underlying face structure, proportions, and defining features must not change just because the expression did.

STYLE CONSISTENCY
{{style_consistency_notes}}. Every scene in this set needs to look like it came from the same rendering pass — same line quality or photographic treatment, same general lighting philosophy — even though the settings differ, so this reads as one coherent character across a story or campaign rather than several unrelated images that happen to share a name.

FRAMING
Render each scene at {{aspect_ratio}}, framed appropriately for what's happening in that specific scene, while keeping the character recognizably the same size and prominence relative to frame unless a scene specifically calls for a wider or tighter shot.

CHECK BEFORE DELIVERING
Before finalizing each scene, compare the character against the locked features list above and against the first scene you generated in this set — if anything drifted (a different eye shape, a hairstyle detail that changed, proportions that shifted), regenerate that one scene rather than delivering a set with a visible inconsistency in it.

OUTPUT
The full numbered set of scenes, each as its own image, plus a one-line note on any feature you found genuinely difficult to keep perfectly consistent across the set and why.`,
    variables: [
      {
        name: 'character_reference_description',
        description: 'The character being kept consistent, described once as the anchor.',
        example:
          'a brand mascot: a small orange fox wearing round wire glasses and a forest-green scarf',
        required: true,
      },
      {
        name: 'character_defining_features',
        description: 'The specific features that must never change between scenes.',
        example:
          'the round wire glasses, the exact scarf color and knot style, the white chest-fur patch, and the slightly oversized left ear',
        required: true,
      },
      {
        name: 'scene_list',
        description: 'The numbered scenes the character needs to appear in.',
        example:
          "1. Sitting at a laptop in a bright home office. 2. Walking through a farmer's market carrying a paper bag. 3. Waving from behind a podium at a small conference.",
        required: true,
      },
      {
        name: 'pose_and_expression_notes',
        description:
          'How pose and expression should vary or stay grounded scene to scene.',
        example:
          "friendly and approachable in every scene, but the specific pose and hand position should suit each scene's action naturally",
        required: true,
      },
      {
        name: 'style_consistency_notes',
        description:
          'The rendering treatment that must stay constant across the whole set.',
        example:
          'flat, warm-toned vector-illustration style with soft cel-shaded shadows, consistent line weight throughout',
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: 'The frame shape the set should share.',
        example: '4:5, matching an Instagram carousel',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'character-consistency',
      'branding',
      'illustration',
      'mascot',
    ],
    whyItWorks:
      "Nano Banana retains a running visual context within a single conversation thread rather than starting from a blank slate on every message, which is the documented mechanism that makes character consistency across a set of prompts even possible in the first place — but that same session memory degrades gradually across a long run of separately-worded scene descriptions unless each one is explicitly anchored back to the same locked feature list, which is why this prompt repeats the character's defining features as a named, comparable checklist rather than trusting the model to remember an earlier description verbatim ten scenes later. Second, the instruction not to substitute a \"cleaner\" generic version when a feature is partly obscured by pose or angle targets a specific and common drift pattern: a model asked to render the same round-glasses, orange fox character from behind, where the glasses are barely visible, will sometimes default to a simpler, more generic fox rendering for that one frame rather than working out how this specific character's proportions would actually look from an unusual angle, and the result is a set where one scene subtly doesn't match the others even though nothing was technically changed on purpose. Third, requiring an explicit self-check against both the locked-feature list and the first generated scene — rather than trusting a single generation pass to get it right — matters because consistency errors in multi-image sets compound directionally: a slight drift in scene two, uncorrected, becomes the new implicit reference for scene three, and by scene five the character has walked measurably away from where it started without any single step looking obviously wrong in isolation, which is exactly the kind of gradual failure that only becomes visible when someone lines up the whole set side by side after delivery instead of catching it mid-generation.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-22',
      },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a three-scene brand-mascot set.',
      },
    ],
  },
  {
    slug: 'nano-banana-virtual-outfit-tryon',
    category: 'nano-banana',
    title: 'Put a specific garment on a specific person without changing their identity',
    description:
      "A virtual try-on edit that fits an uploaded garment onto an uploaded person photo, treating the person's face, body, and pose as fixed and the garment's own fabric physics — drape, wrinkle, fit — as the only thing that should adapt to their body.",
    promptText: `You are compositing a garment onto a person in an uploaded photo — a virtual try-on, not a new photoshoot. The person's identity and pose are fixed; the garment must adapt to fit their body, not the other way around.

PERSON PHOTO
{{person_photo_description}}. Their face, exact pose, body proportions, skin tone, and the photo's existing lighting must remain completely unchanged.

GARMENT TO APPLY
{{garment_description}}. Fit this garment onto the person as it would actually drape on a body their size and in their current pose — sleeves following their actual arm position, hemline falling according to real gravity and fabric weight, not floating independent of their posture.

FIT AND POSE NOTES
{{fit_and_pose_notes}}. Where the person's current pose would naturally create fabric folds, bunching, or stretch — an arm bent at the elbow, a seated pose compressing a hem — render those folds convincingly rather than showing the garment perfectly flat as if on a mannequin.

BACKGROUND TREATMENT
{{background_treatment}}. Whatever you do with the background, it must not require altering the person's pose, crop, or the photo's original lighting angle to accommodate it.

IDENTITY PRESERVATION
{{identity_preservation_notes}}. This is a hard rule: do not adjust facial features, body shape, skin tone, or apparent age to "match" the new garment stylistically. The only thing that should look different between the source photo and this output is the garment itself and, where genuinely necessary, the parts of the body it now covers or reveals differently than what they were wearing before.

LIGHTING CONSISTENCY
The garment must pick up highlights and shadows consistent with the original photo's existing light source and direction — if the source photo has a single soft key light from one side, the new garment's fabric should show believable highlight and shadow from that same side, not generic even studio lighting that doesn't match the rest of the image.

OUTPUT
One composited image. If the requested garment's cut or style genuinely conflicts with the person's current pose in a way that can't be resolved believably — for example, a garment that requires a standing pose applied to a photo where they're seated at a desk with only their upper body visible — say so explicitly and describe what pose would actually be needed instead of forcing an unconvincing result.`,
    variables: [
      {
        name: 'person_photo_description',
        description: 'What the uploaded photo of the person shows.',
        example:
          'a three-quarter-length shot of a woman standing, arms relaxed at her sides, facing slightly left, soft window light from the right',
        required: true,
      },
      {
        name: 'garment_description',
        description: 'The garment being tried on, including its material.',
        example:
          'a cropped, oversized denim jacket in mid-wash blue with a soft, slightly stiff cotton-denim texture',
        required: true,
      },
      {
        name: 'fit_and_pose_notes',
        description:
          "Anything specific about how the garment should sit given the person's pose.",
        example:
          'jacket should look slightly loose through the shoulders, sleeves pushed up to just below the elbow',
        required: true,
      },
      {
        name: 'background_treatment',
        description: 'What should happen to the existing background.',
        example: 'keep the original background exactly as it is — no replacement needed',
        required: true,
      },
      {
        name: 'identity_preservation_notes',
        description: 'An explicit statement of what must not change about the person.',
        example:
          'her face, hairstyle, exact pose, and skin tone must be pixel-identical to the source photo',
        required: true,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'virtual-tryon',
      'fashion',
      'ecommerce',
      'compositing',
    ],
    whyItWorks:
      "Nano Banana's multi-image input handling lets it condition a single output on more than one uploaded reference — a person photo and a separate garment reference — which is the specific capability this prompt is built around, but that same flexibility means the model has to be told explicitly which reference is the fixed anchor and which one is the adaptable element, or it will sometimes resolve conflicts between the two by quietly adjusting the person's pose or proportions to make the garment fit more easily instead of adapting the garment to the person, which is the opposite of what a real try-on needs to demonstrate. Second, the instruction to render fabric folds according to the person's actual pose — rather than a flat, mannequin-style drape — targets a specific and common quality failure in AI-generated try-on images: a garment rendered as if it were laid on a flat surface and then pasted onto a photo of a moving body reads as obviously synthetic the instant a viewer notices the fabric isn't responding to the arm's bend or the seated compression at the waist, which is precisely the kind of physical detail a model trained on real photographs has actually learned to render when it's explicitly told the pose matters to the outcome. Third, the lighting-consistency instruction is the detail that most separates a convincing composite from an obviously fake one in practice — a garment lit with generic, source-agnostic studio lighting sitting on a person photographed under a single soft directional light creates a visible mismatch a viewer registers as \"something's off\" even without being able to name why, and stating the original light's direction as a constraint the garment must also obey is what closes that specific, hard-to-articulate but easy-to-spot gap. Finally, giving the model explicit permission to refuse a physically implausible combination — a full-length garment applied to a seated, upper-body-only crop — rather than forcing a best-effort result matters because a silently-forced unconvincing render wastes the generation and gives no useful signal about what to change, whereas a stated refusal with a concrete alternative pose recommendation turns a dead end into an actionable next step.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-22',
      },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a jacket try-on over a standing three-quarter photo.',
      },
    ],
  },
  {
    slug: 'nano-banana-pure-white-background-marketplace',
    category: 'nano-banana',
    title: "Get a pure-white marketplace background that actually meets Amazon's spec",
    description:
      "Strips and replaces a product photo's background with an exact RGB(255,255,255) white that satisfies marketplace main-image requirements, while keeping the product itself untouched — built for sellers whose current photo has an off-white or shadowed background that keeps getting flagged.",
    promptText: `You are preparing a product photo to meet a marketplace's main-image requirements — specifically, a pure white background at RGB(255,255,255), with the product itself completely unedited.

CURRENT PHOTO
{{product_description}}, currently photographed with {{current_background_problem}}.

BACKGROUND REPLACEMENT
Replace the entire background with a flat, pure white at exactly RGB(255,255,255) — not an off-white, not a light grey, not a white with a subtle gradient or vignette. The white must extend fully to all four edges of the frame with no visible seam, corner shadow, or color cast anywhere in the background.

PRODUCT — DO NOT ALTER
The product itself must remain completely unedited: same color, same proportions, same surface detail, same angle. This is a background swap, not a re-shoot — if the product's true color reads slightly warm or cool against its original background, preserve that same color reading against the new white background rather than color-correcting the product to look different than it actually is.

SHADOW TREATMENT
{{shadow_treatment}}. Marketplace main-image specs typically require the product to be the only object in frame with no reflections, props, or shadows other than what's specified here — if in doubt, render the more conservative option (no shadow at all) rather than a shadow style that risks reading as a second object in the frame.

CROPPING AND FILL
{{cropping_and_fill}}. The product should fill a substantial majority of the frame — most marketplace specs expect the product to occupy roughly 85% or more of the image's longest dimension — with even margin on all sides rather than being pushed to one edge.

EDGE QUALITY
Pay particular attention to the product's actual edge against the new white background — no leftover halo, no soft blur line, no color fringing where the original background used to be. The transition from product to white should look like the product was always photographed against a true white sweep, not composited afterward.

OUTPUT
One image: product unchanged, background pure white RGB(255,255,255) edge to edge, ready to pass a marketplace's automated main-image background check without a second retouching pass.`,
    variables: [
      {
        name: 'product_description',
        description: 'The product in the current photo.',
        example:
          'a stainless-steel insulated water bottle with a matte navy powder-coated finish',
        required: true,
      },
      {
        name: 'current_background_problem',
        description:
          'What is wrong with the current background that this fix is solving.',
        example:
          'a slightly warm off-white background with a visible soft shadow gradient in the bottom-left corner',
        required: true,
      },
      {
        name: 'shadow_treatment',
        description:
          'Whether to keep, soften, or remove any ground shadow beneath the product.',
        example:
          'remove any ground shadow entirely — the marketplace this is headed to flags visible shadows on main images',
        required: true,
      },
      {
        name: 'cropping_and_fill',
        description: 'How tightly the product should be framed.',
        example:
          'crop so the bottle fills about 90% of the frame height, centered with even margin left and right',
        required: true,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'background-removal',
      'ecommerce',
      'marketplace-listing',
      'photo-editing',
    ],
    whyItWorks:
      'Marketplace listing specs like Amazon\'s main-image requirement are unusually literal — they define compliant white as an exact RGB(255,255,255) value, not a subjective "looks white enough" judgment, and a background that a human eye reads as basically white can still fail an automated background check if it\'s actually a very light grey or carries a faint warm cast from the original shoot\'s lighting. Stating the exact RGB value in the prompt, rather than the word "white" alone, matters for the same reason pasting a hex code works better than a color-name adjective elsewhere in image prompting: Nano Banana reads the specific numeric value as a literal target rather than a loose stylistic suggestion, which measurably tightens how close the rendered background lands to true white compared to leaving the model to interpret "white background" on its own judgment. Second, the explicit instruction not to color-correct the product itself addresses a subtle but real risk in background-swap edits: a model replacing a background sometimes normalizes the whole image\'s color balance as part of the same pass, which can shift how the product\'s actual color reads — a navy product that looked slightly warm-toned under its original lighting might come out looking like a different, cooler navy against a suddenly neutral white background, which is a problem specifically because marketplace policies also penalize listings where the photographed color doesn\'t match the delivered product, so an edit that "fixes" the background but subtly changes the product\'s apparent color trades one compliance risk for another. Third, naming the specific edge-quality failure mode — a soft halo or color fringing where the old background used to be — matters because that exact artifact is the most common tell that a background was swapped rather than shot fresh, and it\'s precisely the kind of defect a marketplace\'s automated image-quality check, or a manual reviewer glancing at a listing, is trained to catch; describing it explicitly gives the model a concrete failure to actively avoid rather than leaving "clean edges" as an unstated assumption.',
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-23',
      },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on an off-white-to-pure-white background swap.',
      },
    ],
  },
  {
    slug: 'nano-banana-restore-damaged-old-photo',
    category: 'nano-banana',
    title: 'Restore and colorize a damaged old photograph without inventing detail',
    description:
      'A restoration edit that repairs physical damage and optionally colorizes an old photo, with an explicit rule against fabricating facial or clothing detail in areas too degraded to actually reconstruct — the honesty check most restoration prompts skip.',
    promptText: `You are restoring a damaged historical photograph. The goal is repair and, if requested, colorization — not creative reinterpretation. Where the original damage genuinely obscures a detail beyond confident reconstruction, say so rather than confidently inventing it.

PHOTO CONDITION
{{photo_condition_description}}.

KNOWN FACTS
{{known_facts_about_subjects}}. Use these facts to guide plausible reconstruction and colorization choices — they are the closest thing to ground truth available here, and they should override a generic guess whenever the two would conflict.

DAMAGE TO REPAIR
{{damage_specifics}}. Repair these specifically: remove creases, tears, and spotting; reconstruct genuinely missing physical areas of the photograph using the surrounding context and the known facts above; do not use the repair pass as an excuse to also sharpen, denoise, or stylize areas of the photo that were never actually damaged.

COLORIZATION
{{colorization_preference}}. If colorization is requested, base skin tones, clothing colors, and background elements on the known facts where available, and on well-documented, era-appropriate defaults where they aren't — for instance, common fabric dyes and photographic conventions of the stated time period — rather than modern color trends that wouldn't have existed when the photo was taken.

HONESTY ABOUT RECONSTRUCTION
This is the most important rule in this brief: if a face, a piece of clothing, or any detail is damaged badly enough that no confident reconstruction is possible from what remains, do not invent a plausible-looking but fabricated detail and present it as restored fact. Instead, reconstruct it as neutrally and minimally as the surrounding context actually supports, and separately list every area where you made a genuinely uncertain call, described specifically enough that the person requesting this restoration can decide whether that guess is acceptable to them.

WHAT MUST NOT CHANGE
The composition, the number and identity of people or objects present, and anything about the photo that is clearly and confidently visible in the original must be preserved exactly — restoration means repairing damage to what's there, not composing a new, cleaner-looking version of the scene.

OUTPUT USE
{{output_use}} — keep this in mind for how much visible restoration "grain" or texture should remain versus how smooth the result should look.

OUTPUT
One restored image, plus a separate, clearly labeled list of every area where a genuinely uncertain reconstruction call was made.`,
    variables: [
      {
        name: 'photo_condition_description',
        description: 'The overall condition of the photo being restored.',
        example:
          'a 1940s family portrait, black and white, with a large diagonal crease across the lower half and heavy foxing spots in both corners',
        required: true,
      },
      {
        name: 'known_facts_about_subjects',
        description:
          'Anything actually known about the people, clothing, or setting, to ground the restoration.',
        example:
          'the woman on the left wore a navy-blue wool coat, per a family letter describing this exact photo session',
        required: true,
      },
      {
        name: 'damage_specifics',
        description: 'The specific physical damage present.',
        example:
          "the crease cuts directly across one subject's torso, and foxing has partially obscured the face of the child on the right",
        required: true,
      },
      {
        name: 'colorization_preference',
        description: 'Whether to colorize, and any constraints on how.',
        example:
          'yes, colorize using period-appropriate 1940s tones — nothing that looks like a modern color grade',
        required: true,
      },
      {
        name: 'output_use',
        description: 'What the restored photo will be used for.',
        example: 'printing at roughly 8x10 inches for a family reunion display board',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'photo-restoration',
      'colorization',
      'archival',
      'image-editing',
    ],
    whyItWorks:
      "Photo restoration is one of the few image-editing tasks where a fluent, confident-looking result can be actively worse than an honest, partial one, because the entire value of a restoration to a family or archive is its claim to represent what was actually there — a model that fills a badly foxed face with a plausible but fabricated expression isn't restoring the photo, it's replacing a piece of family history with a guess dressed up as fact, and nothing about how convincing the output looks tells the requester which parts of it are real. This prompt's honesty rule targets that directly by asking for a separate, explicit list of uncertain reconstruction calls rather than trusting the model to volunteer that caveat unprompted, because an image model's default behavior under a restoration request is to produce the most visually complete and confident result it can, not to flag its own uncertainty unless it's specifically asked to track and report it. Second, weighting known facts above generic guesses when the two would conflict matters because a model with no grounding information will default to the statistically most common visual pattern for a given era or context — the most common 1940s coat color, the most typical period hairstyle — which is a reasonable fallback only in the absence of anything better, and stating that real, specific facts about these actual subjects should override that generic default is what keeps the restoration anchored to this particular photo instead of drifting toward a generic period-photo template. Third, explicitly separating damage repair from unrelated enhancement — no sharpening or stylizing of areas that were never actually damaged — closes a common overreach in AI restoration tools, where a repair pass quietly smooths skin texture, boosts contrast, or otherwise modernizes the whole image's look well beyond what damage repair required, which can make an otherwise successful restoration look subtly anachronistic or lose the authentic photographic grain that gave the original image its character in the first place.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-24',
      },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a creased and foxed 1940s family portrait.',
      },
    ],
  },
  {
    slug: 'nano-banana-merge-two-reference-photos-into-scene',
    category: 'nano-banana',
    title: 'Combine two separate photos into one believable scene',
    description:
      "Blends two independently-uploaded reference photos into a single coherent image with unified lighting and perspective — Nano Banana's signature multi-image compositing feature, briefed so the merge doesn't read as two photos stitched together.",
    promptText: `You are compositing two separately uploaded photos into one single, coherent scene, as if both subjects had actually been photographed together in the same place at the same time.

FIRST IMAGE
{{first_image_content}}. Preserve this subject's identity, proportions, and any defining details exactly as shown.

SECOND IMAGE
{{second_image_content}}. Preserve this subject's identity, proportions, and any defining details exactly as shown.

COMBINED SCENE
{{combined_scene_description}}. Decide which of the two source images' settings (if either) the combined scene should be based on, or describe a new setting entirely if neither original background fits — but be explicit about that choice rather than defaulting to whichever image happened to be uploaded first.

INTERACTION BETWEEN SUBJECTS
{{interaction_between_subjects}}. Render this interaction physically — correct relative scale between the two subjects, believable eye-line and body orientation if they're meant to be looking at or acknowledging each other, and any physical contact (a handshake, an arm around a shoulder) rendered with anatomically plausible hand and arm placement rather than overlapping shapes that don't actually connect correctly.

LIGHTING UNIFICATION
{{lighting_unification_notes}}. This is the detail that most often gives away a composite: pick one lighting scenario for the combined scene and render both subjects under it consistently — same light direction, same color temperature, same shadow hardness — even if their original source photos were lit completely differently. Do not let one subject visibly carry over their original photo's lighting into a scene where it no longer matches.

PERSPECTIVE AND SCALE
{{perspective_notes}}. Both subjects need to sit at a camera distance and angle that makes physical sense relative to each other — a subject who was originally photographed close-up next to one photographed from far away needs to be re-rendered at a consistent apparent distance for the combined shot, not simply resized to match height.

OUTPUT
One composited image where, if a viewer didn't know the two subjects came from separate source photos, nothing about the lighting, scale, or interaction would tip them off. If the two source images' lighting or perspective are too different to unify convincingly without a major style choice, name that trade-off explicitly rather than delivering a mismatched composite silently.`,
    variables: [
      {
        name: 'first_image_content',
        description: 'What the first uploaded photo shows.',
        example:
          'a headshot of a woman in a navy blazer, photographed indoors under soft, even light',
        required: true,
      },
      {
        name: 'second_image_content',
        description: 'What the second uploaded photo shows.',
        example:
          'a headshot of a man in a grey sweater, photographed outdoors under bright overcast daylight',
        required: true,
      },
      {
        name: 'combined_scene_description',
        description: 'What the merged scene should actually depict.',
        example:
          'both of them standing together in a bright, modern office lobby, as if photographed for a company leadership page',
        required: true,
      },
      {
        name: 'interaction_between_subjects',
        description: 'How the two subjects relate to each other physically in the frame.',
        example:
          'standing side by side, slightly angled toward each other, both facing the camera with a relaxed, professional posture',
        required: true,
      },
      {
        name: 'lighting_unification_notes',
        description: 'Which lighting scenario should win for the combined image.',
        example:
          'use the indoor soft even lighting from the first photo as the base — it suits an office lobby setting better than the outdoor daylight from the second',
        required: true,
      },
      {
        name: 'perspective_notes',
        description: 'How camera distance and framing should be reconciled.',
        example:
          'both should be framed at the same medium-shot distance, roughly waist-up, standing at a natural conversational distance apart',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'photo-compositing',
      'multi-image',
      'image-blending',
      'team-photos',
    ],
    whyItWorks:
      "Merging two independent reference images into one coherent output is Nano Banana's most distinctive and heavily marketed capability relative to single-image generators — it can genuinely condition on more than one uploaded photo at once rather than only accepting one reference plus a text prompt — but that capability doesn't automatically resolve conflicts between the two sources, which is why the lighting-unification instruction is the single highest-leverage part of this brief: two photos shot under different light sources, color temperatures, and shadow hardness are the most common and most visually obvious tell of a composite, more so than any scale or interaction mismatch, because human perception is unusually sensitive to inconsistent light direction even when it can't immediately articulate why an image looks fake. Second, explicitly requiring a decision about relative camera distance rather than simply resizing subjects to match height addresses a documented artifact of naive photo compositing: two people who were originally photographed at different distances from the camera have different amounts of lens perspective compression on their features, so scaling one to match the other's height without correcting for that underlying distance difference produces a subtle but real proportion mismatch that reads as \"something's off\" about the combined image even when the two subjects are technically the same height. Third, requiring anatomically plausible physical contact — a handshake or an arm around a shoulder rendered with hands and arms that actually connect at the right point, rather than overlapping silhouettes — targets a specific and common compositing failure where two independently-generated figures are placed near each other convincingly but any point of actual physical contact between them looks approximate rather than physically grounded, which is exactly the detail a viewer's eye goes to first in a photo depicting two people interacting, making it the place a merge is most likely to visibly fail if it isn't named as its own explicit requirement.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-24',
      },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on merging two differently-lit headshots into one office-lobby scene.',
      },
    ],
  },
  {
    slug: 'nano-banana-real-estate-virtual-staging',
    category: 'nano-banana',
    title: 'Virtually stage an empty room for a real-estate listing',
    description:
      'Furnishes an empty room photo to match a target buyer style while keeping every structural element — walls, windows, flooring, light fixtures — exactly as photographed, and includes the staging-disclosure note most listing platforms now require.',
    promptText: `You are virtually staging an empty room for a real-estate listing photo. The room's actual architecture must not change — only furniture, decor, and soft styling are being added.

ROOM PHOTO
{{room_photo_description}}. This is a {{room_type}}.

STRUCTURAL ELEMENTS — DO NOT ALTER
Preserve exactly as photographed: wall color and texture, flooring material and pattern, window and door positions and their trim, ceiling height and any visible fixtures (lighting, vents, outlets), and the room's actual proportions and camera angle. Added furniture must respect real scale relative to these fixed elements — a doorway of a given height is a reliable scale reference; furniture sized against it should look like it would actually fit through that door.

STAGING STYLE
Furnish this room in a style that would appeal to {{target_buyer_style}}.

FURNITURE AND DECOR
Add: {{furniture_list}}. Arrange these pieces the way a professional stager would — creating clear walking paths, showing the room's actual function clearly (a bedroom should unmistakably read as a place to sleep, not an ambiguous multi-purpose space), and avoiding overcrowding that would make the room look smaller than it actually is rather than larger.

LIGHTING
Match added furniture and decor to the room's existing light source and direction exactly as photographed — if the original photo has daylight coming through a specific window, cast consistent shadows from added furniture based on that same light, rather than lighting the new furniture as if photographed separately and pasted in.

REALISM CHECK
Every added item should look physically plausible sitting on this room's actual floor at this exact camera angle — correct perspective convergence, correct contact shadows where furniture meets floor, and no furniture floating slightly above the floor line or clipping through a wall.

DISCLOSURE NOTE
Virtually staged images are considered promotional renderings, not photographs of the property's actual condition, and most listing platforms and real-estate boards require this to be disclosed to buyers — typically with a visible "virtually staged" label on the image itself or in the listing description. Do not present the output as if it were an unstaged photograph of the room's real furnished state.

OUTPUT
One staged image with the room's real architecture untouched, plus a one-line reminder to apply the platform's required virtual-staging disclosure before this goes live on any listing.`,
    variables: [
      {
        name: 'room_photo_description',
        description: 'What the empty room photo actually shows.',
        example:
          'an empty rectangular room with light oak flooring, one large south-facing window, and a plain white wall behind where a bed would go',
        required: true,
      },
      {
        name: 'room_type',
        description: 'What kind of room this is meant to become.',
        example: 'primary bedroom',
        required: true,
      },
      {
        name: 'target_buyer_style',
        description: 'The buyer demographic and aesthetic this staging should appeal to.',
        example:
          'a young professional couple looking for a calm, modern, move-in-ready feel',
        required: true,
      },
      {
        name: 'furniture_list',
        description: 'The specific furniture and decor to add.',
        example:
          'a queen bed with a light linen headboard, two matching nightstands with simple lamps, a folded throw blanket at the foot of the bed, and a small area rug',
        required: true,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'real-estate',
      'virtual-staging',
      'interior-photography',
      'listing-photos',
    ],
    whyItWorks:
      "The scale-reference instruction — using a real, fixed architectural element like a doorway to ground added furniture's proportions — matters because virtual staging's most common failure isn't an ugly furniture choice, it's furniture rendered at a subtly wrong scale relative to the room, which either makes the space look artificially larger than it is (a real risk that can constitute a form of listing misrepresentation) or makes an otherwise good staging attempt look obviously synthetic the moment a viewer compares the bed's apparent size to the window beside it. Second, matching new furniture's lighting to the room's actual existing light source and direction rather than a generic, independently-lit render is what determines whether a staged photo reads as one coherent photograph or as furniture cut out and pasted into an empty room — a bed lit from a different angle than the room's real window light is one of the most immediately recognizable tells of low-quality virtual staging, and stating the exact light source as a hard constraint pushes the model toward the physically grounded rendering its training on real photography actually supports. Third, the disclosure requirement isn't a generic ethics add-on — it reflects an actual, current listing-platform and real-estate-board practice: virtually staged images are treated as promotional renderings rather than photographs of the property's real condition specifically because a buyer showing up expecting the furnished room they saw online, only to find an empty room, is a well-documented source of complaints and, in some markets, regulatory scrutiny of listing accuracy — building the disclosure reminder into the prompt's own output means the staging workflow doesn't quietly produce an asset that looks final and ready to publish without the labeling step it actually needs before it can legally and ethically go live.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-24',
      },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) staging an empty primary bedroom.',
      },
    ],
  },
  {
    slug: 'nano-banana-food-menu-photography',
    category: 'nano-banana',
    title: 'Shoot appetizing menu photography for a delivery app listing',
    description:
      'A food-photography brief tuned for how delivery-app thumbnails actually get judged — steam, glisten, and garnish freshness cues specified explicitly, since those are the details that separate an appetizing shot from a merely accurate one.',
    promptText: `Act as a food photographer shooting a dish for a delivery-app menu listing. The image needs to look appetizing enough to drive an order decision within the one or two seconds a scrolling user actually spends looking at it.

DISH
{{dish_description}}.

PLATING AND GARNISH
{{plating_and_garnish}}. Garnish should look freshly placed — herbs with visible texture and slight moisture, no wilting, no garnish that looks like it's been sitting for more than a minute or two under the lights.

SURFACE AND PROPS
{{surface_and_props}}. Keep props minimal and secondary — this is a shot of the dish, not a styled tablescape, so anything in frame besides the plate itself should read as supporting context, not compete for attention.

LIGHTING SETUP
{{lighting_setup}}. Food photography lives or dies on how light catches moisture and fat — render glossy sauces and glazes with a genuine specular highlight where the light source would actually catch them, not a flat, matte render that makes a sauce look dry.

CAMERA ANGLE
{{camera_angle}}. Choose the angle that best shows this specific dish's most appetizing feature — a layered dish often reads better from a slight three-quarter angle that reveals its cross-section or layers, while a flat dish like a pizza or a bowl arrangement often reads better shot closer to top-down.

FRESHNESS AND TEMPERATURE CUES
{{steam_or_freshness_cues}}. If steam is called for, render it as thin, translucent wisps rising naturally from the dish's actual hottest visible point, not a thick, uniform fog covering the whole plate — real steam from real food is wispy and uneven, not a special-effects cloud.

COLOR AND CONTRAST
Keep the dish's real colors true to what the ingredients would actually look like — don't oversaturate sauces or proteins into an unnatural color that would look like a mismatch when the food actually arrives at someone's door. A menu photo that oversells the dish's color creates the exact customer disappointment that drives poor reviews and refund requests.

WHAT TO KEEP OUT OF FRAME
No hands, no cutlery unless specifically part of the styling brief, no visible restaurant branding beyond what's naturally part of the plateware, no text overlays — this is a clean photographic asset, not a finished ad.

OUTPUT
One image, cropped and lit to work as a thumbnail-sized delivery-app listing photo — bold enough to read clearly even at a small display size, accurate enough that it matches what actually gets delivered.`,
    variables: [
      {
        name: 'dish_description',
        description:
          'The dish being photographed, with enough detail to render accurately.',
        example:
          'a stacked beef birria taco trio, cheese-crisped edges, served with a small side cup of consommé',
        required: true,
      },
      {
        name: 'plating_and_garnish',
        description: 'How the dish is plated and garnished.',
        example:
          'tacos fanned slightly on a dark slate plate, garnished with chopped white onion, cilantro, and a lime wedge',
        required: true,
      },
      {
        name: 'surface_and_props',
        description: 'The surface the plate sits on and any supporting props.',
        example:
          'a dark, slightly textured wood table, with a folded linen napkin and one small dish of extra consommé just at the edge of frame',
        required: true,
      },
      {
        name: 'lighting_setup',
        description: 'The lighting arrangement for the shot.',
        example:
          'soft window-style light from the upper left, a small reflector card to the right to keep shadows from going too dark on that side',
        required: true,
      },
      {
        name: 'camera_angle',
        description: 'The shooting angle chosen for this specific dish.',
        example:
          'a 45-degree three-quarter angle, close enough to see the cheese-crisped taco edges clearly',
        required: true,
      },
      {
        name: 'steam_or_freshness_cues',
        description: 'Any steam, moisture, or freshness cue to include.',
        example:
          'a thin wisp of steam rising from the consommé cup, since it should read as served hot',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'food-photography',
      'menu-photos',
      'delivery-apps',
      'photorealism',
    ],
    whyItWorks:
      'Delivery-app browsing behavior is genuinely different from a sit-down menu: a user scrolling a results feed spends a very short window deciding whether a thumbnail is worth tapping, which is why this brief front-loads the single most appetite-driving visual cue for the specific dish — a cross-section for a layered item, a top-down view for a bowl — rather than defaulting to one generic "food photo" angle regardless of what the dish actually is, since the angle that sells a burger and the angle that sells a poke bowl are genuinely different and a one-size-fits-all instruction leaves that choice to chance. Second, the steam-as-wisps instruction targets a specific and recognizable AI-food-photo tell: models asked for "steam rising from the food" without more guidance frequently render a thick, uniform fog effect that looks like a stock photo overlay rather than real steam, which real steam never actually looks like — it\'s uneven, thin, and rises from the specific hottest point on a dish, not blanketing the whole plate, and naming that physical behavior explicitly steers the model away from the generic effect toward the physically grounded one its real-photography training data actually supports. Third, the color-accuracy constraint exists because food photography carries a business risk generic product photography mostly doesn\'t: an oversaturated, unrealistically vibrant menu photo drives the order, but the customer compares the delivered dish to that exact photo within minutes of it arriving, and a visible color mismatch — a sauce that looked deep red in the photo but is actually a muted brown-red in reality — is a documented, specific driver of delivery-app complaints and refund requests, which is why this brief explicitly trades a small amount of visual drama for accuracy that survives the moment of actual delivery.',
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-25',
      },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a birria taco delivery-app listing shot.',
      },
    ],
  },
  {
    slug: 'nano-banana-product-mockup-on-apparel',
    category: 'nano-banana',
    title: 'Put a flat logo design onto a realistic apparel mockup',
    description:
      'Places a flat, uploaded logo or design onto a specific garment with real fabric texture, print-method finish, and body drape — the step between a finished design file and a mockup that actually looks worn or laid out for sale.',
    promptText: `You are creating a realistic apparel mockup from a flat design file. The uploaded logo or design must be applied to the garment as if it were actually printed or embroidered there — not pasted flat on top like a sticker.

DESIGN
{{logo_or_design_description}}, uploaded as a flat file.

GARMENT
{{garment_type_and_color}}.

MOCKUP FORMAT
{{model_or_flatlay_choice}}. If this is a worn mockup, the model's pose, body type, and any visible skin or hair are not the subject of this image and should look natural and unremarkable — the garment and design are what this mockup needs to sell.

PLACEMENT AND SCALE
{{placement_and_scale}}. Render the design at a size and position that matches how a real print or embroidery shop would actually place it — centered chest placement, a left-chest placement, or a full-back placement each have different conventional proportions relative to the garment, and the design shouldn't look randomly sized or positioned without regard to that convention unless a specific unconventional placement was requested.

FABRIC AND PRINT PHYSICS
{{fabric_texture_notes}}. The design needs to follow the actual garment surface: if the garment has folds, a curved seam, or is stretched across a body's chest or shoulder, the design should bend and compress with that same surface rather than floating flat and undistorted above it as if it were a separate overlay layer. Match the print method's real texture too — a screen-print sits slightly raised with a slightly matte finish, an embroidered logo has visible thread texture and a subtle raised outline, a heat-transfer vinyl print has a distinct slightly glossy, slightly rubbery sheen — pick the one that matches what was actually requested and render its texture accordingly, not a flat, textureless color fill.

SETTING
{{setting_description}}.

LIGHTING
Light the garment the way a real product-photography setup would, letting fabric folds and the design's actual surface texture catch light and shadow naturally — this is what makes a mockup look like a photograph of a real printed garment instead of a flat digital rendering with an image stamped onto it.

OUTPUT
One mockup image with the design applied convincingly to the garment's actual surface, ready to use as a listing image or a client-approval preview before an actual print run is ordered.`,
    variables: [
      {
        name: 'logo_or_design_description',
        description: 'The flat design being applied, including its colors.',
        example:
          'a two-color circular badge logo, cream and forest green, roughly 4 inches in diameter',
        required: true,
      },
      {
        name: 'garment_type_and_color',
        description: 'The garment and its color.',
        example: 'a heavyweight cotton crewneck sweatshirt in heather oatmeal',
        required: true,
      },
      {
        name: 'model_or_flatlay_choice',
        description:
          'Whether this is a worn mockup, a flat-lay, or on a mannequin/hanger.',
        example: 'worn by a model, three-quarter angle, cropped from mid-thigh up',
        required: true,
      },
      {
        name: 'placement_and_scale',
        description: 'Where on the garment the design goes and roughly how large.',
        example:
          'centered chest placement, sized to sit comfortably within the upper chest area without approaching the collar or shoulder seams',
        required: true,
      },
      {
        name: 'fabric_texture_notes',
        description: 'The print method whose texture the design should mimic.',
        example: 'screen-printed finish — slightly raised, matte, not glossy',
        required: true,
      },
      {
        name: 'setting_description',
        description: 'The background and setting for the mockup shot.',
        example:
          'a plain, softly lit studio background in warm light grey, nothing else in frame',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'apparel-mockup',
      'print-on-demand',
      'merch',
      'compositing',
    ],
    whyItWorks:
      "The instruction to make the design bend and compress with the garment's actual surface — rather than float above it undistorted — targets the single most common tell of a low-effort apparel mockup: a design that reads as a flat rectangle pasted over a photo, ignoring the fact that fabric across a chest or shoulder is a curved, folding surface, which a viewer's eye registers as fake almost instantly even if they can't articulate exactly why the mockup looks off. Second, naming the actual print method — screen-print, embroidery, heat-transfer vinyl — and describing each one's distinct real-world surface texture matters because these three methods genuinely look different in a way that affects a buyer's or client's expectations: a mockup that renders every design as a flat, textureless color fill regardless of what production method was actually planned sets an expectation the eventual physical product won't match, which is the same delivered-versus-photographed mismatch problem that shows up in food photography and product photography alike, just with a different failure mode specific to how ink or thread actually sits on fabric. Third, keeping placement and scale tied to real print-shop convention rather than an arbitrary size and position is what makes the mockup usable for its actual business purpose — a client or customer evaluating a mockup is implicitly comparing it against every other centered-chest or left-chest design they've seen, and a design placed at a genuinely unconventional size or position without that being the deliberate ask reads as unprofessional or amateur regardless of how well-rendered the fabric physics otherwise are, which is why the brief treats placement convention as its own explicit constraint rather than leaving it to whatever position looks visually balanced in isolation.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-26',
      },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a screen-print sweatshirt mockup.',
      },
    ],
  },
  {
    slug: 'nano-banana-packaging-mockup-render',
    category: 'nano-banana',
    title: 'Turn a flat label design into a photorealistic packaging mockup',
    description:
      "Wraps a flat, uploaded label or artwork file around a specific packaging shape — box, bottle, pouch, or jar — with correct material finish and light wrap distortion, for a design that hasn't gone to physical print yet.",
    promptText: `You are rendering a photorealistic packaging mockup from a flat label or artwork design. The uploaded artwork needs to wrap correctly onto the packaging's actual 3D shape, not sit as a flat sticker on top of it.

LABEL OR ARTWORK
{{label_design_description}}, uploaded as a flat design file.

PACKAGING SHAPE
{{packaging_type}}. Render the artwork wrapped realistically onto this exact shape — if the packaging is cylindrical, like a bottle or a can, the artwork's edges should show correct perspective curvature as they wrap around the visible surface, with any text or logo that crosses the wrap line curving naturally rather than staying flat.

MATERIAL AND FINISH
{{material_and_finish}}. The packaging material's real surface properties should show through: a glass bottle should show genuine transparency and refraction where the liquid inside would be visible through it, a matte cardboard box should absorb light without a glossy sheen, a glossy-laminated pouch should show a soft, realistic specular highlight where the light source catches its curved surface.

SETTING
{{setting_description}}.

LIGHTING
{{lighting_setup}}. Let the lighting reveal the packaging's actual physical form — a highlight running down the curved side of a bottle, a soft shadow where a box's edge meets the surface it's sitting on — since this dimensional lighting is what separates a "photograph of a real object" mockup from a flat design pasted onto a 3D template.

LABEL ACCURACY
Every word, logo element, and color from the uploaded artwork must render exactly as designed — this mockup exists to show a client or a print vendor precisely what the finished packaging will say and look like, so treat any text or logo on the label as fixed content to reproduce faithfully, not as a placeholder to reinterpret or simplify.

REALISM DETAILS
Where relevant to the packaging type, include small real-world details that a genuine product photo would have: a subtle fingerprint-free but not sterile-looking surface, a visible cap or closure mechanism appropriate to the packaging type, and correct proportions between label size and container size — a label that would be physically too large or too small to wrap around the stated container should be flagged rather than rendered at an impossible scale.

OUTPUT
One photorealistic packaging mockup, artwork faithfully and dimensionally wrapped onto the specified shape, suitable for client approval or a pre-print visual proof.`,
    variables: [
      {
        name: 'label_design_description',
        description: 'The flat artwork or label design being mocked up.',
        example:
          'a minimalist label with a hand-drawn botanical illustration, deep green background, cream serif logotype at the top',
        required: true,
      },
      {
        name: 'packaging_type',
        description: 'The exact packaging shape and container type.',
        example: 'a 500ml cylindrical glass bottle with a cork stopper',
        required: true,
      },
      {
        name: 'material_and_finish',
        description: 'The real material and surface finish of the packaging.',
        example: 'clear glass bottle, matte-finish paper label, natural cork stopper',
        required: true,
      },
      {
        name: 'setting_description',
        description: 'The background and setting for the mockup.',
        example:
          'standing on a pale wood shelf, softly blurred kitchen background behind it',
        required: true,
      },
      {
        name: 'lighting_setup',
        description: 'The lighting for the mockup shot.',
        example:
          "soft directional daylight from one side, creating a gentle highlight along the bottle's curved edge",
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'packaging-mockup',
      'label-design',
      'product-render',
      'branding',
    ],
    whyItWorks:
      "The instruction to render text and logo elements curving naturally as they cross a wrap line targets a specific geometric detail that flat-mockup generators frequently get wrong: a label design is created flat, but a cylindrical bottle or can genuinely distorts anything printed on it in perspective as the surface curves away from the viewer, and a mockup that keeps the artwork perfectly flat and undistorted across a visibly curved surface looks like a digital overlay rather than a photograph of a real wrapped label, which is exactly the difference between a mockup a client trusts as representative and one they discount as \"just a preview.\" Second, requiring the material's real optical properties — glass transparency and refraction, cardboard's light-absorbing matte finish, a laminated pouch's specular highlight — matters because these three materials genuinely behave differently under the same light, and a generic, material-agnostic render defaults to a flat, plastic-looking sheen regardless of what the packaging is actually made of, which undersells exactly the tactile, premium quality a lot of packaging design is trying to communicate in the first place. Third, treating the label's actual text and logo content as fixed and requiring faithful reproduction rather than creative reinterpretation is the detail that makes this genuinely useful for a real pre-print workflow rather than just a pretty render: a packaging mockup's entire business purpose is often to get sign-off from a client or a print vendor on exactly what the finished product will say and look like, and a model that subtly re-kerns text, shifts a logo's proportions, or simplifies a detail during the 3D-wrap process undermines that purpose by presenting an approval-ready image that doesn't actually match the file that will go to print.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-27',
      },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a cylindrical glass-bottle label mockup.',
      },
    ],
  },
  {
    slug: 'nano-banana-ugc-style-lifestyle-ad-photo',
    category: 'nano-banana',
    title: 'Composite a product into a natural-looking lifestyle ad photo',
    description:
      "Blends an uploaded product photo into a person-and-setting scene styled to match a specific ad register — polished lifestyle or deliberately rougher UGC-style — with the product's own packaging and proportions locked exactly as photographed.",
    promptText: `You are compositing an uploaded product photo into a lifestyle scene for use as ad creative. The product itself must render exactly as photographed — this composite exists specifically because the product's real appearance matters for ad accuracy and platform compliance.

PRODUCT
{{product_photo_description}}. Preserve its exact packaging, label text, color, and proportions — do not redesign, resize disproportionately, or alter any visible text on the product.

SCENE
{{person_and_setting_description}}.

INTERACTION WITH PRODUCT
{{interaction_with_product}}. Render the product being held, used, or placed the way a person would actually handle it — correct grip if it's being held, correct scale relative to their hand or the surface it's resting on, and a natural, unposed-looking moment rather than a stiff, catalog-style hold.

STYLE REGISTER
{{style_reference}}. This choice changes more than the color grade — a UGC-style shot should have the slightly imperfect framing, ambient (not studio) lighting, and casual composition of something shot on a phone, while a polished lifestyle shot should have deliberate composition, controlled lighting, and a more considered crop. Commit fully to whichever register was requested rather than blending the two into something that reads as neither.

LIGHTING MATCHING
{{lighting_matching_notes}}. The product must be lit consistently with the rest of the scene — if the scene has warm afternoon sun coming through a window, the product's surface should pick up that same warm light and cast a shadow in the same direction as everything else in frame, not retain the neutral studio lighting from its original product photo.

AUTHENTICITY DETAILS
If this is a UGC-style shot, include small imperfections that read as authentic rather than staged — a slightly off-center crop, a visible bit of everyday background clutter, natural (not perfectly symmetrical) framing — since an ad that looks too polished to be a real customer's photo undermines the exact trust signal UGC-style creative is meant to send.

COMPLIANCE NOTE
Since this is being produced for paid ad use, keep any implied claim about the product limited to what's shown — don't render the product in a way that implies an effect, result, or use case beyond what the product description actually supports, since ad platforms and consumer-protection rules can flag creative that visually implies an unsubstantiated claim even without a single word of text on the image.

OUTPUT
One composited image in the requested style register, with the product rendered exactly as it actually looks, ready for ad-platform upload.`,
    variables: [
      {
        name: 'product_photo_description',
        description: 'The uploaded product photo being composited in.',
        example:
          'a 12oz amber glass bottle of cold-brew coffee concentrate with a cream-and-black label',
        required: true,
      },
      {
        name: 'person_and_setting_description',
        description: 'The person and setting for the lifestyle scene.',
        example:
          'a woman in her late 20s in a sunlit kitchen, morning light, casual loungewear',
        required: true,
      },
      {
        name: 'interaction_with_product',
        description: 'How the person is physically interacting with the product.',
        example:
          'pouring the concentrate into a glass of milk over ice, mid-pour, looking down at the glass',
        required: true,
      },
      {
        name: 'style_reference',
        description: 'The overall creative register — UGC-style or polished lifestyle.',
        example:
          'UGC-style, as if shot on an iPhone for a casual product-review post, not a professional lifestyle campaign',
        required: true,
      },
      {
        name: 'lighting_matching_notes',
        description:
          "The scene's actual light source and direction the product needs to match.",
        example:
          'warm, slightly golden morning sunlight coming through a window just behind and to the left of her',
        required: true,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'ugc-ads',
      'lifestyle-photography',
      'ad-creative',
      'compositing',
    ],
    whyItWorks:
      "Explicitly naming which creative register is wanted — UGC-style versus polished lifestyle — matters more here than in most compositing tasks because these two registers succeed through opposite visual signals: UGC-style ad creative works specifically because it reads as unpolished and real, so a model that defaults toward its usual instinct to make an image look clean and professional actively undermines the format's entire purpose, which is why this brief states the imperfection requirement as a positive instruction rather than trusting the model to under-polish an image on its own initiative. Second, the lighting-matching requirement carries specific weight in this exact use case because a composited product retaining its neutral studio-photo lighting inside an otherwise warm, naturally-lit kitchen scene is the single most common tell that separates a real customer's candid photo from an obviously composited ad, and ad-savvy audiences on platforms saturated with UGC-style creative have gotten specifically attuned to spotting that particular mismatch, which is precisely why unifying the light source is treated as a hard constraint rather than a nice-to-have polish step. Third, the compliance note reflects a real and specific advertising-standards risk that's easy to miss when focused purely on visual craft: consumer-protection frameworks and ad-platform policies in multiple jurisdictions evaluate implied claims in imagery, not just written text, so a lifestyle composite that visually implies an effect or outcome the product itself doesn't support can trigger the same substantiation requirements as a written claim would — building that constraint into the creative brief itself, rather than treating it as a legal review step that happens after the image already exists, is what keeps the output usable without a late-stage rejection.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-27',
      },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a UGC-style cold-brew pouring shot.',
      },
    ],
  },
  {
    slug: 'nano-banana-professional-headshot-from-selfie',
    category: 'nano-banana',
    title: 'Turn a casual selfie into a professional headshot without losing likeness',
    description:
      'Upgrades attire, background, and lighting on an uploaded selfie for a LinkedIn-style headshot while explicitly locking facial identity — bone structure, skin texture, distinguishing features — so the result is still recognizably the same person, not a smoothed-over stand-in.',
    promptText: `You are converting a casual selfie into a professional headshot suitable for a LinkedIn profile or a company team page. The person's actual likeness must be preserved — this is a wardrobe, lighting, and background upgrade, not a face edit.

SOURCE SELFIE
{{selfie_description}}.

IDENTITY PRESERVATION — HARD CONSTRAINT
Preserve exactly: their bone structure, eye shape and color, nose and mouth shape, skin tone, any visible distinguishing features (moles, scars, freckles, asymmetries), and their actual skin texture. Do not smooth skin beyond removing genuinely temporary things like a stray flyaway hair or a piece of lint — do not slim the face, enlarge the eyes, or otherwise adjust proportions toward a generic "attractive" template. A colleague who knows this person should look at the result and immediately recognize them as the same person, not a flattering stranger who resembles them.

ATTIRE AND GROOMING
{{attire_and_grooming_changes}}. Apply only the changes listed — if grooming changes weren't requested, leave hair and any facial hair exactly as photographed.

BACKGROUND AND LIGHTING STYLE
{{background_and_lighting_style}}. Replace the selfie's typical close-range phone-camera lighting and background with this professional treatment, using the same principle as a real headshot session: soft, even, flattering light with no harsh phone-flash shadows, and a background that doesn't compete with or distract from the subject.

FRAMING
{{framing}}. Reframe to this crop and angle even if the original selfie was framed differently — a selfie's typical slightly-above, arm's-length angle is rarely the most flattering headshot angle, and adjusting the apparent camera height and distance is part of this professional upgrade, as long as the face itself, once reframed, still reads as unmistakably the same person from this new angle.

LENS CHARACTER
Selfies are typically shot on a wide phone lens at close range, which subtly distorts facial proportions — the nose appears larger and the face rounder than it would at a normal headshot-photography distance. Correct for this specific distortion as part of the reframing, restoring the person's actual proportions as they'd appear at a normal 3-5 foot headshot distance on a longer lens — this is a distortion correction, not a proportion change, and should bring the result closer to their real appearance, not further from it.

OUTPUT
One professional headshot, same person, unmistakably recognizable, dressed and lit for the setting requested — plus a one-line note flagging anything in the identity-preservation list that was genuinely difficult to render confidently from the source selfie's resolution or angle.`,
    variables: [
      {
        name: 'selfie_description',
        description: 'What the source selfie shows.',
        example:
          "a front-facing phone selfie taken at arm's length, indoor lighting, wearing a casual t-shirt, slightly looking up at the camera",
        required: true,
      },
      {
        name: 'attire_and_grooming_changes',
        description: 'What wardrobe or grooming changes to apply, if any.',
        example:
          'change the t-shirt to a simple charcoal button-down collar shirt; leave hair exactly as photographed',
        required: true,
      },
      {
        name: 'background_and_lighting_style',
        description: 'The target professional look for background and lighting.',
        example:
          'a softly blurred neutral warm-grey background, even soft studio-style lighting with no harsh shadows',
        required: true,
      },
      {
        name: 'framing',
        description: 'The target crop and camera angle for the headshot.',
        example:
          'head-and-shoulders crop, camera at eye level, straight-on angle rather than looking up',
        required: true,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'headshot',
      'linkedin',
      'portrait-editing',
      'identity-preservation',
    ],
    whyItWorks:
      "This prompt's identity-preservation list is written as a set of named, checkable features — bone structure, eye shape, specific distinguishing marks — rather than a single vague instruction like \"keep it looking like them,\" because a model asked generically to \"make a selfie more professional\" has a well-documented drift toward beautification: subtly slimming a face, enlarging eyes, or smoothing skin texture toward a generic template, all changes that individually look like reasonable polish but that compound into a result a close colleague genuinely wouldn't recognize at a glance, which defeats the entire purpose of a headshot meant to represent a real, specific person on a professional profile. Second, the lens-distortion correction is a real, physically grounded detail worth naming explicitly rather than leaving implicit: a selfie shot at arm's length on a phone's wide-angle-adjacent lens measurably distorts facial proportions — the nose reads larger and the face rounder than the same person photographed from three to five feet away on a longer focal length, which is standard headshot-photography distance — so correcting for that specific, well-understood optical effect is genuinely restoring the person's real appearance, not altering it, and framing the instruction this way keeps the correction inside the bounds of the identity-preservation rule rather than contradicting it. Third, requiring the model to flag anything it found genuinely hard to render confidently from the source photo's resolution or angle turns an otherwise silent best-effort guess into a visible signal the requester can act on — a selfie shot at a steep upward angle may not clearly show certain features from the new, more level headshot angle, and knowing that a specific detail was a lower-confidence reconstruction is far more useful than a confident-looking headshot that quietly guessed wrong on something as significant as a distinguishing facial feature.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-28',
      },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: "Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) converting an arm's-length phone selfie into a studio-style headshot.",
      },
    ],
  },
  {
    slug: 'nano-banana-storefront-signage-mockup',
    category: 'nano-banana',
    title: 'Preview a sign or logo design on an actual storefront',
    description:
      'Mounts a flat sign or logo design onto a photo of a real storefront at the correct scale, material, and mounting position — the check a business owner needs before committing to fabrication and installation.',
    promptText: `You are creating a mockup showing how a sign or logo design would look actually installed on a real storefront, before it's fabricated. The design and the storefront photo are both fixed inputs — your job is to composite them believably, not to redesign either one.

SIGN OR LOGO DESIGN
{{sign_or_logo_description}}, uploaded as a flat design file.

STOREFRONT PHOTO
{{storefront_photo_description}}. Preserve the storefront's actual architecture, materials, and existing lighting conditions exactly as photographed.

MOUNTING LOCATION AND SCALE
{{mounting_location_and_scale}}. Use the storefront's actual visible architectural features — the width of the doorway, the height of the window band, the depth of the fascia board — as real scale references so the sign renders at a size that would actually be fabricable and legally plausible for that specific mounting surface, not an arbitrarily large or small rendering that ignores the real dimensions available.

MATERIAL AND LIGHTING EFFECT
{{material_and_lighting_effect}}. Render the sign's actual material properties given the time of day specified below — an illuminated channel-letter sign should show genuine glow and a soft light spill onto the surrounding facade if this is a dusk or night scene, a painted or vinyl sign should show flat, non-illuminated color reading naturally under ambient daylight, and a dimensional metal sign should pick up real specular highlights and cast a subtle shadow onto the wall behind it consistent with the sun's position in the reference photo.

TIME OF DAY
{{time_of_day}}. This changes more than the sign's own lighting — it determines the ambient light on the whole storefront, so keep the rest of the building's existing lighting consistent with whatever time of day is specified, not mismatched to a different lighting scenario than the sign itself.

PERSPECTIVE MATCHING
The sign must sit on the mounting surface at the exact same perspective and vanishing-point angle as the storefront photo was shot from — if the photo was taken at a slight angle rather than dead-on, the sign's letters and edges need to show that same angle's foreshortening, not render as if seen perfectly straight-on while everything else in the photo is angled.

WHAT NOT TO CHANGE
Do not alter the storefront's existing architecture, other signage, window displays, or the street scene around it — this mockup is testing one new sign against a real, unmodified location, not proposing a full storefront redesign.

OUTPUT
One mockup image showing the proposed sign mounted realistically in place, at fabricable scale, under the specified lighting conditions — suitable for a client-approval conversation or an initial landlord/permit discussion before fabrication is ordered.`,
    variables: [
      {
        name: 'sign_or_logo_description',
        description: 'The flat sign or logo design being mocked up.',
        example:
          'a wordmark logo in brushed-gold dimensional letters reading "MERIDIAN COFFEE"',
        required: true,
      },
      {
        name: 'storefront_photo_description',
        description: 'What the storefront photo shows.',
        example:
          'a narrow brick storefront with a single large window and a plain fascia board above the entrance, shot straight-on from across the street',
        required: true,
      },
      {
        name: 'mounting_location_and_scale',
        description: 'Exactly where on the storefront the sign should be mounted.',
        example:
          "centered on the fascia board above the entrance, sized to fill roughly two-thirds of the fascia's width with even margin on both sides",
        required: true,
      },
      {
        name: 'material_and_lighting_effect',
        description: "The sign's real material and how it should respond to light.",
        example:
          'brushed-metal dimensional letters, non-illuminated, should show a soft metallic highlight from the sun and a subtle cast shadow onto the fascia',
        required: true,
      },
      {
        name: 'time_of_day',
        description: 'The time of day the mockup scene is set in.',
        example:
          'mid-afternoon daylight, sun coming from the upper right based on the shadows already visible in the storefront photo',
        required: true,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'signage-mockup',
      'storefront',
      'branding',
      'compositing',
    ],
    whyItWorks:
      "Grounding the sign's scale in the storefront's own visible architectural measurements — doorway width, fascia depth — rather than an arbitrary visually-balanced size matters because this specific mockup has a real downstream consequence a purely aesthetic mockup doesn't: a business owner or landlord is going to make a fabrication and, often, a permitting decision partly based on how this image looks, and a sign rendered at a size that couldn't actually be fabricated to fit the real fascia board creates expectations the physical installation can't meet, turning a helpful visualization into a source of an expensive surprise later. Second, tying the sign's lighting effect to the specified time of day, and requiring the rest of the storefront's ambient lighting to stay consistent with that same time of day, targets a subtle inconsistency that's easy to introduce when compositing a new element into an existing photo: a sign rendered with a confident dusk-time illuminated glow, mounted onto a storefront photo whose windows and shadows clearly show midday sun, reads as visually contradictory the moment someone looks closely, even if neither element is wrong in isolation. Third, the perspective-matching requirement addresses a specific compositing error that's common precisely because it's easy to overlook: a sign added to a photo shot at a slight angle needs to share that same angle's foreshortening on its own letters and edges, and a flat, straight-on rendering of the sign pasted onto an angled photo produces a mockup where the new sign looks like a sticker applied after the fact rather than an object that was actually mounted on the building when the photo was taken — which undermines the entire credibility of the mockup as a preview of a real installation rather than a rough concept sketch.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-28',
      },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a brushed-metal fascia sign mockup.',
      },
    ],
  },
  {
    slug: 'nano-banana-seasonal-background-swap-product',
    category: 'nano-banana',
    title: 'Re-theme a product photo for a new season without touching the product',
    description:
      "Swaps a product photo's background, props, and color grade to match a target season or holiday while keeping the product itself locked pixel-for-pixel — built for sellers who need a whole seasonal campaign's worth of variants from one hero shot.",
    promptText: `You are re-theming an existing product photo for a new seasonal campaign. The product must remain completely unedited — only the background, supporting props, and ambient color grade change.

BASE PRODUCT PHOTO
{{base_product_photo_description}}.

CURRENT BACKGROUND
{{current_background}}. This is being replaced entirely for the new seasonal version.

PRODUCT LOCK
{{product_lock_instructions}}. The product's exact shape, color, texture, label text, and the specific angle it's photographed from must not change in any way between the original and the re-themed version — if you place the product in front of a warmer or cooler-toned background, do not let that background color bleed into or shift the product's own true color; light the product as if it were physically present in the new setting, but keep its actual pigment and material reading identical to the original photo.

TARGET SEASON OR OCCASION
{{target_season_or_holiday}}.

PROP ADDITIONS
{{prop_additions}}. Keep any added props secondary to the product — supporting the seasonal theme without competing with or partially obscuring the product itself, and positioned so they clearly read as separate objects near the product rather than touching or overlapping it in a way that could be confused for part of the product.

LIGHTING AND COLOR GRADE
Match the new background and props to a lighting mood appropriate for the season — warmer, cozier tones for a winter-holiday theme, brighter and cooler tones for a summer theme, for instance — while keeping the product itself lit clearly enough that its true color and texture remain fully legible and undistorted by the seasonal color grade.

CONSISTENCY ACROSS A CAMPAIGN
If this re-theming is one of several seasonal variants planned from the same base photo, keep the product's exact framing, crop, and angle identical across all of them — only the environment around it should change from version to version, so the set reads as one consistent product photographed in different settings, not several different photoshoots of what happens to be a similar-looking product.

OUTPUT
One re-themed image with the product locked exactly as it was in the original photo and the new seasonal environment built around it convincingly.`,
    variables: [
      {
        name: 'base_product_photo_description',
        description: 'The original product photo being re-themed.',
        example:
          'a hand-poured soy candle in a clear glass jar with a kraft-paper label, currently shot against a plain white background',
        required: true,
      },
      {
        name: 'current_background',
        description: 'What the current background looks like.',
        example: 'plain white studio background, no props',
        required: true,
      },
      {
        name: 'product_lock_instructions',
        description:
          'An explicit restatement of what must stay identical about the product.',
        example:
          "the jar's exact shape, the label's exact text and kraft-paper color, and the candle wax's cream color must not shift at all",
        required: true,
      },
      {
        name: 'target_season_or_holiday',
        description: 'The season or occasion this version is being built for.',
        example: 'autumn/Thanksgiving',
        required: true,
      },
      {
        name: 'prop_additions',
        description: 'Supporting seasonal props to add near the product.',
        example:
          'a few scattered dried maple leaves and a small stack of cinnamon sticks, arranged loosely nearby, not touching the jar',
        required: true,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'seasonal-marketing',
      'ecommerce',
      'product-photography',
      'campaign-assets',
    ],
    whyItWorks:
      "The explicit warning against letting a new background's color temperature bleed into the product's own reading addresses a real and easy-to-miss rendering behavior: a model asked to place a product into a warmly-lit autumn scene will often, as a side effect of rendering a coherent, unified color grade for the whole image, subtly shift the product's own true color warmer too — which is exactly backwards for a seasonal-variant campaign, where the entire point is that the same product looks identical across every seasonal version and only its surroundings change, so a customer comparing the summer and winter versions of a listing shouldn't perceive a color-corrected product, they should perceive the same product in two different rooms. Second, the cross-campaign consistency instruction — locking framing, crop, and angle identical across every seasonal variant generated from the same base photo — matters because these variants are typically going to appear together across a season's worth of marketing, and even a small drift in crop or angle between the autumn and winter versions of the same product reads as inconsistent brand execution the moment two versions are placed side by side in an ad set or an email campaign, which undercuts the professional, cohesive look a seasonal campaign is supposed to project. Third, keeping added props explicitly secondary and non-overlapping with the product protects against a specific listing-accuracy risk that echoes the marketplace and food-photography cases: a prop that visually overlaps or partially obscures the product risks a customer misreading what's actually included in the purchase, so treating \"props stay clearly separate from the product\" as a hard compositional rule rather than a loose styling preference is what keeps a seasonal creative choice from accidentally becoming a customer-service problem.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-29',
      },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on an autumn-themed candle re-theme.',
      },
    ],
  },
  {
    slug: 'nano-banana-remove-unwanted-object-from-photo',
    category: 'nano-banana',
    title: "Remove an unwanted object from a photo and rebuild what's behind it",
    description:
      'A clean-removal edit that erases a specific object or person from an uploaded photo and reconstructs the space behind it using real surrounding context — floor lines, wall patterns, lighting — instead of a blurred patch.',
    promptText: `You are removing a specific unwanted object from an uploaded photo and reconstructing whatever would realistically be behind it, based on the actual surrounding context in the rest of the image.

SOURCE PHOTO
{{source_photo_description}}.

OBJECT TO REMOVE
{{object_to_remove}}. Remove this completely — no ghosting, no faint outline, no partial remnant left behind.

RECONSTRUCTION CONTEXT
{{surrounding_context_for_reconstruction}}. Use this specifically to determine what should logically fill the space — continue an existing pattern, floor line, wall texture, or background element through the removed area exactly as it would appear if the object had never been there, rather than filling the gap with a generic blurred or smoothed patch that doesn't match anything else in the photo.

LIGHTING AND SHADOW CLEANUP
{{lighting_and_shadow_notes}}. If the removed object was casting a shadow onto a nearby surface, or if it was blocking light that would otherwise be falling on the area behind it, correct for that too — the reconstructed area needs to look lit consistently with the rest of the scene, not left with an orphaned shadow that no longer has anything casting it, and not left artificially dark where removing the object should have actually let more light reach that surface.

EDGE QUALITY
Pay close attention to the boundary where the removed object used to be — any texture, pattern, or line that continues through that area (a floorboard seam, a wallpaper pattern, a horizon line) must align correctly on both sides of the removed area, not show a visible seam, warp, or mismatch where the reconstruction meets the untouched parts of the photo.

WHAT MUST NOT CHANGE
Everything else in the frame — everything not part of the removed object or the small area directly behind it — must remain exactly as it was in the original photo: same color, same lighting, same composition, same crop.

OUTPUT USE
{{output_use}} — this affects how seamless the reconstruction genuinely needs to be; flag if the specific removal requested is complex enough (a large object blocking a highly detailed or patterned background) that a fully seamless result may need one or two rounds of targeted correction rather than a single clean pass.

OUTPUT
One edited image with the object fully removed and the space behind it reconstructed to look like it was always part of the original photograph.`,
    variables: [
      {
        name: 'source_photo_description',
        description: 'What the uploaded photo shows overall.',
        example:
          'a living-room photo being prepared for a real-estate listing, patterned hardwood floor, plain painted wall',
        required: true,
      },
      {
        name: 'object_to_remove',
        description: 'The specific object or person to remove.',
        example: 'a tall pile of moving boxes stacked in the corner near the window',
        required: true,
      },
      {
        name: 'surrounding_context_for_reconstruction',
        description: 'What surrounds the object that should guide what fills the gap.',
        example:
          "the hardwood floor's plank pattern is visible on both sides of the boxes, and the wall behind them is a plain, unpatterned off-white",
        required: true,
      },
      {
        name: 'lighting_and_shadow_notes',
        description:
          'Any shadow or light-blocking effect the object was creating that needs correcting.',
        example:
          "the boxes are blocking some window light from reaching that corner of the floor — the corner should look brighter once they're removed",
        required: true,
      },
      {
        name: 'output_use',
        description: 'What the cleaned-up photo will be used for.',
        example: 'the main listing photo for this room on a real-estate platform',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'object-removal',
      'photo-cleanup',
      'retouching',
      'real-estate',
    ],
    whyItWorks:
      "Requiring the reconstruction to continue an actual visible pattern — a specific floorboard seam, a specific wallpaper repeat — rather than accepting a generic smoothed patch is what separates a genuinely convincing removal from the telltale soft blur that gives away most quick object-removal edits: real backgrounds usually have some structure (a line, a repeat, a texture direction), and a model given the specific pattern to continue through the gap can extend it correctly, while a model given only \"remove this and fill the background\" defaults to the easiest visually plausible fill, which is very often a texture-less smudge that reads as an edit the moment anyone looks closely at that exact spot. Second, the lighting-and-shadow cleanup instruction targets a failure mode that's specific to removal edits rather than additions: an object being removed was very likely interacting with the scene's light — blocking it, casting a shadow — and simply deleting the object while leaving its shadow or its light-blocking effect in place produces an image with a shadow that has nothing left to explain it, which is a subtle but real inconsistency a careful viewer notices even without being able to say exactly what looks wrong, so correcting for the object's absence has to include correcting for what its absence changes about the light, not just erasing its visible shape. Third, giving the model permission to flag when a removal is complex enough to need iterative correction — a large object obscuring a highly detailed, patterned background — rather than forcing a single confident pass matters because reconstruction difficulty genuinely scales with how much detail was hidden behind the object: removing something in front of a plain wall is a much easier reconstruction than removing something in front of an intricate patterned rug, and treating both as equally one-shot-solvable sets an unrealistic expectation that leads to accepting a subtly wrong result rather than asking for the targeted second pass the harder case actually needs.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-30',
      },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) removing a stack of moving boxes from a listing photo.',
      },
    ],
  },
  {
    slug: 'nano-banana-multi-angle-product-turnaround',
    category: 'nano-banana',
    title: 'Generate consistent alternate angles of the same product for a gallery',
    description:
      "Produces a set of additional camera angles of one specific product from a single reference photo, holding the product's exact appearance fixed while only the viewing angle changes — for listings that need a multi-image gallery from one original shoot.",
    promptText: `You are generating additional camera angles of one specific product for a listing image gallery, using the uploaded reference photo as the ground truth for exactly what this product looks like.

BASE PRODUCT PHOTO
{{base_product_photo_description}}. This is the single source of truth for the product's actual appearance — every angle you generate must show the same product with identical color, proportions, material, and any visible branding or texture detail.

TARGET ANGLES
Generate these additional views: {{target_angles_list}}. For each one, reason through what this product would actually look like from that specific angle given its true shape and proportions as shown in the base photo — don't approximate an angle by simply rotating a flat 2D image, actually reconstruct what a new physical vantage point would reveal, including features visible from the new angle that weren't visible in the original.

CONSISTENCY REQUIREMENTS
{{consistency_requirements}}. Every generated angle needs to look like it came from the same photoshoot as the base photo and as every other angle in this set — if you find yourself rendering a detail differently in one angle than how it would logically follow from the base photo (a logo's exact position, a seam's exact path, a color that shifts warmer or cooler between angles), correct it before finalizing rather than delivering an inconsistent set.

BACKGROUND AND LIGHTING MATCH
{{background_and_lighting_match}}. Keep the background treatment and the lighting setup's direction and quality identical across every angle in the set — a gallery where the lighting direction visibly shifts from one image to the next reads as several different, uncoordinated shoots rather than one coherent set, even if each individual image looks fine on its own.

USE CASE
{{use_case}} — keep this in mind for how many angles are actually useful; a small accessory might only need three angles to fully convey its shape, while a more complex product with functional details on multiple sides may genuinely need more to do its job in a listing gallery.

SELF-CHECK BEFORE DELIVERING
Before finalizing the set, compare every new angle back against the base photo's specific details — exact label text, exact proportions, exact color — and regenerate any angle where something has drifted rather than delivering a set with an inconsistency between images.

OUTPUT
The full set of requested angles, each as its own image, all traceable back to the same base product with no visible inconsistency between them.`,
    variables: [
      {
        name: 'base_product_photo_description',
        description:
          "The single reference photo establishing the product's true appearance.",
        example:
          'a wireless charging stand in matte white plastic with a rose-gold accent ring, photographed from a three-quarter front angle',
        required: true,
      },
      {
        name: 'target_angles_list',
        description: 'The specific additional angles needed.',
        example:
          'straight-on front view, direct top-down view showing the charging surface, and a rear three-quarter view showing the cable port',
        required: true,
      },
      {
        name: 'consistency_requirements',
        description: 'The specific details that must match exactly across every angle.',
        example:
          "the rose-gold accent ring's exact width and position, and the exact placement of the small status LED near the base",
        required: true,
      },
      {
        name: 'background_and_lighting_match',
        description:
          'What background and lighting setup should stay identical across the set.',
        example:
          'same seamless soft-grey background and same overhead-softbox-with-side-fill lighting as the base photo',
        required: true,
      },
      {
        name: 'use_case',
        description:
          'Where this angle set is headed and how many angles it actually needs.',
        example:
          'a five-image gallery for an online marketplace listing — front, top-down, rear, and two three-quarter angles',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'product-photography',
      'ecommerce',
      'multi-angle',
      'consistency',
    ],
    whyItWorks:
      "The instruction to reason through what a genuinely new vantage point would reveal — rather than approximate a new angle by rotating the existing flat image — targets the core technical challenge this task actually poses: a top-down view of a product photographed only from a three-quarter front angle shows real surface detail (a charging pad's texture, a previously hidden port) that simply doesn't exist anywhere in the original 2D photo, so generating that view correctly requires the model to infer the product's real 3D form from the one photo it has and extrapolate, not transform pixels that were never captured, which is a meaningfully harder and more error-prone task than a same-angle edit, and naming it explicitly sets the right expectation for how the model should approach it. Second, the self-check-before-delivering step matters specifically because multi-image consistency errors in a generated set are asymmetric in how they're noticed: a single product photo with a slightly-off detail might pass unnoticed, but a five-image gallery where the accent ring is a hair wider in one angle than another becomes obvious the moment a shopper scrolls through the set, precisely because the comparison is trivial to make when the images sit right next to each other — which is exactly the situation a single-image product shot never has to survive. Third, requiring identical background and lighting direction across the whole set, rather than treating each angle as its own independent generation, is what makes the output read as one coherent photoshoot instead of several separate renders that each happen to feature a similar product — a listing gallery's credibility partly rests on looking like it came from one real photo session, and a lighting direction that flips from one image to the next is a fast, easy-to-spot signal to a buyer that something about the listing's photos doesn't add up, even if they can't articulate the specific inconsistency.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-07-31',
      },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) generating a five-angle gallery from one base product photo.',
      },
    ],
  },
  {
    slug: 'nano-banana-poster-with-legible-text',
    category: 'nano-banana',
    title: 'Design a poster or flyer with text that actually renders legibly',
    description:
      "A poster brief that specifies exact text content and hierarchy word-for-word, built around Nano Banana's native multimodal architecture rendering in-image text more reliably than pure diffusion-based image models.",
    promptText: `Act as a graphic designer producing a finished poster or flyer. Every piece of text specified below must render exactly as written, spelled correctly, and legible at the sizes implied by the layout hierarchy — this image's success is judged on the text being readable and accurate, not just the overall visual composition.

PURPOSE
{{poster_purpose}}.

EXACT TEXT CONTENT
Render this text, verbatim, with no spelling changes, no rewording, and no omitted lines: {{exact_text_content}}. If any line is genuinely too long to fit legibly at its intended hierarchy level within the layout, say so explicitly and suggest a shorter alternative rather than silently truncating, misspelling, or rendering it illegibly small just to force it to fit.

LAYOUT AND HIERARCHY
{{layout_and_hierarchy}}. The most important line — usually the headline — should be the largest and highest-contrast text on the page; supporting details should be clearly secondary in size and weight, following a hierarchy a viewer's eye can parse in the right order at a glance, from three feet away for a flyer or from further for a poster meant to be seen from across a room.

VISUAL STYLE
{{visual_style}}.

COLOR AND TYPOGRAPHY
{{color_and_typography_notes}}. Choose a typeface style and color combination that keeps every line of text at a contrast ratio genuinely readable against its background — don't place light-colored text over a busy, similarly light-toned area of the background image, and don't let a decorative typeface choice compromise legibility for the sake of style; the text has to actually be readable, not just look like a real font style.

DIMENSIONS
{{dimensions}}.

TEXT INTEGRITY CHECK
Before finalizing, re-read every word you've rendered in the image against the exact text content specified above, character by character — check for any letter substitution, any dropped word, any spacing that's merged two words together, or any duplicated line. This step matters specifically because getting the visual style right while getting even one word wrong makes the whole poster unusable for its actual purpose.

OUTPUT
One finished poster or flyer image, with every specified line of text present, correctly spelled, and legible at its intended size within the layout — plus a note on any text you had to adjust for space and why.`,
    variables: [
      {
        name: 'poster_purpose',
        description: 'What this poster or flyer is for.',
        example:
          'a flyer for a neighborhood weekend farmers market, to be posted on community boards and shared as a social image',
        required: true,
      },
      {
        name: 'exact_text_content',
        description: 'The complete, verbatim text that must appear, in order.',
        example:
          'Headline: "RIVERSIDE FARMERS MARKET". Subhead: "Every Saturday, 8am–1pm". Body: "Local produce, fresh bread, and live music at Riverside Park." Footer: "riversidemarket.example"',
        required: true,
      },
      {
        name: 'layout_and_hierarchy',
        description: 'How the text should be arranged and sized relative to itself.',
        example:
          'headline centered near the top, large and bold; subhead directly below it, smaller; body text centered in the lower-middle area; footer small at the very bottom',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall visual and illustrative style of the poster.',
        example:
          'a warm, hand-illustrated style with a loose watercolor texture, showing a simple illustration of vegetables and bread in a basket',
        required: true,
      },
      {
        name: 'color_and_typography_notes',
        description: 'Color palette and typeface character preferences.',
        example:
          'warm earthy tones — terracotta, cream, sage green — with a friendly rounded sans-serif for the headline and a simpler serif for body text',
        required: true,
      },
      {
        name: 'dimensions',
        description: 'The target size or aspect ratio for the finished piece.',
        example: 'portrait 18x24 inch poster proportions',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'poster-design',
      'text-in-image',
      'flyer',
      'typography',
    ],
    whyItWorks:
      "Nano Banana's underlying model reads and generates text as part of the same multimodal token space it uses for images, rather than treating text-in-image rendering as a purely visual pattern to approximate the way earlier pure-diffusion image models did — which is the documented, concrete reason Gemini's image models handle in-image text more reliably than models with no native language grounding, and it's exactly why specifying exact text content verbatim, rather than a loose description of what the poster should say, gets meaningfully better spelling and word accuracy here than the same instruction would on a diffusion-only competitor. Second, the explicit permission to flag text that's too long to fit legibly, rather than silently shrinking or truncating it, matters because a poster's core job is communicating specific information — a date, a time, a URL — and a model under pressure to fit everything into a fixed layout will sometimes resolve that tension by rendering the overflow line at an illegibly small size or quietly dropping a word, either of which produces an image that looks complete at a glance but has actually failed at its one real job; asking for the conflict to be surfaced instead of hidden turns a silent failure into an actionable one. Third, the text-integrity check — re-reading every rendered word character by character against the source content — targets the single most damaging failure mode specific to AI-generated text-in-image content: a poster can be beautifully composed, perfectly on-brand, and completely unusable because one word has a dropped letter or two words have merged together, and because that kind of error is easy to miss on a quick visual scan of an otherwise polished-looking image, building a deliberate verification step into the generation instructions catches exactly the class of mistake a purely aesthetic review would sail right past.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-01',
      },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a four-line farmers-market flyer with verbatim text accuracy checked.',
      },
    ],
    relatedToolSlug: 'qr-code-generator',
  },
  {
    slug: 'nano-banana-interior-design-concept-from-room-photo',
    category: 'nano-banana',
    title:
      'Restyle a furnished room to a new design concept while keeping its architecture',
    description:
      'Re-imagines an already-furnished room in a new interior style while locking its fixed architecture — windows, layout, structural walls — so the concept stays honest about what the existing space can actually become.',
    promptText: `You are generating an interior-design concept render from a photo of an existing, furnished room. The room's fixed architecture does not change — only furnishings, materials, and decor are being reimagined.

ROOM PHOTO
{{room_photo_description}}, currently styled in {{current_style}}.

ARCHITECTURE — DO NOT ALTER
Preserve exactly as photographed: window position, size, and count; door position; ceiling height; any structural walls, columns, or built-in features; and the room's real proportions and the camera angle it was shot from. A design concept that secretly moves a window or widens the room isn't a usable concept — it's a fantasy the client can't actually build.

ELEMENTS TO PRESERVE
{{elements_to_preserve}}. Beyond the structural basics above, keep these specific existing elements in place as stated — if something isn't listed here and isn't part of the fixed architecture above, it's fair game to change as part of the restyling.

TARGET STYLE
Restyle the room's furniture, materials, color palette, and decor toward {{target_style}}. Fully commit to this style's real, specific visual vocabulary — its characteristic materials, its typical color relationships, its furniture silhouettes — rather than a generic "modern" or "cozy" treatment that could apply to any style with the label swapped.

BUDGET AND MATERIAL REALISM
{{budget_or_material_notes}}. Keep the suggested furniture and materials within a register a client could actually source and afford at this level — don't render an aspirational showroom fantasy using materials or pieces far outside what was actually asked for, since a concept render's value is in showing a genuinely achievable direction, not a mood board with no real path to execution.

LIGHTING
Keep the room's existing light source and direction — the actual window position and any visible fixed lighting — as the basis for how the new furnishings are lit, so shadows and highlights on the new furniture and finishes look consistent with light actually entering this specific room from this specific window, not a generic showroom lighting setup.

REALISM CHECK
Every new piece of furniture and every material change needs to sit correctly within the room's real, unchanged proportions — a piece of furniture that would be too large to physically fit through the preserved doorway, or a rug that doesn't actually fit the preserved floor dimensions, should be flagged rather than rendered at a scale that ignores the room's real constraints.

OUTPUT
One restyled concept image with the room's real architecture completely intact and the new style applied convincingly to everything that was actually eligible to change.`,
    variables: [
      {
        name: 'room_photo_description',
        description: 'What the current furnished room photo shows.',
        example:
          'a living room with a large south-facing window, a fireplace on the left wall, and a doorway on the right leading to a hallway',
        required: true,
      },
      {
        name: 'current_style',
        description: 'How the room is currently furnished and styled.',
        example:
          'a mismatched mix of dated furniture, heavy dark curtains, and beige walls',
        required: true,
      },
      {
        name: 'target_style',
        description: 'The specific interior design style to restyle toward.',
        example:
          'Scandinavian minimalism — light woods, white and soft grey tones, simple clean-lined furniture, minimal but warm textiles',
        required: true,
      },
      {
        name: 'elements_to_preserve',
        description:
          'Specific existing elements, beyond fixed architecture, that should stay.',
        example:
          'the fireplace and its stone surround should stay, though its mantel decor can change',
        required: true,
      },
      {
        name: 'budget_or_material_notes',
        description:
          'A realistic constraint on what materials or furniture level to suggest.',
        example:
          'mid-range, achievable with off-the-shelf furniture from a mainstream retailer, not custom-built pieces',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'interior-design',
      'room-restyling',
      'concept-render',
      'renovation',
    ],
    whyItWorks:
      'Locking the room\'s fixed architecture — window position, doorway, ceiling height, structural walls — as a hard, non-negotiable constraint addresses the specific way an interior-restyling render\'s usefulness can quietly collapse: a client evaluating a Scandinavian-style concept for their actual living room is implicitly checking whether this is achievable in their actual space, and a render that subtly widens the window or repositions the fireplace to make the new style look better isn\'t showing them their room restyled, it\'s showing them a different, better room that happens to look similar, which sets an expectation the real renovation can never deliver on. Second, the instruction to commit fully to a style\'s real, specific visual vocabulary rather than a generic version of it matters because "Scandinavian," "industrial," and "mid-century" each have concrete, well-documented material and color conventions that differ meaningfully from each other and from a generic catch-all "modern" look, and a model that defaults to safe, generic styling under a vague style label produces a render that doesn\'t actually demonstrate what the requested style would look like in this room — undermining the whole point of asking for a specific named style in the first place. Third, the budget-and-material-realism constraint targets a documented failure of AI-generated design concepts specifically: an unconstrained render often defaults toward the most visually striking, aspirational version of a style — designer pieces, custom millwork, bespoke lighting — because that reads as more impressive in isolation, but a concept render whose actual job is helping a client plan a real renovation needs to stay honest about what\'s achievable at the budget and sourcing level they actually have, or the concept becomes aspirational marketing rather than a genuinely useful planning tool.',
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-02',
      },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) restyling a dated living room toward Scandinavian minimalism.',
      },
    ],
  },
  {
    slug: 'nano-banana-sketch-to-rendered-product-concept',
    category: 'nano-banana',
    title: 'Turn a rough hand sketch into a photorealistic product render',
    description:
      "Converts a rough concept sketch into a photorealistic product render, with an explicit split between what the sketch defines literally (proportions, form, key features) and what it leaves open for interpretation (exact material, finish, color) — so the render doesn't invent detail the sketch never specified, or ignore detail it did.",
    promptText: `You are turning a rough hand sketch into a photorealistic product concept render. The sketch defines this product's form — respect what it actually shows, and use the notes below to resolve anything the sketch itself leaves ambiguous.

SKETCH
{{sketch_description}}, uploaded as a reference image.

PRODUCT CATEGORY
{{product_category}}.

WHAT THE SKETCH DEFINES LITERALLY
Treat the sketch's overall proportions, silhouette, and any clearly-drawn functional features (buttons, seams, openings, structural elements) as fixed — render these exactly as the sketch shows them, not as a loose inspiration to deviate from. If a feature in the sketch is genuinely ambiguous — a line that could be a seam or could be a shading mark — make a reasonable call and note that you made it, rather than confidently rendering a specific interpretation without flagging the ambiguity.

MATERIALS AND FINISH
{{materials_and_finish}}. The sketch almost certainly doesn't specify real material properties in enough detail to render photorealistically on its own, so use this description as the actual source of truth for how the final surfaces should look, feel, and respond to light — this is where the concept moves from a line drawing to something that reads as a real, physical object.

FIDELITY NOTES
{{fidelity_notes}}. This tells you how strictly to interpret the sketch versus where you have creative latitude — follow it precisely; a sketch marked as a rough proportion guide only should be treated more loosely than one marked as an exact form reference.

INTENDED USE CONTEXT
{{intended_use_context}}. Render the product photographed or set as appropriate for this context — a studio product shot for an investor deck reads differently than an in-use lifestyle render for a crowdfunding campaign page.

LIGHTING AND CAMERA
Light and frame this the way a real product photographer would shoot a finished prototype — clear, confident lighting that reveals the actual form and materials described above, and a camera angle that shows the product's most important features (as established by the sketch) clearly rather than from an angle that hides them.

WHAT NOT TO INVENT
Do not add functional features, buttons, ports, or design details that aren't present in the sketch and weren't described in the materials or fidelity notes — a photorealistic render that quietly adds new functionality nobody actually designed misrepresents the concept, even if it looks impressive.

OUTPUT
One photorealistic render, faithful to the sketch's actual form, using the described materials to make it read as a real object — plus a short note on any ambiguous mark in the sketch you had to interpret and how you resolved it.`,
    variables: [
      {
        name: 'sketch_description',
        description: 'What the uploaded rough sketch shows.',
        example:
          'a quick pen sketch of a handheld electric kettle with a curved spout, a side-mounted handle, and a small circular button near the base',
        required: true,
      },
      {
        name: 'product_category',
        description: 'What kind of product this is.',
        example: 'a countertop electric kettle',
        required: true,
      },
      {
        name: 'materials_and_finish',
        description: "The real materials and finish the sketch doesn't specify.",
        example:
          'body in matte cream powder-coated steel, handle in warm walnut wood, a small brushed-steel ring around the base button',
        required: true,
      },
      {
        name: 'fidelity_notes',
        description:
          "How strictly the sketch's proportions and details should be followed.",
        example:
          "treat the spout curve and handle position as exact — those are the two features the design is actually built around; the base button's exact size is a rough guide only",
        required: true,
      },
      {
        name: 'intended_use_context',
        description: 'What this render is actually for.',
        example: 'the hero image for a Kickstarter campaign page',
        required: true,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'sketch-to-render',
      'product-design',
      'concept-art',
      'prototyping',
    ],
    whyItWorks:
      "Splitting the sketch's authority explicitly — form and functional features are fixed, material and finish are open for interpretation because the sketch was never going to specify them — matters because a rough hand sketch is genuinely underspecified in exactly the dimension a photorealistic render needs most: it shows shape, not surface, and a model asked to \"photorealistically render this sketch\" without that split will either invent material choices with no guidance at all, producing a plausible but arbitrary result, or worse, treat loose pencil shading as if it specified an actual material, rendering a confident but wrong interpretation of a mark that was never meant to carry that meaning. Second, the instruction to flag genuinely ambiguous marks rather than silently picking an interpretation addresses a real risk specific to early-stage product concepts: at the sketch stage, a designer often hasn't resolved every detail themselves yet, and a render that confidently commits to one reading of an ambiguous line without saying so can accidentally become the new de facto design decision simply because it's the version that got rendered and shown to a client or investor, foreclosing a choice the designer may not have actually intended to make yet. Third, the explicit rule against inventing new functional features protects against a documented tendency in generative rendering to \"complete\" an object with plausible-looking details a sketch never asked for — an extra button, a port, a seam implying a mechanism that doesn't exist — which is a bigger problem here than it would be in ordinary product photography because this render's entire purpose is often to represent a real, unbuilt design to an investor, manufacturer, or crowdfunding backer, and a render that visually implies functionality the actual product design doesn't have is misrepresenting the product to exactly the audience whose decisions depend on an accurate concept.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-04',
      },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) rendering a hand-sketched kettle concept for a crowdfunding page.',
      },
    ],
  },
  {
    slug: 'nano-banana-social-carousel-consistent-style-set',
    category: 'nano-banana',
    title: 'Generate a matching set of carousel images that share one visual system',
    description:
      'Produces a full run of social-carousel slide images that share one deliberate color, typography, and layout system across every slide — anchored to a written style system rather than each slide being generated as an unrelated image that happens to share a topic.',
    promptText: `You are generating a full set of images for a social-media carousel post. Every slide in this set must look like it belongs to one designed system — not like separate images that happen to cover related topics.

CAROUSEL TOPIC AND SLIDE COUNT
{{carousel_topic_and_slide_count}}.

SHARED VISUAL SYSTEM
{{shared_style_description}}. This system applies identically to every slide in the set: same illustration or photographic treatment, same overall composition logic (where headline text sits, where supporting visuals sit), same visual weight and density from slide to slide, so a viewer swiping through experiences one continuous design language, not a new visual decision on every slide.

COLOR AND TYPOGRAPHY SYSTEM
{{color_and_typography_system}}. Use this exact palette and type treatment on every slide with no exceptions — if one slide's content naturally suggests a different accent color, resist that pull and stay within the defined system; visual consistency across the set matters more than any single slide's individual optimization.

PER-SLIDE CONTENT
{{per_slide_content_list}}. Render each slide's specific content within the shared system defined above — the content changes slide to slide, the visual language around it does not.

SLIDE NUMBERING AND CONTINUITY
Include a small, consistent slide-position indicator (a number, a progress dot pattern, or similar) in the same location on every slide, styled consistently with the rest of the system, so the set reads clearly as an ordered sequence rather than a disconnected group of images.

FRAMING
Render every slide at {{aspect_ratio}}, with consistent margins and safe-zone spacing across the whole set — nothing critical (headline text, key visual elements) should sit close enough to any edge that it would risk being cropped differently by different platforms' carousel viewers.

CONSISTENCY CHECK
Before finalizing the set, compare every slide against the first one you generated — check that the color palette, typography treatment, and layout logic haven't drifted by the last slide compared to the first, since a carousel where slide seven subtly departs from slide one's established system undermines the whole set's cohesion even if slide seven looks fine in isolation.

OUTPUT
The complete numbered set of slide images, each following the same visual system, ready to upload as one carousel post in order.`,
    variables: [
      {
        name: 'carousel_topic_and_slide_count',
        description: 'The topic and how many slides the carousel needs.',
        example:
          '6 slides explaining "5 signs your invoice process needs automation," plus a closing slide with a call to action',
        required: true,
      },
      {
        name: 'shared_style_description',
        description:
          'The illustration or photographic treatment and layout logic shared by every slide.',
        example:
          'flat, minimal line-art icons paired with short bold headline text at the top and a one-line supporting sentence below',
        required: true,
      },
      {
        name: 'color_and_typography_system',
        description: 'The exact palette and type treatment to hold constant.',
        example:
          'deep navy background, warm coral accent color for icons and highlights, off-white text, a bold rounded sans-serif for headlines',
        required: true,
      },
      {
        name: 'per_slide_content_list',
        description: 'What each individual slide needs to say or show.',
        example:
          '1. Title slide: "5 Signs Your Invoice Process Needs Automation." 2-6: one sign each, with a matching simple icon. 7. Closing slide: "Try it free — link in bio."',
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: 'The frame shape for every slide in the set.',
        example: '4:5, sized for Instagram carousel posts',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'social-media',
      'carousel',
      'content-design',
      'consistency',
    ],
    whyItWorks:
      "Defining the color and typography system as a fixed constraint the model must hold even when a specific slide's content \"wants\" a different accent color addresses a real tension in multi-image generation: each individual slide, generated with only its own content in mind, will tend to drift toward whatever visual choice looks best for that one slide in isolation, and across a seven-slide set that individually-optimized drift compounds into a carousel that doesn't actually look like one designed piece, which defeats the entire point of a carousel format that depends on visual continuity to keep someone swiping through it. Second, the consistency check comparing every later slide back to the first one specifically — rather than just to the general style description — matters because Nano Banana's session memory of an established visual system tends to degrade gradually rather than fail all at once, the same drift pattern that shows up in multi-scene character consistency work, so a carousel's sixth or seventh slide is the one most at risk of quietly departing from the system established on slide one, and that's precisely the failure a viewer swiping start-to-finish is most likely to actually notice, since they're comparing each new slide against the visual memory of the ones before it in real time. Third, requiring a consistent slide-position indicator styled as part of the same system, rather than treated as an afterthought, matters because a carousel's format-specific advantage over a single image is its implied sequence — a viewer expects to swipe through an ordered set — and a set of otherwise-consistent slides that lacks any visual cue about where they are in that sequence loses part of what makes the carousel format work as a content structure in the first place, even before considering the visual-consistency question at all.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-06',
      },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a seven-slide Instagram carousel set.',
      },
    ],
  },
  {
    slug: 'nano-banana-pet-costume-portrait',
    category: 'nano-banana',
    title:
      'Create a costume portrait of a specific pet without losing what makes it recognizable',
    description:
      'Composites an uploaded pet photo into a costume or scene concept while locking the specific markings, proportions, and expression that make that exact animal recognizable — so the result reads as "my actual dog" in costume, not a generic breed-template animal.',
    promptText: `You are creating a costume or themed portrait of a specific pet, using the uploaded photo as the source of truth for what this exact animal looks like. This is a costume added to a real, specific pet — not a generic illustration of their breed.

PET REFERENCE
{{pet_reference_description}}.

IDENTITY PRESERVATION
Preserve exactly: this pet's specific coat pattern and markings (not a generic version of their breed's typical coloring), their actual proportions, ear shape and set, eye color, and any distinguishing features — a particular white patch, an asymmetrical marking, a specific scar or notch. Someone who knows this pet should recognize them immediately in the result, not see a generic stock-photo animal of the same breed wearing a costume.

COSTUME OR SCENE CONCEPT
{{costume_or_scene_concept}}. Fit the costume or scene elements onto this pet's actual body proportions and posture — a costume piece should drape or sit the way it actually would on an animal this specific size and shape, not on a generic idealized version of the breed.

POSE AND EXPRESSION
{{pose_and_expression}}. Keep the pose physically natural for how this specific animal actually holds itself — if the reference photo shows a dog with a particular head tilt or ear position that's part of their normal expression, that same character should carry through into the new pose rather than defaulting to a generic, breed-stock pose.

BACKGROUND SETTING
{{background_setting}}.

LIGHTING
Light the pet and the costume or scene elements consistently — same light direction and color temperature across the whole frame, so the costume doesn't look like it was added under different lighting than the pet itself.

REALISM AND CHARM BALANCE
{{identity_preservation_notes}}. Keep the result looking like a real photograph of a real pet in costume, not an illustrated or overly stylized rendering, unless a specific illustrated style was actually requested — the whole appeal of this kind of portrait comes from it still reading as this actual animal, just dressed up.

OUTPUT
One portrait image where the pet is unmistakably the same specific animal from the reference photo, styled with the requested costume or scene, convincingly lit as one coherent photograph.`,
    variables: [
      {
        name: 'pet_reference_description',
        description: 'What the uploaded reference photo of the pet shows.',
        example:
          'a medium-sized corgi with a distinctive asymmetrical white patch over one eye and slightly larger left ear, photographed sitting, looking slightly off-camera',
        required: true,
      },
      {
        name: 'costume_or_scene_concept',
        description: 'The costume or themed scene concept to apply.',
        example:
          'a small knight costume — soft foam armor pieces and a tiny cape, sitting on a stone castle step',
        required: true,
      },
      {
        name: 'pose_and_expression',
        description: 'How the pet should be posed and what expression to aim for.',
        example:
          'sitting proudly, head slightly tilted the same way as in the reference photo, alert and slightly curious expression',
        required: true,
      },
      {
        name: 'background_setting',
        description: 'The setting or background for the portrait.',
        example: 'a softly lit stone castle courtyard, warm late-afternoon light',
        required: true,
      },
      {
        name: 'identity_preservation_notes',
        description: 'A final explicit reminder of what must not be genericized.',
        example:
          'the white eye patch and slightly larger left ear are the two features people recognize this dog by — do not smooth these into symmetrical corgi markings',
        required: false,
      },
    ],
    targetTools: ['Nano Banana (Gemini 3.1 Flash Image)', 'Gemini app'],
    tags: [
      'nano-banana',
      'gemini',
      'pet-portrait',
      'costume-portrait',
      'identity-preservation',
      'compositing',
    ],
    whyItWorks:
      "The instruction to preserve this pet's specific coat pattern and markings rather than a generic version of their breed's typical coloring targets a real and common drift in AI pet portraits: a model asked to render \"a corgi in a knight costume\" without a locking reference will often default toward the most statistically typical, idealized version of that breed's markings, which for an animal with a specific asymmetrical feature — an off-center eye patch, an oversized ear — produces a technically breed-accurate but personally wrong result, and the entire emotional value of a pet portrait for its owner rests on it being recognizably their specific, imperfect, individual animal rather than a breed-standard illustration. Second, carrying the pet's actual habitual expression and head-carriage characteristics into the new pose — rather than defaulting to a generic sit-and-look-at-camera pose — matters for the same recognition reason applied to behavior rather than appearance: a lot of what makes a specific pet feel like themselves in a photo is a characteristic head tilt or ear position that's part of how that individual animal actually carries itself, and losing that in favor of a generic, breed-stock pose is a second, separate way the result can technically be \"the right dog\" while still not feeling like their dog to the person who knows them best. Third, the realism-versus-stylization instruction matters because costume-portrait generation defaults easily toward an illustrated or overly polished look once a whimsical concept like a knight costume is introduced, and that stylization shift, however charming on its own, works against the same identity-preservation goal the rest of the brief is built around — a photorealistic treatment keeps the pet's actual markings and proportions rendered as real, specific detail, while a stylized illustration necessarily simplifies and generalizes those same features, which is exactly the trade-off this portrait is trying to avoid.",
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-08',
      },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a corgi knight-costume portrait preserving asymmetrical markings.',
      },
    ],
  },
  {
    slug: 'nano-banana-product-shot-multi-angle-hero-set',
    category: 'nano-banana',
    title: `Generate a consistent multi-angle hero shot set for one product listing with Nano Banana`,
    description: `A reusable style-lock brief for shooting several angles of the same product across separate generations so they still read as one coherent photoshoot instead of four unrelated renders.`,
    promptText: `Act as a product photographer producing one image in a multi-angle hero set for a single listing — this exact same style spec will be re-used to shoot other angles afterward in this same conversation, so nothing here should be angle-specific except the one field marked as such.

LOCKED STYLE SPEC (reuse identically across the whole set)
PRODUCT: {{product_description}}
SURFACE & BACKGROUND: {{surface_and_background}}
LIGHTING RIG: {{lighting_setup}}
Treat this spec as a contract for every image in the set — if I ask for another angle later in this conversation, hold every word above unchanged and only swap the angle instruction below.

THIS SHOT'S ANGLE
{{this_shot_angle}}. Frame it as its own independently useful hero image, not as a partial crop of a wider scene.

WHAT MUST MATCH ACROSS THE WHOLE SET, EVEN THOUGH YOU'RE ONLY MAKING ONE IMAGE NOW
Color temperature, shadow direction, surface color, and background tone must be identical to what a viewer would expect if this image sat side-by-side with the next angle in the set. Do not warm up, cool down, or re-expose this shot relative to the locked spec above just because this particular angle happens to catch more or less of the background.

FRAMING
Fill roughly {{frame_fill_percentage}} of the frame with the product, centered, with the horizon or surface line level — no tilt unless the angle itself is a deliberately dramatic one.

WHAT TO KEEP OUT OF FRAME
No hands, no second product, no props beyond the surface and background named above, no watermark-style artifacts, no text overlays.

OUTPUT
One photorealistic image — one angle of the set — styled so that regenerating this same brief later with only the angle field changed would produce a shot that convincingly belongs next to this one in a single product gallery.`,
    variables: [
      {
        name: 'product_description',
        description: `The product, including material and finish, worded exactly as it should appear in every angle of the set.`,
        example: `a stainless-steel double-wall insulated water bottle with a matte navy powder-coat finish`,
        required: true,
      },
      {
        name: 'surface_and_background',
        description: `The surface and backdrop, held constant across every shot in the set.`,
        example: `centered on a pale ash-wood plinth against a seamless soft-grey paper sweep`,
        required: true,
      },
      {
        name: 'lighting_setup',
        description: `The lighting rig, described with position and relative intensity so it can be repeated identically.`,
        example: `large overhead softbox as key, a fill card from the right at about half the key's intensity, no rim light`,
        required: true,
      },
      {
        name: 'this_shot_angle',
        description: `The specific angle for this particular generation.`,
        example: `straight-on front view at lens height, cap facing camera`,
        required: true,
      },
      {
        name: 'frame_fill_percentage',
        description: `How much of the frame the product should occupy.`,
        example: `70%`,
        required: false,
      },
    ],
    targetTools: [`Nano Banana (Gemini 3.1 Flash Image)`, `Gemini app`],
    tags: [
      `nano-banana`,
      `gemini`,
      `product-photography`,
      `ecommerce`,
      `multi-angle`,
      `consistency`,
    ],
    whyItWorks: `Nano Banana has no exposed seed parameter or style-lock control the way some diffusion tools do, so consistency across a set of separately generated angles has to be engineered entirely through the prose the model reads each time, not through a shared random state — which is exactly why this prompt separates a reusable, copy-pasteable style-spec block from the one field that's actually allowed to change between calls. Left unstructured, asking for "the same product from another angle" in a follow-up message tends to drift: the model re-imagines the lighting and surface tone slightly fresh each time rather than treating the earlier description as binding, since a conversational edit or regeneration isn't guaranteed to weight prior turns as strict constraints on new ones. Explicitly telling the model that an angle catching more or less background must not justify re-exposing or re-color-grading the shot heads off the specific failure where a three-quarter angle that reveals more backdrop comes out visibly brighter or warmer than a straight-on shot of the same product, which is a common and otherwise subtle tell that a supposed matched set was actually four independent generations. Naming the surface and lighting rig with the same level of physical specificity used in single-shot studio prompts (position, relative intensity) rather than vague adjectives is what makes the spec block genuinely reusable rather than open to reinterpretation on each regeneration — a rig described only as "good lighting" gives the model a different plausible interpretation every time it's asked to render it again.`,
    exampleOutput: `A clean, evenly lit front-angle product shot with a light natural contact shadow; running the same locked spec again with only the angle field swapped to a three-quarter view produces a visually matching companion shot, though small color-temperature drift between generations is still common enough that one follow-up nudge ("match the warmth of the first shot exactly") is often needed to fully unify a four-angle set.`,
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-08',
      },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) across a four-angle product set.`,
      },
    ],
  },
  {
    slug: 'nano-banana-ecommerce-lifestyle-in-context-shot',
    category: 'nano-banana',
    title: `Show a product being used in a real setting for an e-commerce listing's lifestyle image`,
    description: `A lifestyle-scene brief for the "shown in real life" gallery slot that comes after the clean hero shot — built to avoid the over-staged, over-polished look that makes lifestyle images read as fake.`,
    promptText: `Generate one photorealistic lifestyle image for an e-commerce listing's secondary gallery slot — this is not a studio catalog shot, it's the "shown in real life" image that sits after the clean hero photo.

THE PRODUCT
{{product_description}} — it must be the unmistakable visual focus of the frame even though it's shown in context rather than isolated on a plain backdrop.

THE SCENE
Show it {{usage_context}}. The setting should look like an ordinary, lived-in moment, not a staged studio set dressed to look casual — include the small imperfections a real space actually has (a slightly uneven throw blanket, a coffee ring on a side table, whatever genuinely fits this scene) rather than an artificially pristine environment.

WHO'S IN FRAME, IF ANYONE
{{human_presence}}. If a person is included, show only the relevant body part interacting with the product (a hand, a forearm) rather than a full face, unless full-figure lifestyle framing is explicitly requested here.

LIGHT
{{lighting_mood}}, matching the time of day and setting described above — don't default to even studio lighting just because the product needs to read clearly.

DO NOT
- Do not make the background sharper or more detailed than the product itself.
- Do not add any competitor logo, brand mark, or text anywhere in the scene besides what's printed on the product.
- Do not pose the product in a way it wouldn't physically sit or balance in real life.
- Do not oversaturate colors beyond what the described lighting would naturally produce.

OUTPUT
One image, shot like a real photograph a customer's own environment might produce, product clearly legible and still the visual anchor of the frame despite being shown in context rather than isolated.`,
    variables: [
      {
        name: 'product_description',
        description: `The product and its key visual identifiers.`,
        example: `a woven rattan storage basket with a leather carry strap`,
        required: true,
      },
      {
        name: 'usage_context',
        description: `The real-world moment or setting the product is shown in.`,
        example: `sitting at the foot of an unmade bed in a sunlit bedroom, holding a folded throw blanket and a paperback`,
        required: true,
      },
      {
        name: 'human_presence',
        description: `Whether a person appears, and how much of them is shown.`,
        example: `a hand reaching in to place a folded sweater inside, wrist and forearm only`,
        required: false,
      },
      {
        name: 'lighting_mood',
        description: `The quality and mood of light matching the scene's time of day.`,
        example: `warm late-afternoon sunlight coming in low through a side window, long soft shadows`,
        required: true,
      },
    ],
    targetTools: [`Nano Banana (Gemini 3.1 Flash Image)`, `Gemini app`],
    tags: [
      `nano-banana`,
      `gemini`,
      `ecommerce`,
      `lifestyle-photography`,
      `product-photography`,
      `listing-images`,
    ],
    whyItWorks: `Nano Banana's underlying training leans heavily on grounded, real-world photography, which means it's genuinely capable of rendering a believably lived-in scene — but left without direction it tends to average toward a generically tidy, evenly detailed result, since a broad training distribution pulls both foreground and background toward the same moderate level of polish rather than deliberately favoring one. That's the specific problem this prompt targets: explicitly stating that the background must not out-detail the product, and asking for named small imperfections rather than a pristine set, counteracts the model's default pull toward uniform tidiness and pushes the output toward the specific visual hierarchy a lifestyle photo actually needs — product sharp and central, environment authentic but secondary. Second, because Nano Banana has no negative-prompt channel, every unwanted element (a competitor logo appearing on background packaging, an oversaturated color grade) has to be ruled out as a positive instruction inside the same prose the model is reading, which is why the DO NOT list is stated directly rather than assumed. Third, restricting a human presence to a hand or forearm rather than a full figure is a deliberate hedge against a specific and well-documented failure mode: full-figure human generation introduces far more chances for anatomical or proportional error than a cropped limb does, and a lifestyle product shot rarely needs a full face in frame anyway, so narrowing what's asked for narrows what can go wrong.`,
    exampleOutput: `A warmly lit, slightly imperfect bedroom scene with the basket clearly in focus and a hand tucking a sweater inside; expect the first pass to occasionally over-tidy the background despite the instruction, in which case a follow-up like "make the throw blanket a little more rumpled, less perfectly folded" typically fixes it in one round.`,
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-09',
      },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a homeware lifestyle listing image.`,
      },
    ],
  },
  {
    slug: 'nano-banana-corporate-headshot-from-casual-selfie',
    category: 'nano-banana',
    title: `Turn a casual selfie into a professional headshot without changing the person's actual face`,
    description: `An identity-preserving edit brief for an uploaded selfie — swaps background, attire, and lighting to a studio headshot look while explicitly locking the person's real facial identity in place.`,
    promptText: `You are editing the selfie I've uploaded in this conversation into a professional headshot suitable for {{target_context}}. This is an edit of the same person, not a new person who merely resembles them — their exact facial structure, proportions, skin tone, and any distinguishing features (moles, scars, asymmetry) must be preserved in identity, even as everything around them changes.

SOURCE PHOTO
{{source_selfie_description}}

WHAT CHANGES
Replace the background with {{background_style}}, and change their clothing to {{attire_change}}. Adjust the lighting to read as a professional headshot session — soft, even, flattering key light with gentle falloff, not the harsh or uneven light a phone camera in a casual setting typically produces.

WHAT DOES NOT CHANGE
Their face shape, facial features, expression style, skin texture, hair (unless told otherwise), and apparent age must stay exactly as they are in the source photo. Do not slim, smooth, symmetrize, or idealize their face beyond what {{retouching_limits}} allows — a professional headshot should look like a great photo of this specific person on their best day, not a different, more generic-looking person.

FRAMING
Standard headshot crop — head and upper shoulders, eyes roughly on the upper third line, looking toward camera or at a natural slight angle matching the source photo's head angle if it was already close to camera-facing.

IF SOMETHING CAN'T BE DONE CLEANLY
If the source photo's angle, lighting, or resolution makes it genuinely impossible to produce a clean studio-quality result without materially altering their face to compensate, say so directly rather than delivering a subtly different-looking person and calling it done.

OUTPUT
One headshot-cropped image of the same person, professionally lit and dressed, identity fully intact.`,
    variables: [
      {
        name: 'source_selfie_description',
        description: `What the uploaded selfie shows, for context.`,
        example: `a phone selfie taken indoors under mixed overhead light, casual t-shirt, slight upward camera angle`,
        required: true,
      },
      {
        name: 'target_context',
        description: `Where the headshot will actually be used.`,
        example: `a LinkedIn profile photo and company website team page`,
        required: true,
      },
      {
        name: 'background_style',
        description: `The replacement background.`,
        example: `a softly blurred neutral charcoal-grey studio backdrop`,
        required: true,
      },
      {
        name: 'attire_change',
        description: `What they should appear to be wearing instead.`,
        example: `a dark navy blazer over a plain white collared shirt`,
        required: true,
      },
      {
        name: 'retouching_limits',
        description: `How much cosmetic smoothing is acceptable, if any.`,
        example: `light skin evenness only — keep visible pores, natural under-eye area, and any freckles exactly as they are`,
        required: false,
      },
    ],
    targetTools: [`Nano Banana (Gemini 3.1 Flash Image)`, `Gemini app`],
    tags: [
      `nano-banana`,
      `gemini`,
      `headshot`,
      `photo-editing`,
      `linkedin`,
      `portrait-retouching`,
    ],
    whyItWorks: `Nano Banana's conversational edit mode works from an uploaded reference image, but a large simultaneous change to background, lighting, and clothing gives the model more room than a small local edit does, and more room is exactly where identity drift creeps in — under a big enough scene change, an image model will sometimes quietly regenerate a face that's subtly more symmetrical, younger, or generically attractive rather than a strict edit of the one that was uploaded, because that idealized direction is what its training data skews toward for "professional headshot" as a category. Stating explicitly that this must remain the same person, not a person who merely resembles them, and naming the specific features that must stay put (moles, asymmetry, skin texture) gives the model a concrete checklist to hold onto instead of an implicit expectation it can drift away from unnoticed. The retouching-limits field matters for the same reason a photographer's retouching brief matters with a human editor: "professional headshot" alone is ambiguous between a light touch-up and a heavily smoothed beauty-retouch look, and without specifying which one is wanted the model defaults toward the more aggressively polished interpretation it's seen more often labeled that way. Finally, giving the model explicit permission to say the result can't be produced cleanly — rather than forcing a silent best-effort attempt — matters because a headshot with a subtly wrong face is worse than no output at all for this specific use case, where the entire point is that the viewer recognizes the actual person.`,
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-10',
      },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a casual-selfie-to-headshot edit.`,
      },
    ],
  },
  {
    slug: 'nano-banana-packaging-concept-physical-mockup',
    category: 'nano-banana',
    title: `Turn a flat label or box design into a photorealistic packaging concept render`,
    description: `A packaging-mockup brief that wraps flat artwork onto real package geometry with physically accurate material response, plus explicit safeguards against the garbled-text failure mode image models are prone to.`,
    promptText: `Act as a packaging designer rendering a physical concept mockup of a label or box design for internal review — the goal is a believable object sitting on a surface, not a flat mockup template with artwork pasted over it.

THE PACKAGE
{{package_type_and_dimensions}}.

THE ARTWORK APPLIED TO IT
{{label_artwork_description}}. Wrap this artwork onto the package's actual physical geometry — on a cylindrical container, the label should show the correct amount of curve and any edge-of-label distortion a real wraparound label would have; on a box, panels should fold correctly at real edges with visible, physically accurate creases.

MATERIAL AND FINISH
{{material_and_finish}}. Render the finish's real optical behavior — a matte finish should scatter light diffusely with no hard specular hotspot, a glossy or foil finish should show a distinct, correctly-angled highlight that moves with the lighting described below, not a uniform sheen painted flat across the surface.

EXACT TEXT TO RENDER
{{brand_text_content}}. Reproduce this text exactly as given, character for character — do not paraphrase it, invent alternate wording, or substitute a similar-looking brand name. If any word here is at risk of rendering illegibly at the size implied by the package, keep that specific word larger or simpler rather than let it blur into unreadable characters.

ENVIRONMENT AND LIGHTING
{{environment_and_lighting}}.

WHAT TO KEEP OUT OF FRAME
No second product, no competing packaging in frame, no invented additional text or claims beyond what's specified above, no barcode unless one was described.

OUTPUT
One photorealistic image of the physical package as a finished object, artwork correctly wrapped to its geometry, ready to drop into an internal concept-review deck.`,
    variables: [
      {
        name: 'package_type_and_dimensions',
        description: `The package's physical type and approximate proportions.`,
        example: `a 250ml cylindrical aluminum can, standard beverage-can proportions`,
        required: true,
      },
      {
        name: 'label_artwork_description',
        description: `The visual design being applied — layout, colors, and imagery.`,
        example: `a full-wrap label, deep teal background, a hand-drawn citrus illustration on the front third, thin gold rule lines top and bottom`,
        required: true,
      },
      {
        name: 'material_and_finish',
        description: `The physical material and surface finish.`,
        example: `brushed aluminum body with a matte-varnish label finish, no gloss`,
        required: true,
      },
      {
        name: 'brand_text_content',
        description: `The exact text that must appear, verbatim.`,
        example: `BRIGHTWELL — Sparkling Yuzu — Net 250ml`,
        required: true,
      },
      {
        name: 'environment_and_lighting',
        description: `Where the package sits and how it's lit.`,
        example: `standing on a pale concrete surface, soft overhead studio light with a gentle rim light from behind`,
        required: true,
      },
    ],
    targetTools: [`Nano Banana (Gemini 3.1 Flash Image)`, `Gemini app`],
    tags: [
      `nano-banana`,
      `gemini`,
      `packaging-design`,
      `product-mockup`,
      `brand-identity`,
      `concept-render`,
    ],
    whyItWorks: `Text rendering is the single most failure-prone part of any image-generation model, including Gemini-based Nano Banana — even models that handle short text reasonably well still misspell, duplicate, or garble longer strings a meaningful percentage of the time, which is exactly why this prompt isolates the exact brand text as its own labeled field with an explicit character-for-character instruction rather than folding it loosely into the general artwork description, and why it gives the model permission to prioritize legibility of specific words over strict layout fidelity when the two conflict — a slightly larger word that's still readable beats a perfectly-sized one that renders as illegible noise. Second, wrapping flat artwork onto real package geometry is a distinct failure mode from text: without an explicit instruction, models frequently render packaging labels as a flat decal sitting on top of a curved surface rather than actually respecting that surface's curvature, because pasting a flat design over an object is visually simpler than correctly distorting it — naming the specific curvature and crease behavior expected pushes the model toward the harder, correct interpretation. Third, describing the finish in terms of its actual optical behavior (diffuse scatter versus a moving specular highlight) rather than a single adjective like "shiny" matters because Nano Banana's photographic training gives it real learned behavior for how different finishes respond to light — the same reason this works in general product photography prompts — so spelling out which behavior is wanted lets it apply the right physics instead of defaulting to a generic uniform sheen.`,
    exampleOutput: `A photorealistic can render with the label correctly curved around the cylinder and the exact wording legible; on a first pass, a long secondary tagline sometimes renders slightly soft — a follow-up like "keep the tagline text sharp even if you have to enlarge it slightly" usually resolves that in one more turn.`,
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-11',
      },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a beverage-can concept render.`,
      },
    ],
  },
  {
    slug: 'nano-banana-product-mockup-flat-design-onto-object',
    category: 'nano-banana',
    title: `Place a flat design onto a realistic object mockup with proper wrap and material behavior`,
    description: `A short, direct mockup brief for putting a flat design onto a real-world object — mug, tee, phone case — so it reads as physically applied rather than a sticker pasted over a template photo.`,
    promptText: `Render one photorealistic mockup: {{object_type}} with the following design applied to it, shown as a real physical object rather than a flat sticker pasted onto a template.

1. DESIGN TO APPLY: {{design_description}} — reproduce this exactly as described, no alterations to its colors, layout, or any text it contains.
2. WHERE IT SITS: Apply the design to {{placement_area}}, wrapped and warped to match that surface's actual curvature and any folds or seams a real object of this kind has — a design on a mug should curve around the cylinder and compress slightly near the handle-side edge; a design on fabric should follow the fabric's natural drape, with any visible weave texture showing faintly through thin ink.
3. HOW THE MATERIAL BEHAVES: {{material_behavior}}.
4. WHERE IT'S SHOWN: {{scene_setting}}, lit so the object reads as a real photographed product rather than a rendered template.
5. WHAT NOT TO DO: don't leave the design perfectly flat and undistorted regardless of the surface underneath it, don't add any second design or competing branding, don't crop the object so its overall shape is unrecognizable.

OUTPUT
One image of the finished object with the design convincingly applied, suitable for a mockup gallery or a print-on-demand product listing preview.`,
    variables: [
      {
        name: 'object_type',
        description: `The object the design is being mocked up onto.`,
        example: `a ceramic coffee mug, glossy white glaze`,
        required: true,
      },
      {
        name: 'design_description',
        description: `The exact flat design being applied, including colors and any text.`,
        example: `a two-color line-art illustration of a mountain range with the word 'WANDER' in a thin serif font beneath it`,
        required: true,
      },
      {
        name: 'placement_area',
        description: `Where on the object the design sits.`,
        example: `wrapping the front-facing half of the mug, centered between the handle and the opposite side`,
        required: true,
      },
      {
        name: 'material_behavior',
        description: `How the underlying material should visually respond to the design and light.`,
        example: `the glossy glaze should show a soft reflected highlight passing across the design, not flatten it into a matte sticker`,
        required: true,
      },
      {
        name: 'scene_setting',
        description: `The backdrop and context the mockup is shown in.`,
        example: `sitting on a wooden kitchen counter beside a folded linen napkin, soft morning window light`,
        required: false,
      },
    ],
    targetTools: [`Nano Banana (Gemini 3.1 Flash Image)`, `Gemini app`],
    tags: [
      `nano-banana`,
      `gemini`,
      `product-mockup`,
      `print-on-demand`,
      `merch-design`,
      `ecommerce`,
    ],
    whyItWorks: `The default failure mode for design-onto-object mockups is the flat-sticker look: without an explicit instruction, an image model tends to composite a 2D design onto a 3D object the same way a quick Photoshop overlay would, ignoring the object's actual curvature and material response because rendering a design as if it were physically printed or dyed into the surface is a harder inference than simply placing it visually on top. Naming the specific physical deformation expected — curvature compression near a mug handle, drape and weave show-through on fabric — gives the model a concrete target instead of leaving it to default to the visually simpler flat overlay. Second, the material-behavior field exists because Nano Banana's photographic grounding means it can render a genuinely convincing reflected highlight moving across a glossy surface, but only when told that behavior is wanted; left unprompted, it will often flatten the design into a uniformly lit decal that ignores the glaze's actual glossiness entirely. Third, keeping the design-reproduction instruction strict and separate from the placement instructions matters because a model asked to "apply a design realistically" sometimes takes that as license to reinterpret the design's colors or proportions along the way, softening or shifting them toward what looks more natural on the object — stating explicitly that the design's colors, layout, and text must not change keeps creative liberty confined to the wrap and lighting, not the design content itself.`,
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-12',
      },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a mug and a t-shirt mockup.`,
      },
    ],
  },
  {
    slug: 'nano-banana-3d-product-render-cgi-hero',
    category: 'nano-banana',
    title: `Generate a clean CGI-style 3D hero render of a product for a landing page`,
    description: `A render-engine-vocabulary brief that pushes Nano Banana toward a polished, rendered-object look — ambient occlusion, material roughness, clean geometry — instead of its default pull toward photographic realism.`,
    promptText: `Act as a 3D visualization artist producing a CGI-style hero render for a landing page — not a photograph, a clean rendered object with the smooth precision of a studio 3D render.

PHASE 1 — GEOMETRY
{{product_geometry_description}}. Keep every surface, edge, and proportion clean and precise the way an actual CAD-to-render pipeline would produce them — sharp, deliberate edges where the product has them, smooth continuous curves where it doesn't, no organic photographic imperfection like dust, fingerprints, or micro-scratches unless explicitly part of the material spec below.

PHASE 2 — MATERIALS
{{material_specs}}. Render each material's roughness and reflectivity distinctly — a brushed-metal surface should scatter reflections into soft, elongated streaks rather than a mirror-sharp reflection, while a glossy plastic should show a tight, bright, well-defined highlight; do not render every material with the same generic shiny finish.

PHASE 3 — LIGHTING AND GLOBAL ILLUMINATION
{{render_style}}. Use soft, bounced ambient occlusion in every crevice and where the product meets its stage, the way real global-illumination rendering would darken contact points and corners rather than leaving every surface uniformly lit.

PHASE 4 — STAGE AND BACKGROUND
{{background_and_stage}} — a clean rendered environment, not a photographed backdrop, with a soft gradient or simple studio-style stage appropriate for a hero product render.

PHASE 5 — CAMERA AND COMPOSITION
{{angle_and_composition}}, with the product as the singular subject, generous clean space around it for landing-page text overlays if this image is later cropped or has copy placed over it.

WHAT TO AVOID
No photographic noise, no lens flare unless explicitly requested, no busy background detail competing with the product, no floating shadow disconnected from where the product actually contacts its stage.

OUTPUT
One image with the polished, precise look of a rendered 3D hero asset — the kind used on a product landing page above the fold — not a photograph of a physical object.`,
    variables: [
      {
        name: 'product_geometry_description',
        description: `The product's shape and structural detail, described precisely.`,
        example: `a wireless earbuds charging case, rounded rectangular form, a precise seam line where the lid hinges open`,
        required: true,
      },
      {
        name: 'material_specs',
        description: `Each visible material and its finish, per surface.`,
        example: `body in matte white polymer, hinge and edge trim in brushed aluminum, charging LED as a small emissive dot`,
        required: true,
      },
      {
        name: 'render_style',
        description: `The lighting/GI setup for the render.`,
        example: `a soft three-point studio light rig with a large diffuse key overhead and subtle bounce fill from below`,
        required: true,
      },
      {
        name: 'background_and_stage',
        description: `The rendered environment the product sits in or on.`,
        example: `floating slightly above a simple pale-grey rendered plane, soft radial gradient background fading to white`,
        required: true,
      },
      {
        name: 'angle_and_composition',
        description: `Camera angle and framing intent.`,
        example: `a three-quarter hero angle, slightly elevated, lid open at a natural resting angle`,
        required: true,
      },
    ],
    targetTools: [`Nano Banana (Gemini 3.1 Flash Image)`, `Gemini app`],
    tags: [`nano-banana`, `gemini`, `3d-render`, `cgi`, `product-render`, `landing-page`],
    whyItWorks: `Nano Banana's training distribution skews heavily toward grounded photography, which is a genuine strength for photorealistic product shots but works against it here: without deliberate steering, the model's default pull is back toward photographic texture and imperfection rather than the clean, precise look of an actual rendered CGI asset. This prompt counters that by borrowing the specific vocabulary of a render pipeline — ambient occlusion, roughness versus reflectivity per material, CAD-precision edges — because those terms are strongly associated in the model's training data with rendered imagery specifically, not photography, and naming them shifts the output's register in a way that a vague request for "a 3D-looking image" does not reliably do. Second, specifying material behavior per surface rather than as one overall description matters because a multi-material product rendered without that distinction tends to default toward a single generic shiny finish applied uniformly, since "product render" as a category is disproportionately represented by simple glossy hero shots in training data — explicitly contrasting brushed-metal streak reflections against tight plastic highlights forces the model to differentiate rather than flatten every surface to the same look. Third, calling out ambient occlusion at contact points directly addresses a specific and common render-prompt failure: models asked for a "clean" render often over-correct into flat, uniformly bright lighting with no contact shadow at all, which reads as an object floating unnaturally rather than a grounded, physically lit render — asking for it by its actual technical name gives the model a concrete rendering behavior to reproduce instead of an ambiguous aesthetic goal.`,
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-13',
      },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a multi-material electronics hero render.`,
      },
    ],
  },
  {
    slug: 'nano-banana-food-photography-editorial-plate',
    category: 'nano-banana',
    title: `Style and shoot an editorial food photo that makes a dish look genuinely appetizing`,
    description: `A food-styling checklist brief that grounds "make it look appetizing" in concrete, literal sensory cues — steam, glisten, torn garnish — rather than leaving that vague goal for the model to guess at.`,
    promptText: `Act as a food stylist and photographer shooting one editorial image of a finished dish for {{use_case}} — this needs to make someone hungry within a glance, not just document what the food looks like.

THE DISH
{{dish_description}}.

STYLING CHECKLIST (work through each one, don't skip)
- Freshness cues: {{garnish_and_texture_cues}} — show the specific texture detail that signals this was just plated: a glisten of oil, visible steam if the dish is hot, a torn (not perfectly sliced) herb, a slightly melting element if that fits the dish.
- Plating and props: {{plating_and_props}}. Keep props secondary to the food — nothing on the table should be sharper or more colorful than the dish itself.
- Imperfection: real plating has small, deliberate imperfections — a sauce smear inside the rim, an uneven pile, a crumb off to the side — include one or two rather than rendering the plate as a perfectly symmetrical, machine-arranged composition.

LIGHT AND MOOD
{{lighting_and_mood}}. Let the light catch the glossy or wet elements of the dish specifically (sauce, oil, glaze) since that's what reads as fresh and appetizing on camera, rather than lighting the whole plate at flat, even brightness.

ANGLE
Shoot from {{angle}} — choose whichever reveals the dish's most appetizing dimension (height and layers from a low three-quarter angle, or the full composition from directly overhead), and make sure steam, drips, or garnish placement were described with that specific angle in mind.

WHAT TO AVOID
No hands or utensils mid-action unless specifically requested, no visible brand logos on plateware, no oversaturated color grading that reads as artificial rather than genuinely fresh, no ingredients on the plate that weren't part of the dish description.

OUTPUT
One image styled and lit like an editorial food photograph — the kind that runs at the top of a recipe or restaurant menu page — where the food itself is unmistakably the most detailed, best-lit thing in frame.`,
    variables: [
      {
        name: 'dish_description',
        description: `The finished dish, including its main components.`,
        example: `a bowl of miso-glazed black cod over sesame rice, with a scattering of scallion and a lime wedge`,
        required: true,
      },
      {
        name: 'use_case',
        description: `Where the photo will actually be used.`,
        example: `the hero image at the top of an online recipe post`,
        required: true,
      },
      {
        name: 'garnish_and_texture_cues',
        description: `The specific freshness or texture detail to emphasize.`,
        example: `a light glaze glisten on the cod's surface and a thin curl of steam rising off the rice`,
        required: true,
      },
      {
        name: 'plating_and_props',
        description: `Plateware and any surrounding props.`,
        example: `a shallow matte-black ceramic bowl, a linen napkin and simple wooden chopsticks off to one side`,
        required: true,
      },
      {
        name: 'lighting_and_mood',
        description: `The lighting quality and overall mood.`,
        example: `soft, directional natural window light from one side, warm but not golden-hour orange`,
        required: true,
      },
      {
        name: 'angle',
        description: `The camera angle.`,
        example: `a low three-quarter angle, close enough to show the glaze texture`,
        required: false,
      },
    ],
    targetTools: [`Nano Banana (Gemini 3.1 Flash Image)`, `Gemini app`],
    tags: [
      `nano-banana`,
      `gemini`,
      `food-photography`,
      `editorial`,
      `recipe-content`,
      `styling`,
    ],
    whyItWorks: `"Make it look appetizing" is not something an image model can act on directly — it's a subjective aesthetic judgment, not a rendering instruction, so left at that level of abstraction Nano Banana has to guess which of many possible visual choices actually produces that effect. This prompt works by translating that vague goal into the literal, physical cues that genuinely drive appetite appeal in real food photography — a glaze's glisten, a curl of steam, a torn rather than knife-cut herb — each of which is a concrete, renderable detail the model's photographic training has actually learned to reproduce convincingly, rather than an abstract mood it has to invent a visual proxy for on its own. Second, explicitly asking for one or two small plating imperfections addresses a specific tell that separates real food photography from an obviously synthetic image: machine-perfect symmetry and uniform placement is something an image model defaults toward when optimizing for a "clean" result, but real plated food never looks that precise, so a photo that's too symmetrical reads immediately as staged or artificial rather than appetizing. Third, the instruction to keep props secondary and less detailed than the food itself matters because food photography prompts routinely lose the food to a beautifully rendered background or prop styling that the model, without direction, treats as equally important — naming the food as the mandatory sharpest and most detailed element in frame keeps the composition's hierarchy correct even when the props described are visually interesting in their own right.`,
    exampleOutput: `A warmly lit bowl of glazed fish with a faint steam wisp and a light glaze sheen catching the window light, garnish slightly asymmetric rather than perfectly centered; if the first pass renders the plating too neat, a follow-up like "loosen up the rice pile and let the glaze pool a little unevenly" typically gets it there in one more turn.`,
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-14',
      },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) on a recipe-hero-image style dish photo.`,
      },
    ],
  },
]
