import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'flux-ecommerce-product-white-background',
    category: 'flux',
    title: `Get a clean, ecommerce-ready product shot from Flux.2 with no negative prompts`,
    description: `A structured product-photography brief for Flux.2 that produces a genuinely clean, seamless studio background purely through positive description — because Flux has no negative-prompt field to simply tell it "no clutter, no props, no shadows."`,
    promptText: `PRODUCT
{{product_description}}, rendered at true-to-life proportions, every edge and surface in sharp focus, nothing cropped out of frame.

BACKGROUND
A completely seamless {{background_color}} backdrop that curves smoothly from floor into wall with no visible horizon line, no fold, no seam, and no gradient banding — the kind of infinity-curve cyclorama a real studio uses.

LIGHTING SETUP
{{lighting_setup}}. Light falls evenly across the product with a soft, wrap-around shadow directly beneath it only — no harsh specular hotspot, no blown-out highlight on any reflective surface, no colored light spill onto the backdrop.

CAMERA AND ANGLE
{{camera_angle}}, shot as if on a tethered studio camera with a macro-capable lens — the angle a professional product photographer would actually pick to make the product's single most sellable feature legible at a glance, not a generic three-quarter default.

SURFACE THE PRODUCT SITS ON
{{surface_detail}}, with a soft, physically accurate contact shadow and a subtle reflection where the product meets the surface — enough to read as real, not mirror-glossy unless the product itself is glossy.

WHAT IS ACTUALLY IN THE FRAME
Only the product described above, centered in frame, and nothing else: no hands, no packaging box, no second unit of the same product, no props, no text, no watermark, no visible studio equipment. If the product carries a printed brand mark, render exactly the mark described in {{product_description}} and nothing beyond it — no invented extra logo, no placeholder text standing in for real copy.

COLOR AND RETOUCH LEVEL
{{color_notes}}. Colors should read as true to the actual physical product, not pushed toward the warmer, more saturated grade Flux defaults to for a "pleasing" photo — a buyer comparing this listing image to the item in hand should never feel misled by the color.

SCALE AND DETAIL LEGIBILITY
The product should fill enough of the frame that its single most sellable detail — a texture, a seam, a control, a printed measurement — is still legible even when this image is shrunk down to a small listing thumbnail, not just at full resolution. If the composition leaves the product small and centered in a sea of background, that reads as a wasted crop for ecommerce use, even if it looks fine as a standalone photograph.

CHECK BEFORE FINALIZING
Confirm the seamless backdrop has not picked up a color cast from the product itself — a strongly colored or reflective product can tint a pale seamless background under real studio lighting, and if that's visible here it should read as an inconsistency to fix, not a stylistic choice. Also confirm the contact shadow sits directly beneath the product and nowhere else, since a shadow that drifts to one side reads as an inconsistent, second implied light source rather than the single key light described above.

OUTPUT
One sharply focused, evenly lit product photograph at {{aspect_ratio}}, background clean enough to upload directly to a listing or to drop a flat color fill behind with a simple threshold cut, with no further retouching pass required.`,
    variables: [
      {
        name: 'product_description',
        description: `What the product is, including material, color, and any visible branding.`,
        example: `a matte black ceramic pour-over coffee dripper with a walnut wood collar and no visible logo`,
        required: true,
      },
      {
        name: 'background_color',
        description: `The exact backdrop tone for the seamless background.`,
        example: `soft dove-grey, not pure white`,
        required: true,
      },
      {
        name: 'lighting_setup',
        description: `The lighting rig to imply, described in photographic terms.`,
        example: `a large softbox key light at 45 degrees from camera-left, a dim fill card on the right, and a small rim light behind the product to separate it from the backdrop`,
        required: true,
      },
      {
        name: 'camera_angle',
        description: `Camera height and angle relative to the product.`,
        example: `eye-level, straight-on three-quarter angle showing the spout and the wood collar together`,
        required: true,
      },
      {
        name: 'surface_detail',
        description: `What surface the product rests on.`,
        example: `a pale ash-wood tabletop, subtly out of focus at the very front edge`,
        required: true,
      },
      {
        name: 'color_notes',
        description: `Any color-fidelity or retouch guidance.`,
        example: `keep the walnut wood a warm mid-brown, not orange-shifted, and don't add extra shine to the ceramic beyond what a matte glaze would actually show`,
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: `The output aspect ratio and framing tightness for the listing platform.`,
        example: `1:1 square, product filling about 70% of frame height`,
        required: false,
      },
    ],
    targetTools: ['Flux.2', 'Flux.1 [pro]'],
    tags: [
      'flux',
      'product-photography',
      'ecommerce',
      'no-negative-prompt',
      'studio-lighting',
      'white-background',
    ],
    whyItWorks: `Flux has never exposed a negative-prompt parameter across any Flux.1 or Flux.2 variant — no --no flag, no exclusion box like Stable Diffusion's or Midjourney's. The only lever is what actually gets described, so "no clutter, no props, no second unit" has to be written as an explicit claim about what the frame contains, the way the WHAT IS ACTUALLY IN THE FRAME block does here, rather than assumed as something the model will honor from a field that does not exist — this is the single most common mistake carried over by anyone porting a Stable Diffusion or Midjourney workflow onto Flux, and it silently produces an extra prop or a second product nobody asked for.

Flux's prompt-following is strongest on verbose, concrete photographic language rather than keyword stacking, which is why naming the actual lighting rig — a softbox angle, a fill card, a rim light for separation — gives it real photographic vocabulary to reproduce instead of a vague "professional studio lighting," which Flux renders inconsistently across seeds because it has nothing specific to lock onto.

The contact-shadow and reflection instruction matters specifically for tabletop product shots because, left unguided, Flux tends toward one of two failure modes: omitting a grounding shadow entirely so the product looks pasted onto the backdrop, or rendering a mirror-bright reflection better suited to a phone-launch hero shot than a ceramic coffee dripper — naming the exact physicality wanted (soft, physically accurate, not mirror-glossy unless the product itself is) closes that gap directly.

Finally, the explicit true-to-product color instruction counters a real default bias: Flux's training distribution skews toward a warmer, more saturated "pleasing photo" grade, which is exactly wrong for a listing image meant to represent the actual product color a buyer will receive — stating the constraint out loud is the only way to override that default, since there is no separate color-accuracy toggle to flip.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.2', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: `Initial publish, verified against Flux.2 for seamless-background product shots with no negative-prompt field.`,
      },
    ],
  },
  {
    slug: 'flux-editorial-lifestyle-photograph',
    category: 'flux',
    title: `Brief Flux.2 for an editorial lifestyle photograph, steered by positive description`,
    description: `A camera-and-film-aware natural-language brief for Flux.2 that gets a genuine editorial-magazine look — because Flux has no negative-prompt field, unwanted elements have to be steered out through what you describe, not an exclusion list.`,
    promptText: `SCENE
{{scene_description}}

SUBJECT AND ACTION
{{subject_detail}}, expression and body language reading as unposed and caught mid-moment rather than looking at camera, unless the subject detail specifically calls for eye contact.

LIGHT
{{lighting_and_time_of_day}}. The light should feel like it exists in the physical world of the scene — motivated by an actual visible or implied source (a window, an overcast sky, a single practical lamp) — not a flat, shadowless studio wash.

CAMERA AND LENS
{{camera_and_lens}}, with the depth-of-field and slight optical imperfections — mild vignette, natural falloff at the edges — that lens would actually produce, not a digitally perfect, edge-to-edge sharp frame.

COLOR AND FILM LOOK
{{color_and_film_look}}. Treat this as a color-grade reference, not a literal chemical simulation — aim for the warmth, contrast curve, and grain character it implies.

COMPOSITION
{{composition_note}}. State explicitly where the empty, uncluttered part of the frame sits, since Flux otherwise tends to fill negative space with something rather than leave it genuinely quiet.

WHAT THE FRAME SHOULD NOT CONTAIN
Because there is no negative-prompt field here, say this as a positive claim about the scene instead: the frame contains only the subject and setting described above — no second person in frame, no visible brand logos anywhere, no on-camera flash, no motion blur unless the action genuinely calls for it, no text or watermark of any kind.

TEXTURE AND ATMOSPHERE
Name at least one physical, tactile detail specific to this scene — wet pavement, condensation on glass, dust in a light beam, fabric texture catching the light — since a generic "moody street scene" reads as a template Flux has rendered many times before, while a named, specific texture gives it something concrete to actually render rather than a mood to approximate. If the setting implies weather or ambient particulate (rain, fog, dust, steam), state how it interacts with the named light source specifically, not just that it's present.

WHAT A REVIEWER SHOULD CHECK
Before accepting the result, check that the subject's hands, if visible, are anatomically plausible and doing something specific rather than resting in a generic, slightly malformed way, and that the described light source is visibly the dominant one in the frame rather than a flatter ambient wash that quietly crept back in despite the LIGHT section above.

OUTPUT
A single frame that reads as a real photograph pulled from an editorial shoot, not a rendered illustration or a stock-photo composite. {{additional_notes}}`,
    variables: [
      {
        name: 'scene_description',
        description: `The location and overall atmosphere.`,
        example: `a rain-slicked city sidewalk outside a corner grocery at dusk, neon sign reflections in the wet pavement`,
        required: true,
      },
      {
        name: 'subject_detail',
        description: `Who is in frame, what they are doing, and their expression or body language.`,
        example: `a man in a charcoal wool coat pausing under an awning to check his phone, unguarded, slightly hunched against the cold`,
        required: true,
      },
      {
        name: 'lighting_and_time_of_day',
        description: `The actual light source and time of day.`,
        example: `blue-hour ambient light mixed with warm sodium streetlight glow, no direct sun`,
        required: true,
      },
      {
        name: 'camera_and_lens',
        description: `A specific camera body and lens to anchor the photographic rendering.`,
        example: `shot as if on a Leica Q3 with its fixed 28mm f/1.7 lens, shallow depth of field on the subject`,
        required: true,
      },
      {
        name: 'color_and_film_look',
        description: `The color grade or film-stock reference.`,
        example: `cool cyan-leaning shadows with warm highlight pockets, like a Cinestill 800T night shot, visible but fine grain`,
        required: false,
      },
      {
        name: 'composition_note',
        description: `Framing and explicit negative-space instructions.`,
        example: `subject placed in the left third, the wet reflective pavement occupying the lower right third left deliberately quiet and undetailed`,
        required: true,
      },
      {
        name: 'additional_notes',
        description: `Any closing exposure or stylistic note.`,
        example: `slightly underexposed rather than corrected bright, the way a real dusk exposure would come out`,
        required: false,
      },
    ],
    targetTools: ['Flux.2'],
    tags: [
      'flux',
      'editorial-photography',
      'no-negative-prompt',
      'film-look',
      'lifestyle-photography',
      'photorealism',
    ],
    whyItWorks: `Left with no negative-prompt field, "should not contain" only ever works here as a positive claim about the scene's actual contents — naming what the frame does hold (only the subject and setting) rather than what to subtract is the mechanical reason this section is phrased that way instead of as a simple exclusion list, which Flux has no field to receive.

Naming an actual, physically motivated light source matters because Flux's unguided default for a lifestyle scene trends toward flat, evenly-lit "studio wash" lighting — even ambient shadowless light is the statistically safer, more common look across its training distribution — so pointing at a real source (a window, an overcast sky, a single practical lamp) is what forces directional, motivated shadow the way editorial photography actually looks, rather than a generically pleasant but characterless exposure.

Naming a specific camera and lens, including its real optical imperfections, works for the same underlying reason: Flux's default rendering trends toward a too-clean, edge-to-edge sharp digital look, and describing a lens's actual falloff and mild vignette pulls the output toward the imperfect character genuine glass produces, rather than the flawless synthetic sharpness Flux otherwise reaches for by default.

The explicit negative-space instruction addresses a third, distinct default bias: Flux tends to fill empty compositional space with additional detail — a texture, a stray object — rather than leave it quiet, because genuinely "empty" regions are underrepresented relative to "detailed" ones in its training images. Naming exactly where the quiet part of the frame should sit is the only reliable lever for getting real compositional breathing room instead of a subconsciously busier frame than an editorial photographer would actually shoot.

Naming a specific tactile texture — condensation on glass, dust in a light beam — matters for the same reason concrete camera and lens language does: it gives Flux a describable physical phenomenon to render rather than an evocative mood word it can only approximate in a generic way, and it's specifically these small physical details, more than the overall scene description, that separate a photograph that reads as genuinely observed from one that reads as an averaged composite of every similar stock photo in its training set.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.2', date: '2026-07-24' }],
    changelog: [
      {
        date: '2026-07-24',
        note: `Initial publish, verified against Flux.2 for motivated-light editorial photography with no negative-prompt field.`,
      },
    ],
  },
  {
    slug: 'flux-social-graphic-reserved-caption-space',
    category: 'flux',
    title: `Design a scroll-stopping social graphic on Flux.2 with real reserved caption space`,
    description: `A platform-aware brief for a social campaign graphic on Flux.2 that reserves genuinely clean space for a text overlay added later in a design tool — achieved by describing the empty area explicitly, since Flux has no exclusion field to keep text or clutter out of it.`,
    promptText: `FORMAT
{{platform_format}}. Treat this as the actual canvas shape the composition will be judged against, not a loose suggestion.

SCENE AND SUBJECT
{{scene_and_subject}}

BRAND ACCENT
{{brand_color_accent}}

LIGHT AND MOOD
{{lighting_mood}}

RESERVED SPACE
Leave {{empty_space_location}} genuinely uncluttered — no secondary object, no background texture busier than a soft gradient or blur in that specific region, nothing a headline or logo overlay would visually compete with once added afterward in a design tool. Describe this region as intentionally calm, the way a magazine cover leaves quiet space around its masthead, rather than simply hoping the composition leaves a gap.

WHAT IS IN THE RESERVED AREA
Since there is no negative-prompt field to tell Flux to keep that region clear, state it as a positive fact about the scene instead: {{empty_space_location}} contains only {{empty_space_content}}, and nothing else — no hands, no secondary product, no stray object drifting into that zone, no text of any kind. Flux frequently invents garbled pseudo-text on its own if a region reads as "sign-shaped" or "label-shaped," so avoid describing that area in a way that implies lettering belongs there.

OVERALL STYLE
{{overall_style}}

CONTRAST FOR TEXT LEGIBILITY
Whatever fills the reserved region should sit at a fairly uniform brightness and a single dominant tone, not a busy mix of light and dark patches, since a designer will likely drop a solid-color or high-contrast text layer on top afterward and needs a predictable, even surface to place it against — a region that's technically empty of objects but wildly uneven in exposure is still a hard region to typeset over.

SECONDARY CROP CHECK
If this graphic might also get cropped tighter for a different placement (a square feed post pulled from a Story-format master, for instance), keep the main subject and the brand accent detail positioned so they'd survive a moderate center-crop too, not just the exact canvas stated above — describe the composition with that flexibility in mind rather than pushing every element to the very edge of the stated format.

CHECK BEFORE FINALIZING
Cover the reserved area with a plain rectangle in your head, or literally in a quick mockup, and read the rest of the composition without it — if the scene still feels complete and intentional with that region blocked out, the reserved space is working as a genuine compositional choice; if the frame suddenly feels like it's missing something without that area, the scene was likely composed around filling the whole canvas and the reserved region will fight the text placed on it later rather than support it.

OUTPUT
A single image at the exact {{platform_format}} canvas, with {{empty_space_location}} clean enough that a headline can be dropped directly on top of it in Canva, Figma, or a similar tool with no additional cropping, blurring, or darkening pass required first.`,
    variables: [
      {
        name: 'platform_format',
        description: `The exact platform canvas and crop.`,
        example: `vertical 9:16 Instagram Story/Reels cover`,
        required: true,
      },
      {
        name: 'scene_and_subject',
        description: `The scene and what is happening in it.`,
        example: `a barista's hands pulling a shot of espresso into a small ceramic cup on a marble counter, close and intimate angle`,
        required: true,
      },
      {
        name: 'brand_color_accent',
        description: `A single accent detail carrying the brand color.`,
        example: `the cup's interior glaze in the brand's signature terracotta orange, the only saturated color in an otherwise muted frame`,
        required: false,
      },
      {
        name: 'lighting_mood',
        description: `Light quality and emotional tone.`,
        example: `early-morning window light, soft and slightly cool, calm rather than energetic`,
        required: true,
      },
      {
        name: 'empty_space_location',
        description: `Exactly where the clutter-free region for text should sit.`,
        example: `the top third of the frame, above the counter line`,
        required: true,
      },
      {
        name: 'empty_space_content',
        description: `What that region should actually contain instead of literal nothing.`,
        example: `a softly out-of-focus pale wall with gentle window-light falloff, no shelving or signage visible`,
        required: true,
      },
      {
        name: 'overall_style',
        description: `The overall aesthetic reference.`,
        example: `muted, editorial café-brand aesthetic, shot on film, not glossy commercial lighting`,
        required: false,
      },
    ],
    targetTools: ['Flux.2'],
    tags: [
      'flux',
      'social-media-graphic',
      'no-negative-prompt',
      'campaign-creative',
      'reserved-space',
      'platform-aware',
    ],
    whyItWorks: `Because Flux has no negative-prompt field, "keep this area clean" only works as a positive description of what that region actually contains — a softly blurred wall, not "no clutter." An instruction to simply leave space without describing what fills it reliably gets filled with something anyway, since Flux always renders every region as some content; it has no concept of intentionally leaving pixels undetermined.

Naming the exact platform format changes Flux's framing instincts — a vertical Story crop composes differently than a square feed post — even though Flux has no --ar-style parameter at all; the canvas shape has to live in the prose as compositional information, the same way a photographer reads their sensor's aspect ratio before framing a shot, not as an instruction applied after the fact. Naming it up front avoids getting a strong square composition that then loses its subject once force-cropped to 9:16 later.

The warning against describing the reserved area in text-implying terms targets a specific, well-documented image-model failure mode shared across most diffusion and flow-matching architectures: any region that reads compositionally as "sign-shaped" or "label-shaped" gets filled with illegible, garbled pseudo-text, because the model has learned that such regions statistically contain lettering. Avoiding that framing in the prompt is the only way to prevent triggering it.

Finally, describing the reserved region as "intentionally calm" rather than simply empty gives Flux a completed target to render — a soft blurred wall is a finished compositional choice — rather than an absence it might read as unfinished and try to complete on its own initiative by adding detail, which is the more common failure when a reserved area is described only by what it lacks.

The even-brightness instruction for that same region exists because "clutter-free" and "typographically usable" are not the same standard — a region with no objects in it can still be a poor place to set text if it swings from a bright highlight to a dark shadow across the space a headline would occupy, and a designer working from the output has no way to fix uneven exposure without a separate edit, so it has to be specified as its own requirement here rather than assumed to follow automatically from "uncluttered."`,
    exampleOutput: `A vertical Story-format image with the espresso-pulling close-up occupying the lower two-thirds, and the upper third showing only a softly blurred, warm-lit pale wall — clean enough for a headline to sit directly on top with no further edit.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.2', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: `Initial publish, verified against Flux.2 for platform-format framing and reserved negative space.`,
      },
    ],
  },
  {
    slug: 'flux-kontext-keep-character-consistent-across-scenes',
    category: 'flux',
    title: `Keep a character consistent across multiple scenes with Flux.1 Kontext`,
    description: `A sequential in-context editing workflow for Flux.1 Kontext that locks a character's face, outfit, and proportions across a series of new scenes by editing forward from one reference image each time, instead of re-describing the character from scratch and getting a visibly different person every generation.`,
    promptText: `REFERENCE IMAGE
Attach {{reference_image}} as the input image for this edit. This is the character whose identity must carry forward — an identity reference, not a style reference.

WHAT MUST STAY IDENTICAL
Keep this exact character's face, {{identity_features}}, and {{outfit_description}} unchanged from the reference image. Do not redesign, restyle, or "improve" any of these — treat them as fixed facts about a real person, not a starting point to riff on.

WHAT CHANGES IN THIS EDIT
{{new_scene_and_pose}}

HOW THE CHANGE SHOULD READ
The character should look like the same photograph's subject placed into a new moment, not a new illustration of a similar-looking person — same skin tone rendering, same approximate age, same build, same hairstyle, carried forward exactly, with only the new scene and pose actually changing.

LIGHTING CONTINUITY
{{lighting_note}}. If the new scene's lighting genuinely differs from the reference — a different time of day, indoors versus outdoors — let the light on the character update to match the new environment, but the change should look like real light hitting the same person, not a different person rendered under different light.

SEQUENCE NOTE
This is edit {{edit_number}} in a sequence of scenes using the same character. Treat the reference image as ground truth for identity even if a prior edit in the sequence drifted slightly — correct back toward the original reference rather than compounding the drift forward.

FRAMING AND CROP FOR THIS SCENE
State whether this edit should keep roughly the same crop and camera distance as the reference (a close portrait staying close, a wide environmental shot staying wide) or deliberately change it for this specific new scene — Kontext will otherwise sometimes default to whichever framing was most recently generated in the sequence rather than the framing this particular new scene actually calls for, so name the intended shot type explicitly rather than leaving it implicit.

WHAT TO DO IF IDENTITY DRIFT IS VISIBLE
If, on review, the face, hairstyle, or outfit in this output has drifted noticeably from {{reference_image}}, do not accept it and build on top of the drifted version — regenerate this specific edit directly from {{reference_image}} again with the same new_scene_and_pose instruction, rather than letting an imperfect result become the new baseline for the next edit in the series.

OUTPUT
One image: the same character from {{reference_image}}, now in the scene and pose described above, with no visible seam, warping, or identity drift around the face compared to the reference.`,
    variables: [
      {
        name: 'reference_image',
        description: `The source image establishing the character's identity, usually the first generated image in the series.`,
        example: `reference_v1.png — a woman with a shoulder-length auburn bob, freckles, wearing a forest-green field jacket, generated in the first pass of this series`,
        required: true,
      },
      {
        name: 'identity_features',
        description: `The specific physical traits that must not shift between edits.`,
        example: `the freckle pattern across the nose and cheeks, and the exact shoulder-length auburn bob with a center part`,
        required: true,
      },
      {
        name: 'outfit_description',
        description: `The clothing that should carry forward unless the brief explicitly changes it.`,
        example: `the forest-green field jacket with brass buttons, worn open over a cream shirt`,
        required: true,
      },
      {
        name: 'new_scene_and_pose',
        description: `What is different in this specific edit — the new setting, action, or angle.`,
        example: `now crouched examining a trailhead map at the edge of a pine forest, three-quarter angle from camera-left, mid-morning`,
        required: true,
      },
      {
        name: 'lighting_note',
        description: `How light should behave differently in the new scene, if at all.`,
        example: `switch from the flat overcast light of the reference to dappled morning sunlight coming through pine branches`,
        required: true,
      },
      {
        name: 'edit_number',
        description: `Which edit in the sequence this is, for continuity tracking.`,
        example: `4`,
        required: false,
      },
    ],
    targetTools: ['Flux.1 Kontext [pro]', 'Flux.1 Kontext [dev]'],
    tags: [
      'flux',
      'flux-kontext',
      'character-consistency',
      'image-editing',
      'reference-image',
      'sequential-editing',
    ],
    whyItWorks: `Kontext is architecturally different from base Flux.2 text-to-image generation: it takes an actual image as input and edits it in-context rather than generating fresh from a text description alone. That means the prompt's real job is to specify what to preserve and what to change relative to that input, not to redescribe the whole scene from zero — which is exactly why WHAT MUST STAY IDENTICAL exists as its own section, distinct from WHAT CHANGES IN THIS EDIT, rather than one blended description.

Naming identity_features and outfit_description explicitly, instead of just saying "the same character," matters because Kontext — like any image model performing an edit — has a real tendency toward gradual identity drift over a sequence of edits-of-edits: a slightly different nose, a slightly lighter hair color creeping in generation over generation. Being explicit about the exact traits gives the model concrete anchors to check the new frame against, rather than a vague continuity it can only approximate.

The sequence note — correct back toward the original reference rather than compounding drift forward — targets a specific failure mode of chained edits directly: if edit 3 already drifted slightly from edit 1, and each new edit is generated from the most recent output rather than the original, small errors compound generation over generation until the character is recognizably different by edit 6 or 7. Re-anchoring explicitly to the original reference image every time, not the previous output, is the practical fix for that compounding.

The lighting-continuity instruction matters because Kontext can fail in either of two directions without it: over-preserving the original scene's flat lighting even when the new environment obviously wouldn't have it, or under-preserving in the other direction by letting the character's actual skin-tone rendering shift along with the lighting change. Separating "let the light update" from "keep the same person under it" as two distinct instructions is what prevents both failure directions at once.`,
    exampleOutput: `A sequence of four images, all recognizably the same auburn-bob character in the forest-green field jacket — one on a trailhead, one crossing a stream, one at a summit viewpoint, one setting up a tent — with no visible drift in face shape, freckle pattern, or jacket detail between them.`,
    verifiedAgainst: [
      { tool: 'Flux', version: 'Flux.1 Kontext [pro]', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: `Initial publish, verified against Flux.1 Kontext [pro] across a four-image sequential-edit test.`,
      },
    ],
  },
  {
    slug: 'flux-kontext-composite-product-photo-into-lifestyle-scene',
    category: 'flux',
    title: `Drop an existing product photo into a new lifestyle scene with Flux.1 Kontext`,
    description: `A Flux.1 Kontext edit prompt that takes a product photo you already have and places it convincingly into a brand-new lifestyle environment, preserving the exact product geometry and label instead of letting the model regenerate — and often subtly alter — the product itself.`,
    promptText: `SOURCE PRODUCT IMAGE
{{product_image}}. This exact product — its shape, proportions, label text, and color — is the fixed input; it is being relocated into a new scene, not regenerated from a description.

WHAT MUST NOT CHANGE ON THE PRODUCT
{{fixed_product_details}}. Do not redraw, re-letter, or "clean up" the label — every character of any visible text must match the source exactly, since a model asked to place a product into a new scene will sometimes quietly re-render label text as slightly different or blurred instead of preserving it pixel-for-pixel.

NEW ENVIRONMENT
{{new_scene_description}}

HOW THE PRODUCT SHOULD SIT IN THE SCENE
{{placement_and_interaction}}. The product's scale relative to the surrounding objects in the new scene must be physically plausible — {{scale_reference}} — not oversized or shrunk to fit the composition.

LIGHT MATCHING
Relight the product to match the new environment's actual light source and direction, including a correctly angled contact shadow and any color cast the ambient light would realistically throw onto the product's surface. A product lit like a studio shot dropped into an outdoor or ambient-lit scene will look pasted in, so the light has to change even though the product itself does not.

WHAT SHOULD NOT APPEAR
Because there is no negative-prompt field, state this positively: the new scene contains only the environment described above and the single product from the source image — no duplicate of the product, no second brand's product nearby, no added text or graphic overlay beyond what was already on the product's label.

REFLECTIONS AND SURROUNDING SURFACES
If the new environment includes a reflective or glossy surface near the product — a marble counter, a mirror, a wet surface — the product should actually appear in that reflection, faintly and correctly positioned, the way it would if it were physically sitting there; a glossy surface with no reflection of the object resting on it is one of the more common tells that a product was composited in rather than photographed in place.

CHECK BEFORE FINALIZING
Compare the product's edges against the new background at the pixel level in your own review: a hard, slightly too-clean cutout edge, or a thin halo of the old white background bleeding through around the product's silhouette, means the edit needs another pass rather than being accepted as-is. Also confirm the label text is still exactly legible and unchanged from {{product_image}} — a label that has become slightly blurred or re-angled during compositing defeats the entire purpose of anchoring to a real source image.

OUTPUT
One composited image where the product's geometry and label are unchanged from {{product_image}}, now lit and placed as if it were physically photographed inside the new scene, with the seam between "product" and "environment" invisible.`,
    variables: [
      {
        name: 'product_image',
        description: `The existing clean product photo being relocated into a new scene.`,
        example: `bottle_hero_v3.png — a 500ml amber glass serum bottle with a white pump cap, shot on plain white`,
        required: true,
      },
      {
        name: 'fixed_product_details',
        description: `The exact geometry, label, and text details that must be preserved pixel-for-pixel.`,
        example: `the front label reading "LUMINEUX — Vitamin C Serum, 500ml" in a thin serif font, and the brushed-gold pump cap`,
        required: true,
      },
      {
        name: 'new_scene_description',
        description: `The new lifestyle environment the product is being placed into.`,
        example: `a sunlit bathroom shelf beside a folded white towel and a small potted eucalyptus sprig, morning light through a frosted window`,
        required: true,
      },
      {
        name: 'placement_and_interaction',
        description: `Exactly how the product is positioned and whether anything interacts with it.`,
        example: `standing upright, slightly angled toward camera, resting on the marble shelf edge with nothing touching it`,
        required: true,
      },
      {
        name: 'scale_reference',
        description: `A concrete size comparison to keep proportions physically honest.`,
        example: `roughly the same height as the folded towel stack beside it`,
        required: true,
      },
    ],
    targetTools: ['Flux.1 Kontext [pro]'],
    tags: [
      'flux',
      'flux-kontext',
      'product-compositing',
      'image-editing',
      'ecommerce',
      'lifestyle-photography',
    ],
    whyItWorks: `Kontext's core capability — editing a real input image rather than generating from text — is precisely what pixel-accurate label preservation needs. Asking base Flux.2 to "generate a serum bottle with this label text" invites the model to hallucinate slightly different label wording on every single generation, since text rendering inside a fresh generation is never guaranteed letter-perfect; anchoring to an actual source image and editing around it is the only reliable way to keep real label text intact across a batch of lifestyle scenes.

The explicit relight instruction exists because Kontext preserves an input image's content faithfully by design, and that includes its original lighting unless told otherwise. A studio-lit product simply composited into a sunlit bathroom scene without a relighting instruction will look exactly like what it is — a cutout — because its shadow direction and color temperature won't match its new surroundings. Naming the specific new light source is what makes the edit read as one coherent photograph rather than a collage of two mismatched images.

The scale_reference constraint matters because compositing tasks are where image models most commonly get relative proportions wrong: nothing else in the prompt anchors how large the product should read next to the towel or the plant, and without a stated comparison, Flux will pick a size that looks compositionally pleasing in isolation rather than one that is physically correct relative to the objects actually surrounding it.

Positively stating "no duplicate of the product, no second brand's product nearby" matters more here than in a pure text-to-image brief, because compositing prompts increase the odds of an unwanted second instance appearing — the model is reasoning about "a product in a scene" as a general category it has seen many times, not about one specific, singular object it needs to keep to exactly one count.`,
    exampleOutput: `The same amber serum bottle from bottle_hero_v3.png, label text pixel-identical, now standing on a sunlit marble bathroom shelf beside a folded towel and a eucalyptus sprig, with a soft warm-toned contact shadow and a faint reflection matching the shelf's real light — no visible compositing seam.`,
    verifiedAgainst: [
      { tool: 'Flux', version: 'Flux.1 Kontext [pro]', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: `Initial publish, verified against Flux.1 Kontext [pro] for pixel-accurate label preservation during scene compositing.`,
      },
    ],
  },
  {
    slug: 'flux-fill-outpaint-extend-canvas-to-new-aspect-ratio',
    category: 'flux',
    title: `Extend a photo to a new aspect ratio with Flux.1 Fill outpainting`,
    description: `An outpainting brief for Flux.1 Fill that extends a photo's canvas into a new aspect ratio — for a banner, a vertical story, or a billboard crop — by describing what should logically continue beyond the original frame edges, rather than leaving Fill to guess at it.`,
    promptText: `SOURCE IMAGE AND MASK
{{source_image}}, with the outpaint mask covering {{extension_region}} — the new blank canvas area beyond the original frame's edges that Fill needs to generate.

WHAT THE ORIGINAL FRAME CONTAINS
{{original_frame_contents}}. This part of the image is fixed and must not be altered, recolored, or redrawn — Fill's job is only to generate the masked extension, not to touch the kept region.

WHAT SHOULD LOGICALLY CONTINUE INTO THE NEW AREA
{{extension_content}}. Describe this as a continuation of the same physical scene, not a new scene bolted on — {{continuity_details}} should carry the same light direction, the same lens perspective, and the same surface or material continuing believably past the original edge.

PERSPECTIVE AND SCALE MATCHING
The new region must obey the same vanishing points and scale established in the kept region. If a floor, horizon line, or receding surface is visible at the original edge, continue it at the same apparent rate rather than resetting perspective — a mismatched horizon is the most common visible tell that an outpaint was added rather than shot in-camera.

LIGHT AND COLOR CONTINUITY
{{light_continuity_note}}. The extended area's exposure, color temperature, and grain should match the kept region exactly at the seam, fading only if the scene itself would naturally do so — for example, deeper shadow further from a window.

WHAT SHOULD NOT APPEAR IN THE NEW AREA
Since there is no negative-prompt field, state this positively instead: the extended region contains only the continuation content described above — no new subject, no text, no logo, no object that would draw more attention than what is already in the kept frame.

IF THE EXTENSION IS LARGE
When the masked area is wide relative to the kept region — extending a tight crop into a full billboard aspect ratio, for instance — treat the far edge of the new canvas with the same discipline as the seam itself: it should still look like a continuation of one believable physical space, not a second, looser guess once it's far enough from the original photograph to feel unconstrained. State explicitly whether any variation is acceptable that far out (a slight change in what's visible on a wall, for example) or whether it must remain just as tightly matched as the area right at the seam.

CHECK BEFORE FINALIZING
Look specifically at the exact boundary line between kept and generated pixels at full resolution — a faint value or color-temperature step at that line, even a subtle one, is the most common outpainting defect and is often only visible on close inspection rather than at a quick glance, which is exactly why it's worth checking deliberately rather than assuming a generally good result means the seam is clean too.

OUTPUT
One image at the full new {{target_aspect_ratio}} canvas, with a seam between the original photograph and the generated extension that is not detectable on close inspection.`,
    variables: [
      {
        name: 'source_image',
        description: `The original photo being extended.`,
        example: `storefront_original.jpg — a 4:5 photo of a café storefront, cropped tightly around the entrance`,
        required: true,
      },
      {
        name: 'extension_region',
        description: `Where the outpaint mask sits relative to the original frame.`,
        example: `a strip added to both the left and right sides to convert the crop from 4:5 to a 16:9 banner`,
        required: true,
      },
      {
        name: 'original_frame_contents',
        description: `What the kept, unmasked part of the image already shows.`,
        example: `the café's glass double door, a chalkboard sign, and one outdoor table, all in soft midday shade`,
        required: true,
      },
      {
        name: 'extension_content',
        description: `What logically exists just outside the original crop, in the new region.`,
        example: `the same brick facade continuing on both sides, with the neighboring shop's awning edge just visible entering frame on the right`,
        required: true,
      },
      {
        name: 'continuity_details',
        description: `The specific physical details that must match or continue seamlessly.`,
        example: `the same brick course lines and mortar color, and the same pavement level and curb height`,
        required: true,
      },
      {
        name: 'light_continuity_note',
        description: `How exposure and color should behave across the seam.`,
        example: `identical soft midday shade with no direct sun anywhere in frame, matching the kept region's slightly cool color temperature`,
        required: false,
      },
      {
        name: 'target_aspect_ratio',
        description: `The final aspect ratio being produced.`,
        example: `16:9 for a website hero banner`,
        required: true,
      },
    ],
    targetTools: ['Flux.1 Fill [pro]'],
    tags: [
      'flux',
      'flux-fill',
      'outpainting',
      'aspect-ratio',
      'image-editing',
      'seamless-extension',
    ],
    whyItWorks: `Fill is a dedicated inpainting and outpainting model that only generates inside the masked region while leaving the rest of the image pixel-identical. This is architecturally different from asking base Flux.2 to "generate a wider version of this photo," which would regenerate the whole frame and very likely change details in the part you wanted kept. Naming exactly what the mask covers, and stating the kept region is fixed, matches how Fill actually operates rather than treating it like a full-image regeneration tool.

The perspective and scale-matching instruction is the highest-leverage line for outpainting specifically, because a mismatched horizon line, or a floor that subtly changes its recession rate at the seam, is the single most reliable visual tell that an extension was added after the fact. Fill has no innate guarantee of extending vanishing points correctly unless told explicitly to continue them at the same apparent rate — its default without that guidance is to generate plausible-looking content for the masked region in isolation, not necessarily geometrically continuous content with what's next to it.

Naming continuity_details concretely — the same brick course, the same mortar color — rather than a vague "continue the background," gives Fill an actual pattern to extend rather than inventing new, slightly different materials at the boundary. Repeating textures like brick or siding are exactly where an underspecified outpaint prompt tends to drift into a visibly different pattern the moment it crosses the seam.

The positive-only "what should not appear" framing matters even more for outpainting than for fresh generation, because the masked region is empty canvas with no compositional anchor yet. An underspecified extension prompt is statistically more likely to add a new subject — a person walking by, a parked car — to fill that space than a normal generation would be, since Fill is specifically optimizing to make the new region look complete on its own terms, with nothing telling it that "complete" here means "quiet."`,
    exampleOutput: `The original 4:5 café storefront photo now sitting inside a 16:9 frame, with matching brick coursing and pavement level extended on both sides and the neighboring shop's awning edge entering from the right — no visible seam at either extension boundary.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.1 Fill [pro]', date: '2026-07-21' }],
    changelog: [
      {
        date: '2026-07-21',
        note: `Initial publish, verified against Flux.1 Fill [pro] for a 4:5-to-16:9 aspect-ratio outpaint with matched perspective.`,
      },
    ],
  },
  {
    slug: 'flux-fill-inpaint-remove-or-replace-an-object',
    category: 'flux',
    title: `Remove or replace an unwanted object in a photo with Flux.1 Fill`,
    description: `A masked-inpainting prompt for Flux.1 Fill that removes a distracting object from an existing photo, or swaps it for something else, by describing precisely what should exist underneath the mask — since Fill needs a positive target to paint, not just an instruction to delete.`,
    promptText: `SOURCE IMAGE AND MASK
{{source_image}}, with the inpaint mask covering {{masked_object}} and a small buffer of the surrounding area right at its edges, so the removal doesn't leave a visible outline.

GOAL FOR THIS EDIT
{{edit_goal}}. State whether this is a clean removal — the object disappears and the background behind it is reconstructed — or a replacement, where a different object takes its place.

WHAT SHOULD EXIST UNDER THE MASK INSTEAD
{{replacement_content}}. Fill needs a positive target to generate, not just an instruction to "delete" — describe exactly what the reconstructed area should show, matching {{surrounding_context}} closely enough that a viewer who never saw the original could not tell anything had been removed.

MATERIAL AND TEXTURE CONTINUITY
{{material_continuity_note}}. If the masked area sits on a continuous surface — a wall, a floor, a tablecloth — the pattern, grain, or texture must continue across the masked region exactly as it appears just outside the mask edge, with no seam, no texture mismatch, and no sudden flatness where the removed object used to be.

LIGHTING AND SHADOW CLEANUP
{{shadow_note}}. Remove any shadow the original object cast onto the surrounding surface as part of this edit — a removed object with its shadow still present is the most common tell that something used to be there.

EDGE HANDLING
Blend the mask boundary so no hard edge, halo, or color shift is visible at the transition between the original pixels and the newly generated region, even under close inspection.

WHAT SHOULD NOT APPEAR IN THE RECONSTRUCTED AREA
Since Fill has no negative-prompt field, state this as a positive fact instead: the reconstructed area contains only the replacement content described above — no new unrelated object, no text, and no artifact resembling a distorted version of the object that was removed.

IF THE MASKED OBJECT OVERLAPS SOMETHING IMPORTANT
If {{masked_object}} partially overlaps or is in front of something that must be reconstructed accurately — part of a person's arm, a specific architectural line, another object's edge — describe what that occluded content should logically look like once revealed, the same way you would for the background generally, rather than leaving Fill to invent it freely; a person's arm reconstructed at a slightly wrong angle is a much more noticeable error than a slightly generic patch of sand.

CHECK BEFORE FINALIZING
Zoom into the mask boundary at full resolution and check specifically for a faint double-edge or a slight warp in any straight line that crosses it (a horizon, a wall edge, a piece of furniture's silhouette) — this is the most common tell of an inpaint that looked convincing at a glance but doesn't hold up under a closer look, and it's worth checking before treating the edit as finished.

OUTPUT
One image, identical to {{source_image}} outside the masked region, with the masked area now showing the replacement content described above with no visible trace that an edit occurred.`,
    variables: [
      {
        name: 'source_image',
        description: `The photo containing the unwanted object.`,
        example: `family_photo_beach.jpg — a beach photo with a stranger's beach umbrella visible in the background over the subject's left shoulder`,
        required: true,
      },
      {
        name: 'masked_object',
        description: `What is being covered by the inpaint mask.`,
        example: `the orange-and-white striped beach umbrella and its pole`,
        required: true,
      },
      {
        name: 'edit_goal',
        description: `Whether this is a removal or a replacement, stated explicitly.`,
        example: `clean removal — the umbrella should disappear entirely, revealing more open beach and sky behind it`,
        required: true,
      },
      {
        name: 'replacement_content',
        description: `Exactly what should be generated under the mask.`,
        example: `a continuation of the same pale sandy beach and the same soft overcast sky, with the natural horizon line running through at the same height as elsewhere in frame`,
        required: true,
      },
      {
        name: 'surrounding_context',
        description: `The visible context just outside the mask that the fill must match.`,
        example: `the flat, slightly damp sand tone and the low, even cloud cover visible on both sides of the umbrella`,
        required: true,
      },
      {
        name: 'material_continuity_note',
        description: `Any specific pattern or texture that must continue seamlessly.`,
        example: `faint parallel wave-wash lines in the sand should continue at the same spacing and angle through the masked region`,
        required: false,
      },
      {
        name: 'shadow_note',
        description: `What to do about any cast shadow from the removed object.`,
        example: `remove the umbrella's shadow stretching toward camera-right, since the overcast sky means it should read as a very faint, soft shadow at most, not sharp`,
        required: false,
      },
    ],
    targetTools: ['Flux.1 Fill [dev]'],
    tags: [
      'flux',
      'flux-fill',
      'inpainting',
      'object-removal',
      'photo-retouching',
      'image-editing',
    ],
    whyItWorks: `Fill inpainting is a positive-generation task even when the user's actual intent is "delete" — the model always paints something into the masked pixels, so an instruction like "remove the umbrella" with no description of what fills the space is genuinely underspecified. Naming the exact replacement content — continuing sand and sky, matched horizon height — is what turns a vague deletion request into content Fill can actually generate, which is the core mechanical reason this prompt is structured around "what should exist instead," not "what to take away."

The material and texture continuity instruction targets inpainting's most common visible failure: a patterned or textured surface — wood grain, sand ripples, tile — that stops abruptly at the mask edge and resumes as a flatter, less-detailed texture inside the filled region. Fill can satisfy "looks plausible" without satisfying "matches this specific surrounding pattern's exact spacing and angle" unless that continuity is stated as its own explicit requirement, separate from just describing the content generally.

The shadow-cleanup instruction exists because Fill's default behavior only reconstructs the masked region itself. A cast shadow from the removed object often extends outside the mask boundary onto areas that were never masked in the first place, and if the mask wasn't drawn generously enough to include that shadow, no prompt instruction can fix it after the fact. Naming the shadow explicitly is what prompts a careful, generous mask — or a deliberate follow-up edit — that actually covers it, rather than only the object's silhouette.

Edge-blending is called out separately from content accuracy because these are genuinely different failure modes in inpainting: content can be perfectly plausible in isolation while still showing a visible seam, halo, or color-temperature mismatch exactly at the mask boundary. Fill needs to be told that the seam itself is a thing to hide, not only the content inside it.`,
    exampleOutput: `The beach photo with the umbrella and its shadow fully gone, replaced by a continuation of the same sand texture and wave-wash lines and the same overcast sky at the same horizon height — nothing in the reconstructed area hints an object was ever there.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.1 Fill [dev]', date: '2026-07-23' }],
    changelog: [
      {
        date: '2026-07-23',
        note: `Initial publish, verified against Flux.1 Fill [dev] for object removal with shadow cleanup and texture-matched reconstruction.`,
      },
    ],
  },
  {
    slug: 'flux-depth-structural-pose-and-layout-transfer',
    category: 'flux',
    title: `Transfer an exact pose and layout onto a new subject with Flux.1 Depth`,
    description: `A structural-conditioning prompt for Flux.1 Depth that generates an entirely new subject, styling, and scene while locking the exact pose, camera angle, and spatial layout of a reference photo — useful for turning a rough reference or stock photo into on-brand creative without redrawing the composition from scratch.`,
    promptText: `DEPTH REFERENCE IMAGE
{{depth_reference_image}}. This image's depth map — the exact spatial arrangement of near-to-far surfaces, the pose, and the camera angle — is the fixed structural skeleton for this generation. The reference's own colors, lighting, and subject identity are not being kept, only its geometry.

WHAT CARRIES OVER FROM THE REFERENCE
Only the structural layout: {{structural_elements}} — the pose, the relative position of foreground and background elements, and the camera's height and angle. Nothing about the reference's actual appearance — its lighting, its color palette, who or what is in it — should influence the new image beyond this geometry.

NEW SUBJECT AND STYLING
{{new_subject_description}}, occupying exactly the spatial position and pose the depth map defines.

NEW SCENE AND ENVIRONMENT
{{new_environment}}, built around the same near, mid, and far depth layers as the reference but with entirely new content in each layer.

LIGHTING AND MOOD FOR THE NEW IMAGE
{{new_lighting_and_mood}}. This is generated fresh for the new subject and scene — do not carry over any lighting direction implied by the reference image's own shadows unless the new lighting note happens to call for something similar.

HOW CLOSELY TO FOLLOW THE STRUCTURE
{{structural_adherence_note}}. State whether the pose must match exactly — useful for a product held in a very specific way — or loosely, useful when only the overall composition matters and not finger-level accuracy.

WHAT THE RESULT SHOULD NOT RESEMBLE
Because there is no negative-prompt field, say this positively: the final image should look like an entirely original photograph of the new subject in the new environment, sharing only its spatial composition with the reference — not a filtered or restyled version of the reference photo itself, and not a visible depth-map artifact such as banding or flattened perspective anywhere in the output.

CONDITIONING STRENGTH NOTE
If the platform or interface exposes a depth-conditioning strength value separately from this text prompt, treat structural_adherence_note above as the description of what that numeric strength should achieve, not a replacement for setting it — a high strength value with a loosely-worded adherence note, or a low strength value with an "exact match" instruction, will pull against each other, so keep the language here consistent with whatever strength setting is actually in use for this generation.

CHECK BEFORE FINALIZING
Compare the new subject's key contact points against the reference — where a hand touches a surface, where a foot bears weight, where the body bends — since these are the specific points where a depth map's structural guidance is easiest to satisfy loosely without actually matching, and an otherwise-good generation can still get exactly these points subtly wrong.

OUTPUT
One fully rendered image with new subject, new environment, and new lighting, whose composition and pose match {{depth_reference_image}}'s structural layout exactly.`,
    variables: [
      {
        name: 'depth_reference_image',
        description: `The source photo or sketch supplying the structural skeleton.`,
        example: `stock_yoga_pose.jpg — a stock photo of a person in a seated forward-fold yoga pose, shot from a low three-quarter angle`,
        required: true,
      },
      {
        name: 'structural_elements',
        description: `Which specific structural aspects must carry over from the reference.`,
        example: `the exact seated forward-fold pose, the low three-quarter camera angle, and the floor-to-ceiling spatial proportions of the room`,
        required: true,
      },
      {
        name: 'new_subject_description',
        description: `The new subject or character to render into that structure.`,
        example: `a middle-aged man in athletic wear, calm expression, mid-stretch`,
        required: true,
      },
      {
        name: 'new_environment',
        description: `The entirely new scene or setting to build around the same depth layers.`,
        example: `a minimalist home studio with a single potted plant in the far background and morning light through a sheer curtain`,
        required: true,
      },
      {
        name: 'new_lighting_and_mood',
        description: `The lighting and mood for the new image, independent of the reference.`,
        example: `soft, warm morning backlight creating a gentle rim on the subject's silhouette`,
        required: true,
      },
      {
        name: 'structural_adherence_note',
        description: `How strictly the pose or layout must be followed.`,
        example: `match the pose exactly, including hand and foot placement — this is for a fitness-app tutorial frame where the pose itself is the instructional content`,
        required: true,
      },
    ],
    targetTools: ['Flux.1 Depth [pro]'],
    tags: [
      'flux',
      'flux-depth',
      'structural-conditioning',
      'pose-transfer',
      'image-editing',
      'composition-control',
    ],
    whyItWorks: `Depth conditioning works by extracting a depth map from the reference and feeding it as a structural constraint alongside the text prompt, which means the model is being given two genuinely separate inputs — geometry from the image, everything else from the words. The prompt's job is to be explicit about that split, which is exactly why WHAT CARRIES OVER FROM THE REFERENCE names the geometry alone and explicitly disclaims the reference's lighting, color, and subject identity; without that disclaimer, some of the reference's original color and lighting character can bleed through as an unwanted stylistic echo.

Naming structural_adherence_note explicitly — exact versus loose — matters because depth-conditioning strength is not a fixed setting in practice: a fitness-pose tutorial needs finger- and joint-level accuracy preserved, while a use case that only needs "a similar layout of foreground subject and background environment" can tolerate loose adherence that gives the new subject's own proportions more natural room to render. Not stating which one is needed leaves the model to guess at a default strength that may be wrong for the specific job.

The explicit "should not resemble a filtered version of the reference" line targets a real failure mode of structural-conditioning models generally: when the depth signal is strong and the new-content prompt is comparatively thin, the output can end up reading as a restyled version of the original photo rather than a genuinely new one. Stating the new subject, environment, and lighting in as much concrete detail as a from-scratch text-to-image brief would need is what prevents the reference from dominating more than its intended structural role.

Warning against visible depth-map artifacts matters because a depth map is itself a lossy, low-fidelity representation of 3D space, and a poorly conditioned generation can visibly show that flattening — especially at object boundaries where the depth map's edges were imprecise. Naming it as an explicit thing to avoid gives the model a concrete failure to check its own output against, rather than leaving it as an invisible risk nobody flagged.`,
    exampleOutput: `A new photograph of a calm-looking man mid-stretch in a minimalist home studio, in the exact seated forward-fold pose and low three-quarter camera angle from the original yoga stock photo, with entirely new lighting, subject, and environment — none of the stock photo's original color or lighting carried over.`,
    verifiedAgainst: [
      { tool: 'Flux', version: 'Flux.1 Depth [pro]', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: `Initial publish, verified against Flux.1 Depth [pro] for pose-locked, fully restyled generation from a stock-photo reference.`,
      },
    ],
  },
  {
    slug: 'flux-redux-restyle-an-existing-photo-for-a-new-season-or-mood',
    category: 'flux',
    title: `Restyle an existing photo for a new season or mood with Flux.1 Redux`,
    description: `An image-variation prompt for Flux.1 Redux that reinterprets an existing photo's composition into a new seasonal palette or mood — useful for turning one hero shot into a full seasonal campaign set without reshooting — while being explicit about how far the restyle should drift from the original.`,
    promptText: `SOURCE IMAGE
{{source_image}}. This photo's overall composition and subject arrangement is the starting point Redux will vary from — not a fixed structural lock the way Depth conditioning would use it, but a strong stylistic and compositional reference.

WHAT SHOULD STAY RECOGNIZABLE FROM THE SOURCE
{{preserved_elements}} — the elements a viewer familiar with the original campaign shot should still recognize in the restyled version, even though the mood is changing.

NEW DIRECTION
{{new_direction}}. This is the actual creative brief for the restyle — it should visibly change the color palette, the implied season or time of year, and the overall emotional register of the image.

HOW MUCH VARIATION IS WANTED
{{variation_strength_note}}. State whether this should read as a close cousin of the original — same shot, different season — or a much looser reinterpretation that only shares a general idea with it.

COLOR AND MOOD SPECIFICS
{{color_and_mood_detail}}. Be as specific here as you would in a from-scratch brief — Redux still needs concrete color and lighting language to steer toward, not just "make it feel more autumnal."

WHAT SHOULD NOT CARRY OVER
Because there is no negative-prompt field, state this as a positive fact: only the preserved elements named above carry forward from the source; everything else — the source image's original lighting, its original color grade, and any original background details not named as preserved — should be treated as fully open to change under the new direction.

USING THIS ACROSS A CAMPAIGN SET
If this restyle is one of several seasonal variants being generated from the same source image, keep variation_strength_note and preserved_elements worded identically across every variant in the set, changing only new_direction and color_and_mood_detail between them — this is what keeps the resulting set reading as one consistent campaign reinterpreted several ways, rather than as several unrelated shots that happen to share a starting composition.

CHECK BEFORE FINALIZING
Confirm every element named in preserved_elements is genuinely still recognizable in the result, not just present in some altered form — a "checkered blanket" that came through as a plain fabric texture, for instance, technically preserved the object but lost the specific pattern that made it recognizable as the same asset, which defeats the point of the preservation instruction.

OUTPUT
One restyled image that a viewer would recognize as "the same shot, reinterpreted for the new direction," rather than either an identical copy of the source or a completely unrelated new photo.`,
    variables: [
      {
        name: 'source_image',
        description: `The original hero shot being restyled.`,
        example: `summer_campaign_hero.jpg — a wide shot of a picnic spread on a checkered blanket in a sunlit park`,
        required: true,
      },
      {
        name: 'preserved_elements',
        description: `What must still be recognizable after the restyle.`,
        example: `the same checkered blanket pattern, the same wicker basket, and the same wide overhead-angle composition`,
        required: true,
      },
      {
        name: 'new_direction',
        description: `The creative direction for the restyle.`,
        example: `reinterpret this as the brand's autumn campaign — same picnic concept, but a cozy fall afternoon instead of peak summer`,
        required: true,
      },
      {
        name: 'variation_strength_note',
        description: `How closely the result should track the source versus diverge from it.`,
        example: `close cousin — same composition and camera angle, only the season, palette, and props on the blanket should change`,
        required: true,
      },
      {
        name: 'color_and_mood_detail',
        description: `Specific color, lighting, and mood language for the new direction.`,
        example: `warm amber and rust tones, low golden-hour sun casting long shadows across the blanket, a light scatter of fallen leaves at the edges of frame`,
        required: true,
      },
    ],
    targetTools: ['Flux.1 Redux [dev]'],
    tags: [
      'flux',
      'flux-redux',
      'image-variation',
      'restyling',
      'campaign-creative',
      'seasonal-content',
    ],
    whyItWorks: `Redux is built specifically to take an existing image as a strong prompt-adjacent conditioning signal for a new generation, which is a meaningfully different mechanism than Depth's structural-only conditioning — Redux carries forward compositional and stylistic character broadly, not just geometry. The prompt's real job is to say how much of that broad character should survive versus be overwritten, which is exactly what HOW MUCH VARIATION IS WANTED is doing; without it, Redux's default adherence strength may either barely change the source, producing an asset too close to the original to read as a distinct seasonal shot, or drift so far the campaign's visual thread is lost entirely.

Naming preserved_elements explicitly — the checkered blanket, the wicker basket, the camera angle — matters because Redux has no way to know which specific details a brand considers load-bearing for campaign continuity versus incidental. A generic "keep the vibe similar" instruction gives it no way to distinguish an intentional brand element from a random compositional detail it's equally free to change.

The instruction to still supply concrete color_and_mood_detail, not a one-word mood label, matters because Redux's restyle quality tracks the same specificity principle as any Flux text-to-image brief: "more autumnal" is a vague target the model has to interpret, while "warm amber and rust tones, low golden-hour sun, long shadows" is a target it can actually hit precisely. Treating a restyle task as needing less prompt detail than a from-scratch generation is a common underestimate of how much guidance Redux still needs to land a specific look.

The explicit "what should not carry over" framing does specific extra work for Redux beyond the usual no-negative-prompt workaround, because the model's default behavior already leans toward preserving more of the source's original character than a from-scratch generation would. Stating plainly that the original lighting and color grade are open to change is what actually unlocks the seasonal shift, rather than the model conservatively keeping the summer light because nothing told it not to.`,
    exampleOutput: `The same picnic composition — checkered blanket, wicker basket, wide overhead angle — now rendered in warm amber and rust tones under low golden-hour light with scattered fallen leaves, immediately readable as "the summer hero shot, but for autumn."`,
    verifiedAgainst: [
      { tool: 'Flux', version: 'Flux.1 Redux [dev]', date: '2026-08-04' },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: `Initial publish, verified against Flux.1 Redux [dev] for a close-adherence seasonal restyle of an existing campaign hero shot.`,
      },
    ],
  },
  {
    slug: 'flux-ultra-high-resolution-print-poster-brief',
    category: 'flux',
    title: `Brief a print-ready, ultra-high-resolution poster with Flux1.1 [pro] Ultra`,
    description: `A composition-and-detail-density brief for Flux1.1 [pro] Ultra, the raw-mode, up-to-4-megapixel Flux variant, structured for a large-format print where fine detail has to hold up at a viewing distance far closer than a typical screen image.`,
    promptText: `FINAL USE CASE
{{final_use_case}}. This determines how much fine detail actually needs to survive — a poster viewed at arm's length needs real texture at every depth, not just a sharp hero subject with a soft background.

SUBJECT
{{subject_description}}

SETTING AND BACKGROUND DETAIL
{{setting_description}}. Because this will print at large size, describe background elements with the same specificity as the foreground subject — {{background_detail_note}} — rather than leaving distant elements vague, since "vague" at large-format print size reads as visibly soft or empty, not tastefully out of focus.

COMPOSITION FOR THE FINAL CROP
{{composition_and_safe_area}}. State explicitly where any text or logo will be placed by the designer afterward, and keep that zone visually calm, the way the reserved-space technique works for social graphics — except here the stakes are a wasted print run, not a re-edit.

RAW MODE VERSUS STYLIZED LOOK
{{raw_mode_note}}. State whether this should read as an unretouched, raw-feeling photograph — Ultra's raw mode — or a more polished, intentionally graded commercial look, since Ultra's raw setting measurably changes skin texture, grain, and color punchiness.

CAMERA AND LENS
{{camera_and_lens}}, described with the same care as a magazine cover shoot, since Ultra's higher resolution will actually resolve lens character — grain, chromatic fringing, depth-of-field falloff — that a lower-resolution Flux generation would simply not render with enough fidelity to notice.

WHAT THE FRAME SHOULD NOT CONTAIN
Because Flux has no negative-prompt field, state this positively: the frame contains only the subject and setting described above — no watermark, no placeholder text, no visible seam or tiling artifact anywhere across the full high-resolution canvas.

BLEED AND TRIM ALLOWANCE
If this will be professionally printed, state whether the composition needs a bleed margin — extra image content extending past the final trim line on every edge — so nothing critical (the subject's silhouette, a key compositional element) sits so close to the edge that a small trim variance during printing could cut into it. Describe what should exist in that margin area, since it is still part of the generated canvas even though it won't be visible in the final trimmed print.

CHECK BEFORE SENDING TO PRINT
View the output at 100% zoom on at least three different regions of the frame — the subject, the mid-ground, and a far background corner — rather than judging overall sharpness from a shrunk-down preview, since a preview that looks sharp can still reveal soft or repetitive-looking texture once inspected at the actual resolution a print job will use.

OUTPUT
One image at Ultra's full resolution, with detail density consistent across the entire frame, not just the subject, sharp enough to hold up at the final use case's actual viewing distance.`,
    variables: [
      {
        name: 'final_use_case',
        description: `The physical output and viewing context.`,
        example: `a 24x36 inch event poster, printed and mounted, viewed from roughly 3-4 feet away`,
        required: true,
      },
      {
        name: 'subject_description',
        description: `The main subject of the poster.`,
        example: `a solo trumpet player mid-performance under a single spotlight, captured from a low angle`,
        required: true,
      },
      {
        name: 'setting_description',
        description: `The background or setting and its level of visible detail.`,
        example: `a dim jazz club interior — brick wall, hanging string lights, a few blurred silhouettes of an audience at small tables`,
        required: true,
      },
      {
        name: 'background_detail_note',
        description: `A note on how much specific detail the background needs, given the print size.`,
        example: `the brick texture and individual string lights should still read as distinct shapes even slightly out of focus, not a flat colored smear`,
        required: false,
      },
      {
        name: 'composition_and_safe_area',
        description: `Where the final crop's safe zone for text or logo placement sits.`,
        example: `the lower third left deliberately dark and uncluttered for the event date and venue name, subject occupying the upper two-thirds`,
        required: true,
      },
      {
        name: 'raw_mode_note',
        description: `Whether to aim for raw, unretouched or polished commercial rendering.`,
        example: `raw, unretouched skin texture and natural grain — this should feel like a real concert photograph, not a retouched album cover`,
        required: true,
      },
      {
        name: 'camera_and_lens',
        description: `Camera and lens to anchor the photographic rendering.`,
        example: `shot as if on a Sony A7R V with an 85mm f/1.4 lens, shallow depth of field isolating the trumpet and face`,
        required: true,
      },
    ],
    targetTools: ['Flux1.1 [pro] Ultra'],
    tags: [
      'flux',
      'flux-ultra',
      'print-ready',
      'high-resolution',
      'poster-design',
      'raw-mode',
    ],
    whyItWorks: `Ultra's distinguishing feature versus standard Flux1.1 [pro] is native support for higher output resolution, up to roughly 4 megapixels — which means detail that would simply be invisible or averaged away at a lower-resolution generation becomes visible and evaluable at Ultra's resolution. A background described vaguely ("a jazz club") that would pass unnoticed in a web-sized image will read as noticeably soft or generically rendered once printed large, which is why SETTING AND BACKGROUND DETAIL insists on foreground-level specificity for background elements too.

Naming raw_mode_note explicitly matters because Ultra ships with a distinct raw-mode toggle that measurably changes skin texture, grain character, and color saturation toward a more unretouched, photographic look versus its default, more polished commercial rendering. These are genuinely two different outputs from the same model, and not specifying which one is wanted leaves it to a default that may not match the brief's intended feel.

Calling out camera and lens with the same care as a magazine shoot matters more at Ultra resolution specifically than at standard Flux resolution, because lens character — grain, chromatic fringing at high-contrast edges, the exact falloff curve of a fast aperture — only becomes resolvable detail once the base resolution is high enough to render it. At lower resolutions, the same instruction produces a similar-looking but less textured result, so the payoff for this level of camera detail scales directly with the resolution tier being used.

The safe-area instruction is functionally the same reserved-space technique used for social graphics, but the stakes are different for a print job: a poster with the wrong composition can't simply be re-cropped and reposted the way a digital graphic can, since a physical print run is a real, unrecoverable cost. Stating the safe zone explicitly before generation is cheaper than discovering after printing that the subject's head sits exactly where the event date needed to go.`,
    verifiedAgainst: [
      { tool: 'Flux', version: 'Flux1.1 [pro] Ultra', date: '2026-07-27' },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: `Initial publish, verified against Flux1.1 [pro] Ultra for a large-format print brief with a defined safe area and raw-mode texture.`,
      },
    ],
  },
  {
    slug: 'flux-2-multi-reference-consistent-product-angle-set',
    category: 'flux',
    title: `Generate a consistent multi-angle product shot set with Flux.2's multi-reference input`,
    description: `A multi-reference brief for Flux.2 that feeds several existing photos of the same physical product as reference images to generate new angles of that exact product, instead of describing it from scratch and risking a subtly different-looking item in every new shot.`,
    promptText: `REFERENCE IMAGES
{{reference_images}}. These {{reference_count}} images all show the same physical product from different existing angles — treat them collectively as ground truth for its exact shape, proportions, color, and any printed or embossed detail, not as separate style inspirations to blend.

WHAT MUST MATCH EXACTLY ACROSS ALL REFERENCES
{{fixed_product_details}}. If the references show slightly different lighting or backgrounds from each other, ignore that — extract only the product's physical identity, not its previous lighting setups.

NEW ANGLE TO GENERATE
{{new_angle_description}}. This angle is not shown in any of the reference images — it needs to be inferred correctly from the product's known geometry across the references you do have, the way a real photographer walking around a physical object would predict what the unseen side looks like from what they can already see.

CONSISTENCY CHECK
Before finalizing, verify the generated angle is physically plausible given the other reference angles — {{plausibility_note}} — since the biggest failure mode in multi-reference generation is a new angle that looks like a good product photo in isolation but doesn't actually match the same object's proportions from the references.

BACKGROUND AND LIGHTING FOR THIS SHOT
{{background_and_lighting}}, applied fresh to this angle — consistent with the other new angles being generated in this same set, not necessarily matching whatever background any individual reference image happened to have.

WHAT SHOULD NOT DRIFT FROM THE REFERENCES
Because there is no negative-prompt field, state this positively: the product in the new angle has exactly the same fixed details as every reference image — no resized proportions, no recolored surface, and no altered or invented branding beyond what the references actually show.

BUILDING OUT THE FULL SET
If more angles are needed beyond this one, generate them one at a time using this same reference set rather than trying to request several new angles in a single pass — each new angle should still be checked against the original references individually, and treating this as a repeatable single-angle procedure, run once per needed view, catches inconsistency earlier than a single large batch request would.

CHECK BEFORE FINALIZING
Line this new angle up mentally against the closest existing reference angle and check that the same fixed_product_details would appear where you'd expect if you rotated the physical object that amount — a genuinely consistent new angle should let you predict roughly where a specific feature (a seam, a button, a logo) will land before you even look, and if it lands somewhere that wouldn't make sense given the object's real geometry, treat that as a failed generation rather than an acceptable variation.

OUTPUT
One new image showing the new angle described above of the exact same product as the reference set, styled with the background and lighting described above, ready to sit alongside the other angles in the set as one visually consistent product gallery.`,
    variables: [
      {
        name: 'reference_images',
        description: `The set of existing photos of the same product, from different angles.`,
        example: `front_view.png, three_quarter_left.png, top_down.png — three existing studio shots of the same wireless earbuds case`,
        required: true,
      },
      {
        name: 'reference_count',
        description: `How many reference images are being supplied.`,
        example: `3`,
        required: false,
      },
      {
        name: 'fixed_product_details',
        description: `The specific physical details that must stay identical across every angle.`,
        example: `the matte charcoal case with a rounded-square shape, the copper LED indicator dot on the front edge, and the hinge seam running along the back`,
        required: true,
      },
      {
        name: 'new_angle_description',
        description: `The new angle being generated that none of the references directly show.`,
        example: `a side profile view showing the hinge fully open at roughly 45 degrees, camera at eye-level with the case`,
        required: true,
      },
      {
        name: 'plausibility_note',
        description: `What specifically to check for physical consistency against the references.`,
        example: `the hinge mechanism and its exact position on the back edge should line up with where it's visible in the three_quarter_left reference`,
        required: false,
      },
      {
        name: 'background_and_lighting',
        description: `The styling to apply to this new angle, kept consistent across the set.`,
        example: `seamless pale grey studio background, soft even top-down light matching the other angles already generated in this set`,
        required: true,
      },
    ],
    targetTools: ['Flux.2'],
    tags: [
      'flux',
      'flux-2',
      'multi-reference',
      'product-photography',
      'consistency',
      'ecommerce',
    ],
    whyItWorks: `Flux.2's native multi-reference support — accepting multiple images as simultaneous conditioning input rather than one — is the specific capability this prompt is built around, and it changes the underlying task from "describe a product accurately enough to be recognizable" to "extract a shared physical identity across several already-accurate photos." That is a fundamentally easier and more reliable task, since real proportions and details are being read from pixels rather than reconstructed from a text description that could never fully specify something as fine as an exact hinge seam position.

The explicit instruction to extract only physical identity and ignore each reference's individual lighting or background matters because multi-reference conditioning can otherwise blend stylistic elements across the references along with the product identity. If one reference happens to have a warm-toned background and another cool-toned, an under-specified prompt risks generating a muddled average of both instead of a clean, deliberate new styling choice for this specific shot.

The consistency-check step — verifying the new angle's geometry against the other references, not just judging it in isolation — targets the actual failure mode of angle-inference tasks: a generated new angle can be a completely plausible-looking product photo that simply doesn't correspond to the same physical object shown in the other angles, with a hinge in a slightly different position or proportions subtly off. This is much harder to catch after the fact than to instruct against up front, since a viewer comparing angles side-by-side notices inconsistency a single image reviewed alone would not reveal.

Separating "what must match" — product identity — from "what's generated fresh" — background and lighting for this specific new shot — prevents a different failure. Without that split, the model might either drag one reference's entire background into the new angle, which is inappropriate if the references had inconsistent styling to begin with, or, at the other extreme, treat the whole reference set too loosely and let the product's actual proportions drift along with the styling.`,
    exampleOutput: `A fourth image showing the earbuds case's hinge open at 45 degrees from eye-level, with the hinge position, case shape, and copper LED dot all consistent with the three existing reference angles, styled on the same seamless pale grey background as the rest of the set.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.2', date: '2026-08-06' }],
    changelog: [
      {
        date: '2026-08-06',
        note: `Initial publish, verified against Flux.2's multi-reference mode for inferring an unseen product angle from three existing reference photos.`,
      },
    ],
  },
  {
    slug: 'flux-schnell-rapid-concept-ideation-batch',
    category: 'flux',
    title: `Run a fast concept-ideation batch with Flux.1 [schnell]`,
    description: `A batch-ideation brief for Flux.1 [schnell], the distilled, few-step Flux variant built for speed over fidelity, structured to generate a wide spread of genuinely different visual directions quickly for early-stage creative review, rather than one polished-looking but narrow concept.`,
    promptText: `CREATIVE BRIEF
{{creative_brief}}

WHAT THIS BATCH IS FOR
This is early-stage concept exploration, not a final asset. Prioritize speed and breadth of direction over per-image polish — schnell's few-step generation trades fine detail for fast iteration, which is exactly the right tradeoff at this stage, so do not expect or aim for the finish quality of a full-step Flux.2 or Ultra generation here.

DIRECTIONS TO COVER ACROSS THE BATCH
{{direction_axes}}. Generate one variant per direction listed, so the batch spans genuinely different visual approaches rather than {{batch_size}} near-identical variations of the same single idea with minor detail changes.

WHAT STAYS CONSTANT ACROSS ALL VARIANTS
{{constant_elements}} — the parts of the brief that must not vary between directions, so the batch is comparing different treatments of the same underlying idea, not several unrelated concepts.

LEVEL OF DETAIL EXPECTED PER IMAGE
Each image only needs enough resolution and detail to judge the direction — composition, mood, color story, and overall concept — not label-perfect text, not final-quality skin or material texture. Treat any garbled fine detail, such as illegible text or a slightly malformed hand, as acceptable noise at this stage as long as the core direction reads clearly, since a later pass on the winning direction using Flux.2 or Ultra is where that gets fixed.

WHAT SHOULD NOT APPEAR
Because there is no negative-prompt field even in schnell, state exclusions positively: each variant should show only the constant elements above, styled per its specific direction — no unrelated extra subject invented to fill the frame, even in a fast, rough pass.

REVIEWING THE BATCH
When judging the batch afterward, rank directions against each other on concept alone — which composition and mood best serve {{creative_brief}} — rather than eliminating a direction because its specific generation happened to render a slightly awkward hand or a soft edge that a full-quality pass would resolve anyway; conflating a schnell-tier rendering flaw with a bad creative direction is the single most common misread of a fast ideation batch.

NEXT STEP AFTER SELECTION
Once a direction is chosen from the batch, note that its constant_elements and the specific winning entry in direction_axes become the starting brief for a follow-up full-quality generation on Flux.2 or Flux1.1 [pro] Ultra — carry the winning direction's exact wording forward rather than re-describing it loosely from memory, since that's what keeps the final asset aligned with the concept that was actually chosen.

OUTPUT
{{batch_size}} separate images, one per listed direction, each recognizably a fast, rough-but-legible take on the creative brief rather than a slow, fully-rendered version of just one interpretation.`,
    variables: [
      {
        name: 'creative_brief',
        description: `The underlying creative concept the whole batch is exploring.`,
        example: `a hero image for a running-shoe launch that should feel kinetic and energetic`,
        required: true,
      },
      {
        name: 'direction_axes',
        description: `The distinct visual directions to spread the batch across.`,
        example: `1) frozen mid-stride action shot, 2) abstract motion-blur composition, 3) flat-lay studio shot with dynamic diagonal lines, 4) urban night scene with motion trails, 5) minimalist single-shoe hero shot with dramatic shadow`,
        required: true,
      },
      {
        name: 'batch_size',
        description: `How many total variants to generate.`,
        example: `5`,
        required: true,
      },
      {
        name: 'constant_elements',
        description: `What must stay the same across every variant so they remain comparable.`,
        example: `the same red-and-black colorway of the shoe, and the same overall energetic, athletic brand tone`,
        required: true,
      },
    ],
    targetTools: ['Flux.1 [schnell]'],
    tags: [
      'flux',
      'flux-schnell',
      'rapid-ideation',
      'concept-exploration',
      'batch-generation',
      'creative-review',
    ],
    whyItWorks: `schnell is a distilled model specifically optimized to produce a usable image in very few denoising steps — roughly an order of magnitude fewer than [dev] or [pro] — which is a genuine speed-and-fidelity tradeoff, not simply a worse version of Flux. Treating a schnell output like a near-final asset and being disappointed by soft detail or slightly malformed text misunderstands what the tier is for, which is why WHAT THIS BATCH IS FOR states the tradeoff explicitly rather than letting the reviewer judge schnell output against Ultra-level expectations.

Naming direction_axes explicitly and requiring one variant per axis targets the same unconstrained-brainstorm gravity-well problem that plagues text ideation. Left to generate several variants of one loose brief, an image model — like a text model — tends to produce visually similar takes on its first plausible interpretation rather than genuinely different directions. Forcing a distinct axis per image is what actually buys the breadth an ideation batch is supposed to deliver, rather than five nearly-identical crops of the same idea.

The constant_elements instruction exists to keep the batch a genuine comparison of direction rather than an incoherent set of unrelated images. Without stating what has to hold steady — the shoe's exact colorway, the brand tone — a batch spanning five different visual directions could easily drift into five different-looking products entirely, which defeats the point of comparing directions for the same brief.

Explicitly permitting rough fine detail as acceptable noise at this stage is itself a deliberate calibration: a schnell brief written with the same fine-detail insistence as an Ultra print brief either wastes effort demanding precision the fast tier structurally can't deliver, or worse, causes a reviewer to reject a direction that would have worked fine once rendered properly at full quality. Separating "is the concept right" from "is the execution polished" is the actual point of doing ideation on the fast tier before committing to a slow, expensive final render.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.1 [schnell]', date: '2026-07-20' }],
    changelog: [
      {
        date: '2026-07-20',
        note: `Initial publish, verified against Flux.1 [schnell] for a five-direction rapid ideation batch ahead of a full-quality Flux.2 pass.`,
      },
    ],
  },
  {
    slug: 'flux-fill-virtual-staging-empty-room',
    category: 'flux',
    title: `Virtually stage an empty room for a listing with Flux.1 Fill`,
    description: `A masked-inpainting brief for Flux.1 Fill that adds realistic furniture and decor into an empty or sparsely furnished real-estate photo, matching the room's actual architecture, light, and perspective instead of pasting in furniture that looks compositionally wrong.`,
    promptText: `SOURCE ROOM PHOTO AND MASK
{{room_photo}}, with the staging mask covering {{staging_area}} — the floor and wall area where furniture should be added — leaving {{fixed_architecture}} outside the mask untouched.

ROOM ARCHITECTURE TO RESPECT
{{fixed_architecture}}. The window positions, ceiling height, floor material, and existing light fixtures are fixed facts about this real room — any furniture added must be scaled and positioned as if it physically exists inside these exact dimensions, not floating at an inconsistent scale.

STAGING BRIEF
{{furniture_and_style}}. This should read as a real, currently-occupied home, not a furniture catalog page — pieces should relate to each other the way an actual room's furniture does, such as a rug under a coffee table or a lamp within reach of a chair, not simply scattered independently around the space.

SCALE AND PLACEMENT
{{scale_reference}}, so proportions are physically plausible relative to the fixed architecture. A sofa that would not fit through the visible doorway, or a rug that floats above the floor plane instead of lying flat on it, breaks the illusion immediately.

LIGHT MATCHING
Light every added piece of furniture using the exact light direction and color temperature already visible in the room photo from the fixed architecture's windows and fixtures — added furniture lit with a different, inconsistent light source is the most common tell of virtual staging done badly.

WHAT SHOULD NOT BE ADDED
Because there is no negative-prompt field, state this positively: the staged area contains only the furniture and style described above — no visible people, no pets, no clutter beyond what a professionally staged, not lived-in-messy, listing photo would show, and nothing that blocks the fixed architecture's windows or doorways.

DISCLOSURE CONSIDERATION
Many listing platforms and local real-estate regulations require virtually staged photos to be labeled as such rather than presented as an unstaged photo of the room's actual furnishing — this prompt produces the image itself, not the listing disclosure, so treat adding that label as a separate, necessary step handled outside this generation, not something to skip because the image already looks convincing.

CHECK BEFORE FINALIZING
Walk the generated furniture layout mentally the way a viewer would walk the real room: confirm there's still a plausible, unobstructed path from the doorway to the windows and around each major piece, since virtual staging that looks good as a static image but would be physically impossible to walk through in the real, empty room undermines the listing's credibility once a buyer visits in person.

OUTPUT
One image, identical to {{room_photo}} outside the masked area, now showing a convincingly furnished version of the same physical room, lit consistently with the original photo, ready for a real-estate listing.`,
    variables: [
      {
        name: 'room_photo',
        description: `The empty or sparse room photo being staged.`,
        example: `listing_living_room_empty.jpg — an empty living room with two large south-facing windows and light oak flooring`,
        required: true,
      },
      {
        name: 'staging_area',
        description: `The floor and wall region the staging mask covers.`,
        example: `the entire open floor area, excluding a 12-inch buffer right against each wall`,
        required: true,
      },
      {
        name: 'fixed_architecture',
        description: `The room's fixed structural details that must be respected and left unaltered.`,
        example: `the two south-facing windows on the left wall, the 9-foot ceiling, the light oak flooring, and the recessed ceiling lights`,
        required: true,
      },
      {
        name: 'furniture_and_style',
        description: `The furniture set and decor style to add.`,
        example: `a mid-century modern sofa in warm oatmeal fabric, a low walnut coffee table, a jute area rug, one floor lamp, and a small potted fig tree in the corner`,
        required: true,
      },
      {
        name: 'scale_reference',
        description: `A concrete size anchor to keep furniture proportions physically honest.`,
        example: `the sofa should read as roughly 7 feet long, comfortably fitting the wall it's placed against with about 2 feet of clearance on each side`,
        required: false,
      },
    ],
    targetTools: ['Flux.1 Fill [pro]'],
    tags: [
      'flux',
      'flux-fill',
      'virtual-staging',
      'real-estate',
      'inpainting',
      'interior-design',
    ],
    whyItWorks: `Fill's masked-generation behavior is the right mechanism for staging specifically because the room's actual architecture — the exact windows, ceiling height, floor material — must survive completely unaltered for the listing to be an honest representation of what a buyer will actually see in person. A full-image regeneration risks subtly changing the room's real proportions or finishes, while Fill guarantees the unmasked architecture is pixel-identical to the source photo.

The light-matching instruction is the single highest-leverage line for staging credibility, because virtual-staging failures are overwhelmingly a lighting mismatch, not a furniture-style mismatch. Furniture lit with a generic, direction-less studio glow while the empty room around it clearly has strong directional light from two specific south-facing windows is immediately readable as fake, even to a casual viewer who couldn't articulate why. Pointing explicitly at the room's own visible light direction and color temperature is what makes added furniture look like it was actually photographed inside that room.

The scale_reference instruction addresses real-estate staging's most consequence-laden failure mode: furniture rendered at a size that would not physically fit the room — a sofa too long for the wall, a doorway a bed clearly could not have been carried through — is not just an aesthetic problem but potentially a listing-accuracy problem, since a viewer or agent walking the actual empty room afterward would notice furniture that was never physically plausible in that space.

Explicitly restricting the staging to "professionally staged, not lived-in-messy," and excluding people, pets, and clutter, targets the specific tone difference between a real-estate listing photo and a general lifestyle interior shot. A beautifully lived-in scene with scattered mail and a coffee cup reads as charming in a magazine feature but as visual noise in a listing photo meant to let a buyer imagine their own belongings in the space.`,
    exampleOutput: `The same empty living room, now showing a mid-century sofa, walnut coffee table, jute rug, floor lamp, and fig tree arranged naturally around the existing south-facing windows, lit with the same warm directional daylight visible in the original empty-room photo — no mismatched shadow direction.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.1 Fill [pro]', date: '2026-08-07' }],
    changelog: [
      {
        date: '2026-08-07',
        note: `Initial publish, verified against Flux.1 Fill [pro] for architecture-preserving virtual staging with light-direction matching.`,
      },
    ],
  },
  {
    slug: 'flux-2-ugc-style-influencer-ad-photo',
    category: 'flux',
    title: `Generate a believable UGC-style influencer ad photo with Flux.2`,
    description: `A phone-camera-aware brief for Flux.2 that produces a deliberately imperfect, user-generated-content-style product photo for paid social ads — the specific unpolished look that frequently outperforms studio photography in ad testing — steered entirely through positive description of the camera, light, and imperfections wanted.`,
    promptText: `SETTING AND CONTEXT
{{setting_description}}

SUBJECT AND PRODUCT INTERACTION
{{subject_and_action}}, holding or using {{product_description}} in a way that looks like an actual customer captured it, not a model posing for a shoot.

CAMERA SOURCE TO IMITATE
{{camera_source}}. This should read as if it came directly from that device's camera, not a professional camera post-processed to look casual — the actual optical and processing character a phone camera produces, including its slightly different dynamic range, its particular way of handling a mixed-light scene, and mild sharpening artifacts.

COMPOSITION IMPERFECTIONS TO INCLUDE
{{composition_imperfections}}. A genuinely UGC-feeling photo is not perfectly composed — deliberately build in the kind of minor framing looseness a real person's photo has, rather than the rule-of-thirds precision a trained photographer would apply.

LIGHTING
{{lighting_description}}, the kind of available light a real person would actually be shooting in, not a lighting setup that implies a rig — no studio softbox character, no perfectly even fill.

SKIN, MATERIAL, AND TEXTURE REALISM
{{realism_note}}. Avoid the smoothed-over, airbrushed rendering Flux defaults toward for a "flattering" portrait — real skin texture, real fabric wrinkles, and a candid, slightly caught-off-guard expression are the actual goal here, not a beauty-retouched look.

WHAT SHOULD NOT APPEAR
Because there is no negative-prompt field, state this positively: the frame contains only the subject and product described above, in the setting described — no studio backdrop, no professional lighting rig visible or implied, no overly polished commercial styling, and no visible brand logo beyond what's actually printed on the product itself.

DISCLOSURE CONSIDERATION
An AI-generated image styled to look like organic customer content still has to comply with whatever paid-partnership or ad-disclosure rules apply on the platform it runs on — generating a convincing UGC-style photo does not change that disclosure obligation, so treat the required ad label or disclosure tag as something added at the publishing stage, separate from and unaffected by how authentic the image itself looks.

CHECK BEFORE FINALIZING
Look at the result the way a scroll-fatigued social user would, for about one second: does anything about the lighting, the framing, or the skin rendering make it register as an ad before the product itself is even noticed? If the polish is still visible at a glance, treat that as a failed generation for this specific use case, even if it would be a perfectly good result for a studio-style ad brief.

OUTPUT
One image that would pass as an actual customer's photo if it appeared in a social feed next to real UGC — imperfect, candid, and specifically not looking like paid advertising creative, even though it is one.`,
    variables: [
      {
        name: 'setting_description',
        description: `The everyday, non-studio setting the photo is taking place in.`,
        example: `a cluttered kitchen counter at home, morning light, a coffee mug and some mail visible just out of focus in the background`,
        required: true,
      },
      {
        name: 'subject_and_action',
        description: `Who is in frame and what they are doing with the product.`,
        example: `a woman in a plain grey t-shirt holding the product up close to the camera at arm's length, mid-sentence, slightly candid expression`,
        required: true,
      },
      {
        name: 'product_description',
        description: `The product being featured.`,
        example: `a small amber glass bottle of vitamin gummies with a white label`,
        required: true,
      },
      {
        name: 'camera_source',
        description: `The specific device camera whose look should be imitated.`,
        example: `an iPhone 16 front-facing selfie camera, slightly wide field of view, natural HDR processing`,
        required: true,
      },
      {
        name: 'composition_imperfections',
        description: `The specific framing looseness or minor imperfection to include.`,
        example: `slightly off-center framing, the top of her head just barely cropped, a little too close to the lens`,
        required: false,
      },
      {
        name: 'lighting_description',
        description: `The real, available light source present in the scene.`,
        example: `mixed morning window light from the left and warm overhead kitchen light, slightly uneven and a touch yellow-cast`,
        required: true,
      },
      {
        name: 'realism_note',
        description: `Any specific instruction against over-smoothing or over-polishing.`,
        example: `visible individual hair strands, natural under-eye texture, no airbrushed skin smoothing`,
        required: false,
      },
    ],
    targetTools: ['Flux.2'],
    tags: [
      'flux',
      'ugc-style',
      'ad-creative',
      'social-ads',
      'phone-camera-look',
      'photorealism',
    ],
    whyItWorks: `Flux's default rendering of "a person with a product" leans toward a polished, commercially-lit, subtly-retouched look, because that combination is heavily represented in its training distribution of product photography. Genuinely UGC-style imperfection has to be actively described — a specific device camera, a specific composition looseness, specific unretouched texture — rather than assumed, since the model's unguided default runs in the opposite direction, toward more polish, not less.

Naming a specific camera_source, such as an iPhone's particular dynamic-range handling and processing signature, rather than a generic "phone camera," gives Flux a concrete photographic reference with an actual, learnable visual signature to imitate. Different phone cameras genuinely render mixed lighting, sharpening, and color differently, and "phone camera" alone is as underspecified as "a camera" would be for a studio brief.

The explicit anti-airbrushing instruction targets a documented and consistent Flux bias toward smoothing skin and evening out texture in any portrait-adjacent generation, because "flattering" skin rendering is itself the more common pattern in the training data for images tagged as attractive or polished portraits. This is the same underlying bias reference style-matching prompts warn against for text, applied here to image texture instead of prose register, and it has to be counter-instructed explicitly or the result reads as an ad, not a customer photo.

This matters commercially, not just aesthetically, because UGC-style ad creative is a documented performance category in paid social — platforms and advertisers have repeatedly observed that deliberately unpolished, native-feeling creative frequently outperforms studio photography in click-through and conversion testing, precisely because it doesn't read as an ad at first glance, which is the entire point of the WHAT SHOULD NOT APPEAR section's insistence on no visible studio styling.

The one-second glance test built into the CHECK BEFORE FINALIZING step matters because polish is judged differently than most other quality criteria: a viewer doesn't consciously catalog "the lighting is too even" the way a reviewer might for a studio brief, they simply feel that something is off about the image within a fraction of a second and scroll past, so the useful review standard here is closer to a gut reaction than a checklist, and the prompt calls that out explicitly rather than leaving the reviewer to apply a studio-photo standard of quality to a brief that is deliberately optimized against that standard.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.2', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against Flux.2 for phone-camera-imitation UGC-style ad creative with explicit anti-airbrushing guidance.`,
      },
    ],
  },
  {
    slug: 'flux-2-packaging-mockup-on-retail-shelf',
    category: 'flux',
    title: `Mock up new packaging on a realistic retail shelf with Flux.2`,
    description: `A retail-context brief for Flux.2 that places a packaging design into a believable store-shelf scene for stakeholder review, treating the printed design as a fixed detail to preserve rather than something the model is free to reinterpret.`,
    promptText: `PACKAGING DESIGN
{{packaging_description}}. Every printed element — {{fixed_label_details}} — must render exactly as described, since packaging mockups live or die on whether the actual design is legible and accurate, not just plausible-looking.

SHELF ENVIRONMENT
{{shelf_context}}. This should be a specific, recognizable retail category context, not a generic empty shelf — {{category_context_detail}} — so stakeholders can judge how the design actually competes for attention next to real category conventions.

SHELF PLACEMENT, FACING, AND CAMERA ANGLE
{{facing_and_position}}. State exactly how many units are visible, whether they're shown as a single facing or a multi-unit row, and the camera's height and angle — roughly eye-level or slightly below, the angle an actual shopper walking the aisle would see, not an idealized straight-on product-photography angle.

ADJACENT PRODUCTS
{{adjacent_products_note}}. Neighboring products on the shelf should look like generic, plausible category competitors — not blank placeholders, and not so specific they resemble a real named competitor's actual packaging, which would misrepresent the test.

LIGHTING
{{lighting_description}}, the flat, slightly cool, evenly diffused overhead lighting of an actual retail aisle — not dramatic studio lighting, since that would make the mockup look like a hero ad shot rather than an honest shelf-presence test.

WHAT SHOULD NOT APPEAR
Because there is no negative-prompt field, state this positively: the shelf contains only the packaging described above and the generic adjacent products described — no shelf-talker signage, no price tag, no promotional sticker unless the packaging description specifically calls for one, and no invented extra text anywhere on the packaging beyond the fixed label details.

COMPARING MULTIPLE DESIGN VARIANTS
If this mockup is one of several packaging design options being tested against each other, keep the shelf_context, category_context_detail, facing_and_position, adjacent_products_note, and lighting_description worded identically across every variant, changing only packaging_description and fixed_label_details between them — a shelf test that varies the environment along with the design makes it impossible to tell whether a stakeholder's reaction is about the design itself or about an incidental difference in the mockup's staging.

CHECK BEFORE FINALIZING
Step back from the image mentally to the distance an actual shopper would glance at a shelf from, not the close-up distance you're likely reviewing it at on a screen, and check whether the {{fixed_label_details}} are still legible at that implied distance — a mockup that only reads clearly when viewed close up hasn't actually tested shelf presence, it's tested close-up label legibility, which is a different and less useful question.

OUTPUT
One image showing the exact packaging design placed convincingly on a real-feeling retail shelf, legible enough at this angle and lighting that a stakeholder could judge its actual shelf presence.`,
    variables: [
      {
        name: 'packaging_description',
        description: `The packaging being mocked up.`,
        example: `a tall cylindrical protein powder tub, matte black with a bold lime-green logo band around the middle`,
        required: true,
      },
      {
        name: 'fixed_label_details',
        description: `The exact text and graphic elements that must render precisely.`,
        example: `the brand name "SURGE" in bold white sans-serif, "Whey Protein Isolate — Vanilla" beneath it, and a small lime-green checkmark icon`,
        required: true,
      },
      {
        name: 'shelf_context',
        description: `The specific retail category context for the shelf.`,
        example: `a sports-nutrition aisle in a big-box retail store, mid-shelf height`,
        required: true,
      },
      {
        name: 'category_context_detail',
        description: `What specifically makes this shelf recognizable as that category.`,
        example: `other protein-powder-style tubs of similar height, mostly in black and bright accent colors, typical of that aisle`,
        required: false,
      },
      {
        name: 'facing_and_position',
        description: `How many units are shown, their arrangement, and the camera's height and angle relative to the shelf.`,
        example: `a row of 4 identical facings side by side at mid-shelf height, camera roughly eye-level and centered on the middle two units, as if standing in the aisle about 4 feet away`,
        required: true,
      },
      {
        name: 'adjacent_products_note',
        description: `Guidance on the neighboring products shown.`,
        example: `generic tubs in red and blue with abstract logo shapes, clearly a different brand but not resembling any specific real competitor`,
        required: true,
      },
      {
        name: 'lighting_description',
        description: `The retail-aisle lighting to use.`,
        example: `flat overhead fluorescent-style lighting, slightly cool white balance, minimal shadow`,
        required: true,
      },
    ],
    targetTools: ['Flux.2'],
    tags: [
      'flux',
      'packaging-design',
      'retail-mockup',
      'shelf-presence',
      'product-visualization',
      'photorealism',
    ],
    whyItWorks: `Treating the printed label as a fixed detail to preserve, rather than a description the model is free to reinterpret, matters because packaging mockups have a much lower tolerance for text drift than almost any other Flux use case. A mockup meant to test whether "SURGE" reads clearly at shelf distance fails its entire purpose if the model renders a slightly different, still-plausible-looking brand name instead — naming fixed_label_details as its own explicit block, distinct from the general packaging description, signals which details cannot be treated as approximate.

The instruction to use a specific, recognizable category context rather than a generic empty shelf matters because shelf-presence testing is inherently comparative. A design only reads as "stands out" or "blends in" relative to what's actually next to it in that category, and a mockup on a blank or unrelated shelf can't answer the actual stakeholder question, which is how this design performs against real category conventions, not how it looks in isolation.

The guidance on adjacent products — plausible but not identifiably a specific real competitor — threads a genuine needle: too generic and the comparison test is meaningless, too specific and the mockup risks depicting an actual competitor's real trademarked packaging inaccurately, which is a problem for an internal review deck meant to represent the category honestly rather than misrepresent a specific rival's actual current design.

Specifying flat, retail-aisle lighting instead of dramatic studio lighting is the single biggest lever for whether the mockup reads as an honest shelf-presence test versus a hero ad shot. Flux's default instinct for "product on a shelf" still leans toward flattering, directional light, because that's the more common framing in its training data for product photography generally, and a stakeholder evaluating actual shelf visibility needs the unglamorous, evenly-lit version, not the best-case version.

Holding every variable except packaging_description and fixed_label_details constant across a set of competing design variants matters for the same reason a controlled experiment holds every condition fixed except the one being tested — a shelf mockup is being used here to answer a comparative design question, and any incidental difference in staging between variants introduces a confound that makes the stakeholder's read of "which design wins" unreliable, even if each individual mockup looks convincing on its own.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.2', date: '2026-07-30' }],
    changelog: [
      {
        date: '2026-07-30',
        note: `Initial publish, verified against Flux.2 for a category-specific retail-shelf packaging mockup with fixed label text.`,
      },
    ],
  },
  {
    slug: 'flux-1-dev-painterly-concept-art-illustration',
    category: 'flux',
    title: `Brief a painterly concept-art illustration on Flux.1 [dev], not a photograph`,
    description: `A non-photographic illustration brief for Flux.1 [dev] that steers the model firmly away from its strong default pull toward photorealism, using explicit medium, brushwork, and technique language to get a genuine painted concept-art look instead of a photo with a style filter over it.`,
    promptText: `SUBJECT AND SCENE
{{subject_and_scene}}

MEDIUM
This must render as {{medium}}, not a photograph and not a photorealistic digital render. State this as a positive fact about the image's actual material surface, since Flux's strong default lean toward photographic realism will otherwise reassert itself even after a style is named loosely — the medium has to be described as concretely as a camera and lens would be for a photo brief.

BRUSHWORK AND SURFACE
{{brushwork_description}}. Visible texture matching that brushwork should be evident across the image, especially in {{texture_focus_area}}, the way an actual painting shows the physical marks of how it was made.

COLOR PALETTE AND LIGHT
{{color_palette}}. Concept art typically commits to a much more limited, mood-driven palette than a photograph would — describe the two or three dominant colors and how light and shadow are handled within that limited range, rather than full photographic color fidelity.

REFERENCE STYLE
{{style_reference}}. Use this as a description of technique and sensibility — brush size, edge treatment, level of detail versus suggestion — not as an instruction to copy a specific living artist's identifiable signature style; describe the qualities that reference implies rather than naming it as the sole instruction.

COMPOSITION, FOCAL TREATMENT, AND FINISH
{{composition_and_finish_note}}. Concept art typically uses a clear focal hierarchy — one area rendered with real detail, the rest suggested with looser, more gestural marks — rather than the uniform sharp-everywhere detail a photographic brief would ask for, and it is often left with an intentionally unresolved edge or two rather than a fully finished border.

WHAT THE IMAGE SHOULD NOT LOOK LIKE
Because there is no negative-prompt field, state this positively: the entire image should read as the stated medium throughout, including the subject itself — no photographic skin texture, no camera lens characteristics such as bokeh or chromatic aberration or film grain, and no photorealistic material rendering anywhere in the frame.

IF THE RESULT STILL READS AS PHOTOGRAPHIC
If a first attempt still shows photographic lighting or material rendering underneath the named medium, that's a sign the medium and brushwork_description need to be described even more concretely rather than restated more emphatically — naming an additional specific technique detail (a described edge quality, a specific way highlights are rendered as flat color patches rather than a gradient) usually resolves this more reliably than simply repeating "not a photograph" a second time.

CHECK BEFORE FINALIZING
Look specifically at how highlights and reflections are rendered on any smooth or reflective surface in the scene — photographic rendering shows a smooth gradient falloff, while genuine painted media typically render a highlight as a distinct, separately-placed patch of lighter color with a harder edge, and this single detail is often the most reliable tell of whether the medium instruction actually took hold.

OUTPUT
One illustration that a viewer would immediately identify as painted or drawn concept art, not a photo run through a stylistic filter.`,
    variables: [
      {
        name: 'subject_and_scene',
        description: `The subject and setting for the illustration.`,
        example: `a lone airship drifting between towering red-rock canyon walls at dusk, tiny lights visible along its hull`,
        required: true,
      },
      {
        name: 'medium',
        description: `The specific physical or digital medium to imitate.`,
        example: `traditional gouache and ink concept art, painted on textured cold-press paper`,
        required: true,
      },
      {
        name: 'brushwork_description',
        description: `The specific brush or mark quality wanted.`,
        example: `visible loose, confident gouache brushstrokes with hard ink line reinforcement at key edges`,
        required: true,
      },
      {
        name: 'texture_focus_area',
        description: `Where the visible medium texture should be most evident.`,
        example: `the canyon rock faces and the sky, where large flat brush passes should be clearly readable`,
        required: false,
      },
      {
        name: 'color_palette',
        description: `The limited, mood-driven color scheme.`,
        example: `dominant burnt-orange and deep indigo, with the airship's small hull lights as the only warm-white accent`,
        required: true,
      },
      {
        name: 'style_reference',
        description: `A technique or sensibility reference, described qualitatively rather than as a name to copy.`,
        example: `the loose, confident brush economy and high-contrast silhouette work typical of golden-age film concept art, not a tight, airbrushed digital-painting finish`,
        required: true,
      },
      {
        name: 'composition_and_finish_note',
        description: `The focal hierarchy — what's rendered in detail versus suggested — plus any note on finish level.`,
        example: `the airship rendered with the most linework detail, the canyon walls suggested with broad, looser color shapes, and the frame's corners left with visible unfinished brush edges, the way a concept sketch intentionally doesn't resolve every edge`,
        required: true,
      },
    ],
    targetTools: ['Flux.1 [dev]'],
    tags: [
      'flux',
      'concept-art',
      'illustration',
      'non-photorealistic',
      'painterly-style',
      'flux-dev',
    ],
    whyItWorks: `Flux's entire training and architecture skew heavily toward photorealistic output — it is, across every published account, one of the strongest photorealism-focused image models available, which is exactly why getting a genuinely painterly, non-photographic result requires actively fighting that default rather than simply naming a style once. A loose instruction like "in the style of a painting" frequently still produces something with photographic lighting and material rendering underneath a thin painterly filter, because the model's strongest prior is photographic, and a single style word is not enough to override it.

Describing medium and brushwork with the same concrete specificity a camera-and-lens instruction would get in a photo brief — gouache on cold-press paper, visible loose brushstrokes with ink reinforcement — works for the same underlying reason camera specificity works for photorealism: Flux responds to concrete, describable physical characteristics far more reliably than to abstract style labels. Treating "painting" as a material with actual surface properties, not a filter, gives it something specific to actually render.

The composition_and_finish_note distinction — one area rendered in detail, the rest suggested loosely — targets a specific tell that separates real concept art from a photo-to-painting filter effect. Genuine concept art almost always has an intentional focal hierarchy where detail is spent economically, while Flux's photographic default instinct is to render every part of a scene with roughly uniform fidelity, the way a camera lens resolves a whole frame at once. Naming the focal hierarchy explicitly counteracts that uniform-detail default.

The instruction to treat a named style_reference as technique-and-sensibility rather than a literal copy instruction matters for two reasons at once: it produces a more genuinely varied, less derivative result than trying to imitate one specific artist's signature marks exactly, and it avoids directly targeting a living artist's identifiable style as the sole instruction, which is why the prompt reframes the reference as a description of qualities — brush size, edge treatment, detail-versus-suggestion — rather than a name to copy wholesale.`,
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.1 [dev]', date: '2026-07-31' }],
    changelog: [
      {
        date: '2026-07-31',
        note: `Initial publish, verified against Flux.1 [dev] for a gouache-and-ink concept-art brief with an explicit focal hierarchy and finish note.`,
      },
    ],
  },
]
