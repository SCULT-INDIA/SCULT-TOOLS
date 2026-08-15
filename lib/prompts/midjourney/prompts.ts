import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'midjourney-v7-natural-language-portrait-brief',
    category: 'midjourney',
    title: 'Write a natural-language editorial portrait brief for Midjourney V7',
    description:
      "A connected natural-language portrait brief — subject, pose, setting, light, and lens folded into one flowing description rather than a comma-stacked tag list — matched to how V7's parser actually reads a prompt, not how V6 rewarded keyword stuffing.",
    promptText: `SUBJECT
{{subject_description}}

POSE AND EXPRESSION
{{pose_and_expression}}, an expression that reads as caught mid-moment rather than posed for a camera, unless the subject line above specifically calls for direct eye contact.

SETTING
{{setting}}

LIGHT
{{lighting_description}}. Name the actual source and its direction rather than a mood adjective on its own — Midjourney renders a described source ("low winter sun through fog") far more convincingly than a floating quality tag like "cinematic lighting" that names no physical cause.

CAMERA AND LENS
Shot on {{camera_and_lens}}, {{depth_of_field_note}}.

MOOD
{{mood}}

SKIN AND MATERIAL HONESTY
Real skin has visible pores, uneven tone, and asymmetry; real fabric creases where a body actually bends it. Do not let the description drift toward smooth, airbrushed, or symmetrical — if that plastic look shows up in the grid, it is Midjourney's own beautification bias reasserting itself, not something this brief asked for.

WRITE THIS AS ONE CONNECTED DESCRIPTION
Combine the subject, pose, setting, light, and lens lines above into a single flowing paragraph, in that order, the way you would brief a photographer standing next to you — not as a list of disconnected fragments separated by commas with no relationship between them. V7 was retrained specifically to parse this kind of connected phrasing and use the relationship between clauses — this light, falling on this subject, doing this pose, in this setting — rather than treating each comma-separated fragment as an isolated, unrelated instruction competing for attention with every other fragment.

WHAT TO LEAVE OUT
Do not stack generic quality boosters — "8k," "hyperrealistic," "masterpiece," "highly detailed," "award-winning photography." These did real, measurable work nudging V5 and V6's keyword-matching behavior; on V7 they mostly do nothing useful, and stacking several at once can actively push the image toward an over-processed, over-sharpened look that fights the specific, grounded description already written above instead of reinforcing it.

IF THE FIRST GRID READS TOO SAFE OR TOO SIMILAR ACROSS ALL FOUR
Raise chaos on the next run rather than rewriting the description — chaos controls variation between the four grid images, not how literally any single one follows the text, so a same-feeling grid is a chaos problem, not a wording problem.

PARAMETERS
--ar {{aspect_ratio}} --stylize {{stylize_value}} --v 7

OUTPUT
The collapsed one-paragraph description above, followed directly by the parameter line, ready to paste into Midjourney as a single continuous prompt.`,
    variables: [
      {
        name: 'subject_description',
        description: 'Who is in the frame — age, build, and a defining physical detail.',
        example:
          'a weathered fisherman in his sixties with sun-creased skin, a grey beard, and a faded navy work jacket',
        required: true,
      },
      {
        name: 'pose_and_expression',
        description: 'What they are doing or how they are posed.',
        example:
          'standing at the bow of his boat, hands resting on the rail, looking toward the horizon',
        required: true,
      },
      {
        name: 'setting',
        description: 'Where the shot takes place.',
        example:
          'a foggy harbor at first light, moored boats fading into the mist behind him',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'The light source, its direction, and its quality.',
        example:
          'soft directional light from a low winter sun, cutting sideways through the fog',
        required: true,
      },
      {
        name: 'camera_and_lens',
        description:
          'A specific camera/lens pairing to anchor depth of field and rendering.',
        example: 'a Canon EOS R5 with an 85mm f/1.2 lens',
        required: true,
      },
      {
        name: 'depth_of_field_note',
        description: 'How shallow or deep the focus falloff should read.',
        example: 'shallow depth of field, the harbor behind him falling into soft blur',
        required: false,
      },
      {
        name: 'mood',
        description: 'The overall emotional register of the image.',
        example:
          'quiet, contemplative, documentary realism rather than a styled fashion shoot',
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '4:5',
        required: false,
      },
      {
        name: 'stylize_value',
        description:
          '--stylize, 0-1000. Keep this moderate for a photographic, non-painterly result.',
        example: '150',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'portrait-photography',
      'natural-language-prompting',
      'photorealism',
      'editorial',
    ],
    whyItWorks: `V7 was retrained to parse a full natural-language brief the way a human photographer would read a shot list, not a flat bag of isolated tags — this is the single largest prompting-behavior change from V6, and it is the reason this brief is written as connected clauses in a fixed order (subject, then pose, then setting, then light, then lens) rather than a comma-separated pile. On V6, stacking quality tags like "8k, hyperrealistic, masterpiece" reliably nudged output quality upward because the model was substantially keyword-matching; on V7 those same tags do measurably less and can actively fight the model's already-strong default realism by pulling it toward an over-processed, over-sharpened look nobody asked for. Writing the light as a named physical source with a direction, rather than a mood adjective floating with no cause, matters because V7 conditions on causal relationships between clauses — "low winter sun cutting through fog" tells it where the shadow falls and how the fog scatters that specific light, while "cinematic lighting" names an aesthetic category with no physical information to render from, so the model falls back on its most statistically common interpretation of that phrase instead of the scene actually described.

The skin-and-material-honesty instruction targets a real, well-documented default bias: left unguided, Midjourney's aesthetic training pulls portraits toward smoother, more symmetrical, more airbrushed skin than the photographic references the prompt is actually describing, because that beautified look is heavily overrepresented in the images the model was trained to consider "good." Naming the failure mode explicitly — visible pores, uneven tone, asymmetry, creased fabric — gives V7 a concrete target to render instead of letting its own aesthetic bias quietly override a documentary brief with a beauty-filter one.

Separating chaos from stylize in the guidance at the end closes the most common Midjourney parameter confusion directly: a grid of four images that all look too similar to each other is a chaos problem, since chaos governs variation between the four outputs in one grid, not how far any single image drifts from the literal prompt — which is stylize's job. Telling a user to raise chaos rather than rewrite the prompt when the grid feels repetitive saves an entire wasted generation cycle spent second-guessing wording that was never the actual lever.`,
    exampleOutput:
      'A single editorial-looking portrait matching the described subject, pose, and light — expect real photographic variation between the four grid options (skin texture, exact framing, micro-expression) rather than four near-identical copies, with the fog and lens character carrying through consistently.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-20' }],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, written and verified against Midjourney v7 as a connected natural-language brief.',
      },
    ],
  },
  {
    slug: 'midjourney-stylize-chaos-concept-art-exploration',
    category: 'midjourney',
    title: 'Dial in --stylize and --chaos to explore a concept-art idea space',
    description:
      'A concept-art brief paired with a deliberate --stylize/--chaos/--no recipe for controlling two genuinely different axes of a Midjourney generation: how far the model drifts from your literal words, and how varied the four grid images are from each other.',
    promptText: `SUBJECT AND SCENE
{{subject_and_scene}}

STYLE REFERENCE
{{style_reference}}

COLOR PALETTE
{{color_palette}}

WHAT STAGE OF EXPLORATION THIS IS
{{exploration_stage}}

STYLIZE SETTING FOR THIS STAGE
If this is an early, wide-net exploration pass, keep --stylize low to mid (100-250) so the four grid images stay close to what you actually typed, which matters because a high-stylize grid at this stage mostly shows you Midjourney's own aesthetic opinion, not your idea. If this is a later pass refining a direction you already like, raise --stylize toward 400-750 to let the model add painterly embellishment on top of a composition you have already chosen.

CHAOS SETTING FOR THIS STAGE
If you are still surveying how many different ways this idea could look, set --chaos high (40-80) so the four images genuinely diverge from each other instead of showing four near-identical variations of the same interpretation. Once you have picked a direction from a high-chaos grid, drop --chaos toward 0-10 on the next run so you get four refinable variations of that one direction instead of four more competing directions.

NEGATIVE ELEMENTS
--no {{negative_elements}}

ASPECT RATIO AND VERSION
--ar {{aspect_ratio}} --v 7

PARAMETERS
{{stylize_value}} and {{chaos_value}} chosen per the guidance above, combined into: --stylize {{stylize_value}} --chaos {{chaos_value}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

WORKFLOW ACROSS MULTIPLE RUNS
Treat this as a two-run process, not a one-shot prompt. Run one: high chaos, low-to-mid stylize, to survey the range of interpretations this subject and style reference could produce. Pick the single grid image whose composition and mood you want to develop further. Run two: same subject, scene, and style reference text, but chaos dropped near zero and stylize raised for the refinement pass — optionally add --seed with the number from the image you liked, so the second run's four variations stay recognizably related to the one you picked rather than drifting into a fifth new direction.

OUTPUT
A first grid built for range (four genuinely different interpretations of the idea), followed by a second grid built for depth (four close variations of the one interpretation worth developing).`,
    variables: [
      {
        name: 'subject_and_scene',
        description: 'The core subject and what is happening in the scene.',
        example:
          'a lone astronaut planting a small glowing sapling on a cracked red desert planet, twin moons rising',
        required: true,
      },
      {
        name: 'style_reference',
        description: 'An art style or artist-adjacent reference for the rendering.',
        example: 'matte-painting concept art, in the spirit of Simon Stålenhag',
        required: true,
      },
      {
        name: 'color_palette',
        description: 'The dominant colors of the scene.',
        example: 'dusty rust oranges against a deep indigo sky',
        required: true,
      },
      {
        name: 'exploration_stage',
        description:
          'Whether this run is a wide survey or a refinement of a chosen direction.',
        example:
          'early exploration — first pass, no direction chosen yet, want to see the range of possible moods for this scene',
        required: true,
      },
      {
        name: 'stylize_value',
        description:
          '--stylize, 0-1000, chosen per the exploration-stage guidance above.',
        example: '150',
        required: true,
      },
      {
        name: 'chaos_value',
        description: '--chaos, 0-100, chosen per the exploration-stage guidance above.',
        example: '60',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, extra limbs, human figures other than the astronaut',
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '16:9',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'concept-art',
      'stylize',
      'chaos',
      'negative-prompt',
      'parameter-tuning',
      'iteration-workflow',
    ],
    whyItWorks: `--stylize and --chaos control two genuinely different axes, and conflating them is the most common Midjourney parameter mistake. --stylize governs how much of Midjourney's own aesthetic bias overrides your literal description — low values (0-150) render close to what you typed, sometimes flatly; high values (500+) add painterly embellishment the model decided looks good, whether or not you asked for it. --chaos governs variation between the four images in a single grid, not how far any one image drifts from your words — low chaos gives four safe, similar takes on your idea; high chaos gives four genuinely different interpretations, which is the correct tool for surveying an idea space before committing to a direction, and the wrong tool for refining one you have already chosen, since high chaos at that stage just generates four new competing directions instead of four variations on the one you picked.

Splitting this into an explicit two-run workflow — high chaos to survey, then chaos near zero with a locked seed to refine — solves a real, wasteful default pattern: rewriting the prompt text after every grid that "doesn't feel right," when the actual problem was the chaos setting showing four unrelated directions instead of four takes on one direction. A concept artist who does not know to separate these two runs will burn far more generations chasing a wording fix for what was actually a parameter mismatch.

Carrying the seed number forward from the chosen image into the refinement run is what makes the second grid's four outputs feel like a family rather than four more random rolls — without it, dropping chaos to zero on a fresh, unseeded run still produces four images related to each other by the low chaos setting, but not necessarily related to the specific composition from the first grid that was worth developing further.

--no is Midjourney's genuine negative-prompt mechanism, not a wish stated in prose — unlike Flux or Nano Banana, whose diffusion or flow-matching processes have no negative-conditioning input at all, Midjourney's underlying model supports true negative conditioning, so --no text reliably suppresses text rather than being a phrase the model might just choose to ignore, and it stays useful at both high and low stylize settings since it operates independently of the stylize/chaos axes.`,
    exampleOutput:
      'A first 2x2 grid of concept-art images sharing the same subject and palette but genuinely diverging in mood and composition; after picking one and re-running with the seed locked and chaos near zero, a second grid of four close, refinable variations of that chosen direction.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Midjourney v7 with a two-run stylize/chaos/seed workflow.',
      },
    ],
  },
  {
    slug: 'midjourney-character-reference-consistent-comic-character',
    category: 'midjourney',
    title: 'Keep one character looking the same across comic panels with --cref',
    description:
      "A character-reference workflow using Midjourney's --cref and --cw parameters to hold a specific character's face and build consistent across multiple panels of a comic or storyboard, instead of re-describing them from scratch each time and getting a different-looking person in every panel.",
    promptText: `REFERENCE IMAGE
Start from one Midjourney-generated (or uploaded) image of the character that clearly shows their face and overall build — this becomes the anchor every later panel points back to. Its URL goes in {{character_reference_url}}.

CHARACTER DESCRIPTION FOR THIS PANEL
{{character_description}}

WHAT IS DIFFERENT IN THIS PANEL
{{panel_specific_action}} in {{panel_setting}}.

CHARACTER WEIGHT
--cw {{character_weight_value}} — this controls how much of the reference image --cref pulls from. --cw 100 (the default) matches face, hair, and clothing from the reference. Lower it toward --cw 0-50 if this panel needs the same face but a different outfit or pose the reference image doesn't show, since --cw 100 will otherwise try to carry the reference's clothing into a scene where it doesn't belong.

STYLE AND LINE CONSISTENCY
{{art_style}} — state this the same way in every panel's prompt, not just the character reference, since --cref locks the character's likeness but does nothing to keep the surrounding rendering style consistent panel to panel; that is a separate, ordinary text instruction you have to repeat every time.

WHAT TO AVOID
--no {{negative_elements}}

PARAMETERS
--cref {{character_reference_url}} --cw {{character_weight_value}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{character_description}}, {{panel_specific_action}}, in {{panel_setting}}, {{art_style}} --cref {{character_reference_url}} --cw {{character_weight_value}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

REPEAT FOR EVERY PANEL
Reuse the exact same {{character_reference_url}} value across every panel in the sequence — swapping it out for a new anchor image partway through a comic is the single most common cause of a character's face subtly drifting halfway through a story. Only the action, setting, and, when the outfit genuinely changes, the --cw value should differ between panels; the reference URL and the art-style line should not.`,
    variables: [
      {
        name: 'character_reference_url',
        description:
          "The image URL of the anchor image establishing this character's face and build.",
        example: 'https://cdn.midjourney.com/abc123-anchor-character.png',
        required: true,
      },
      {
        name: 'character_description',
        description: "The character's defining features, restated in every panel.",
        example:
          'a young woman with short copper hair, a scar above her left eyebrow, wearing a weathered brown leather jacket',
        required: true,
      },
      {
        name: 'panel_specific_action',
        description: 'What the character is doing in this specific panel.',
        example: 'crouching behind a rusted shipping container, peering around the edge',
        required: true,
      },
      {
        name: 'panel_setting',
        description: 'Where this specific panel takes place.',
        example: 'a rain-soaked shipping yard at night, sodium lights glowing overhead',
        required: true,
      },
      {
        name: 'character_weight_value',
        description:
          '--cw, 0-100. 100 matches face, hair, and clothing; lower values match only the face and features.',
        example: '100',
        required: true,
      },
      {
        name: 'art_style',
        description: 'The rendering style, restated identically in every panel.',
        example:
          'gritty ink-and-wash graphic novel style, heavy shadow, muted desaturated color',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, speech bubbles, watermark, extra fingers',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value, kept consistent across the panel sequence.',
        example: '16:9',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'character-reference',
      'cref',
      'comic-panels',
      'storyboard',
      'character-consistency',
    ],
    whyItWorks: `--cref conditions the generation on the actual visual features of a reference image — face structure, hair, general build — rather than on the text description of that character alone, which is the direct fix for the most common failure in multi-panel work: describing "a young woman with short copper hair and a scar" in five separate prompts and getting five plausibly-matching but visibly different faces, because Midjourney has no memory between generations and text descriptions alone are never specific enough to pin down a unique face across independent runs. Anchoring every panel to the identical reference image URL, rather than to the previous panel's output, matters because chaining reference images panel-to-panel compounds small drifts — each new image is a slightly different interpretation of the last one, and by panel five the character has visibly drifted from panel one. A single fixed anchor means every panel drifts from the same source by roughly the same small amount, instead of drifting cumulatively.

--cw is the parameter that resolves the single biggest practical complaint about character reference: it "sticks" the reference outfit onto every panel, even panels where the story calls for a costume change. --cw 100 matches face, hair, and clothing together, because Midjourney has no separate control for "match the face but not the shirt" — the actual lever is to lower --cw toward 0-50, which biases the match toward facial features and away from the specific clothing in the reference, letting the panel-specific outfit description in the prompt text take over instead of getting silently overridden by the reference image's outfit.

The instruction to restate the art-style line identically in every panel, rather than assuming --cref handles it, targets a real gap in what the parameter actually does: --cref is scoped to the character's likeness, not the surrounding rendering style, line weight, or color grading of the panel. Two panels can use the identical --cref value and --cw setting and still look like they were drawn by two different artists if the accompanying style text drifts even slightly between prompts — consistency of rendering style is achieved the ordinary way, by repeating the same words, not by any parameter.`,
    exampleOutput:
      'A sequence of panels where the same character — same face, same scar, same build — appears in different poses and settings, with clothing that follows the panel-specific description rather than defaulting back to the reference image once --cw is lowered for a costume change.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-24' }],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Midjourney v7 --cref/--cw for multi-panel character consistency.',
      },
    ],
  },
  {
    slug: 'midjourney-style-reference-brand-campaign-consistency',
    category: 'midjourney',
    title: 'Hold one visual style across a whole campaign with --sref',
    description:
      "A style-reference workflow using Midjourney's --sref and --sw parameters to keep color grading, lighting mood, and rendering texture consistent across a multi-asset social or ad campaign, so ten different scenes still read as one shoot.",
    promptText: `STYLE ANCHOR
One Midjourney-generated (or carefully chosen existing) image whose color grade, lighting mood, and overall rendering texture is exactly what the whole campaign should look like — not necessarily featuring the same subject as any individual asset, since --sref transfers style, not content. Its URL goes in {{style_reference_url}}.

WHAT THIS SPECIFIC ASSET SHOWS
{{asset_subject_and_scene}}

WHY THIS ASSET NEEDS TO MATCH THE OTHERS
{{campaign_context}}

STYLE WEIGHT
--sw {{style_weight_value}} — this controls how strongly --sref's color, light, and texture override the model's own default aesthetic for this subject. Start around 100-250 for a firm but not overpowering match; push toward 500-1000 only if lower values are still letting Midjourney's default look bleed through on a subject very different from the one in the reference image.

WHAT SHOULD NOT DRIFT BETWEEN ASSETS
{{style_locked_elements}} — name these explicitly here even though --sref is doing the heavy lifting, since calling out exactly what must not change (grain amount, color temperature, contrast level) gives you something concrete to check each new asset against rather than a vague "does it feel consistent" judgment call.

NEGATIVE ELEMENTS
--no {{negative_elements}}

PARAMETERS
--sref {{style_reference_url}} --sw {{style_weight_value}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{asset_subject_and_scene}} --sref {{style_reference_url}} --sw {{style_weight_value}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

REUSE ACROSS THE FULL ASSET SET
Every asset in this campaign should reuse the identical {{style_reference_url}} and a consistent {{style_weight_value}} — the subject line changes per asset, the style anchor does not. If an asset's subject is dramatically more or less detailed than the reference image's original subject (a tight product close-up versus a wide lifestyle scene), that asset alone may need a slightly higher --sw to keep the style from thinning out across a busier or emptier frame; note that adjustment explicitly if you make it, so the team building the next asset knows why one --sw value differs from the rest.`,
    variables: [
      {
        name: 'style_reference_url',
        description:
          'The image URL anchoring the campaign color grade, light, and texture.',
        example: 'https://cdn.midjourney.com/def456-style-anchor.png',
        required: true,
      },
      {
        name: 'asset_subject_and_scene',
        description: 'What this specific campaign asset actually depicts.',
        example:
          'a pair of hands tying the laces of a running shoe on a park bench at dawn',
        required: true,
      },
      {
        name: 'campaign_context',
        description:
          'The larger campaign this asset belongs to and why consistency matters.',
        example:
          'one of twelve social ad assets for a running-shoe launch, all needing to read as one cohesive shoot when scrolled past quickly in a feed',
        required: true,
      },
      {
        name: 'style_weight_value',
        description:
          '--sw, 0-1000. How strongly the reference style overrides the default look.',
        example: '200',
        required: true,
      },
      {
        name: 'style_locked_elements',
        description: 'The specific visual traits that must not vary asset to asset.',
        example:
          'warm dawn color temperature, visible film grain, slightly desaturated shadows, soft contrast — no punchy commercial HDR look on any asset',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, logos, watermark, competitor branding',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description:
          'Midjourney --ar value, matched to the specific placement for this asset.',
        example: '4:5',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'style-reference',
      'sref',
      'brand-consistency',
      'campaign-creative',
      'ad-creative',
    ],
    whyItWorks: `--sref conditions a generation on the color grade, lighting character, and rendering texture of a reference image while leaving the subject matter entirely to the text prompt — this is the mechanical reason it works for a campaign of visually different scenes: a close product shot and a wide lifestyle shot can share the exact same --sref value and come out feeling like they were shot by the same photographer on the same roll of film, even though the reference image itself might show neither scene. Without --sref, each asset's color grade and mood is instead determined independently by Midjourney's own default aesthetic reacting to that specific subject and text, which is why a campaign built from ten separately-worded prompts with no shared style anchor routinely comes back looking like ten different photographers' work, however carefully each individual prompt was written.

--sw is the dial that solves the real failure mode of a style reference thinning out: a subject very different in composition or busyness from the reference image's original subject can pull the generation back toward Midjourney's default look even with --sref applied, especially at low --sw values, because the model is still balancing the reference style against its own strong aesthetic priors for that kind of scene. Raising --sw specifically for an outlier asset — a much busier or much emptier frame than the rest of the set — is the correct, targeted fix, rather than rewriting that one asset's text prompt to try to talk the model out of its own defaults.

Naming the specific traits that must not drift — color temperature, grain, contrast — turns "does this feel consistent" from a subjective, easy-to-miss judgment call into a short checklist a reviewer can actually verify asset by asset. This matters in practice because style drift across a large asset set is rarely dramatic in any single image; it is usually a slow accumulation of slightly warmer color, slightly less grain, slightly punchier contrast from one asset to the next, each individually unnoticeable and collectively obvious once all twelve assets sit next to each other in a campaign deck. A named checklist catches that drift asset by asset, before the full set is assembled and the problem becomes expensive to fix.`,
    exampleOutput:
      'A set of campaign images with different subjects and compositions that all share the same warm dawn color temperature, grain level, and contrast curve from the style anchor — recognizable as one shoot when placed side by side in an ad set.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-27' }],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Midjourney v7 --sref/--sw for multi-asset campaign consistency.',
      },
    ],
  },
  {
    slug: 'midjourney-omni-reference-product-across-scenes',
    category: 'midjourney',
    title: 'Carry one specific object into different scenes with --oref',
    description:
      "An omni-reference workflow using Midjourney V7's --oref/--ow parameters to keep a specific physical object — a product, a prop, a mascot — visually identical across a set of different environments, without --cref's face-and-clothing bias or --sref's style-only scope.",
    promptText: `OBJECT REFERENCE
One clear image of the specific object that must stay visually identical across every generated scene — the exact product, prop, or mascot, ideally photographed or rendered plainly with nothing else in frame. Its URL goes in {{object_reference_url}}.

OBJECT DESCRIPTION
{{object_description}} — restate this in every scene's prompt even though --oref is carrying the visual reference, since the text description still anchors what the model believes it is looking at.

SCENE THIS OBJECT APPEARS IN
{{scene_description}}

WHY THIS OBJECT NEEDS TO STAY IDENTICAL
{{consistency_reason}}

OBJECT WEIGHT
--ow {{object_weight_value}} — this controls how strongly --oref's visual reference overrides the model's own interpretation of the object as described in text. Start around 100-300 for a firm match; if the object has fine, specific detail that keeps getting smoothed over or reinterpreted (a specific label design, an unusual shape), push --ow higher rather than adding more adjectives to the text description, since the reference image already contains that detail more precisely than words can.

DIFFERENCE FROM CHARACTER AND STYLE REFERENCE
--oref exists specifically because --cref is tuned for faces and biases toward matching clothing along with the face, and --sref transfers a color-and-light style but ignores object shape entirely — neither is right for holding a specific inanimate object's exact geometry and surface detail steady while the scene, lighting, and framing around it change freely from shot to shot.

WHAT TO AVOID
--no {{negative_elements}}

PARAMETERS
--oref {{object_reference_url}} --ow {{object_weight_value}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{object_description}} in {{scene_description}} --oref {{object_reference_url}} --ow {{object_weight_value}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

REPEAT FOR THE FULL SET OF SCENES
Reuse the identical {{object_reference_url}} across every scene in the set, and check each new result specifically for shape and proportion drift on the object itself before checking anything else about the scene around it — a lighting mismatch is easy to fix later in editing, but a subtly wrong object shape means the reference weight or reference image needs adjustment before generating the rest of the set.`,
    variables: [
      {
        name: 'object_reference_url',
        description:
          'The image URL of the specific object that must stay visually identical.',
        example: 'https://cdn.midjourney.com/ghi789-product-reference.png',
        required: true,
      },
      {
        name: 'object_description',
        description: 'A precise text description of the object, restated in every scene.',
        example:
          'a matte-black ceramic pour-over coffee dripper with a walnut wood collar and a small embossed logo on the base',
        required: true,
      },
      {
        name: 'scene_description',
        description:
          'The environment and context this specific generation places the object in.',
        example:
          'resting on a rustic wooden picnic table at a farmers market, morning sun and blurred stalls behind it',
        required: true,
      },
      {
        name: 'consistency_reason',
        description: 'Why this object specifically must not change shape between scenes.',
        example:
          'this is a real product for a hero-image set across five different lifestyle placements, and any shape drift would misrepresent what a customer actually receives',
        required: true,
      },
      {
        name: 'object_weight_value',
        description:
          '--ow, roughly 0-1000. How strongly the reference overrides text interpretation.',
        example: '250',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, a second unit of the product, hands touching it',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '4:5',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'omni-reference',
      'oref',
      'product-consistency',
      'v7-features',
      'object-reference',
    ],
    whyItWorks: `--oref was added in V7 specifically to close a gap the two earlier reference types left open: --cref's matching logic is tuned around faces and, at its default weight, pulls clothing along with the face, which is the wrong bias for an inanimate object with no face at all — and --sref transfers color grading and lighting texture while explicitly not caring about object shape, so it will happily give five scenes the same warm color grade while rendering five subtly different bottle shapes. Neither reference type was built to answer the actual question a product or prop set needs answered — "keep this exact geometry and surface detail identical while everything else in the frame changes freely" — which is precisely the narrow job --oref does and the other two do not.

Restating the object's text description in every scene even though the reference image is doing the visual work matters because --oref, like the other reference types, blends a visual signal with the text prompt rather than replacing the text prompt outright; if the text description drifts or gets vague across scenes ("a coffee dripper" in one prompt, "a ceramic pourover thing" in the next), the model has two competing signals about what it's looking at instead of one reinforcing pair, and inconsistency creeps back in even with an identical reference image and --ow value.

--ow's role in fixing fine detail — a specific label design, an unusual proportion — rather than adding more descriptive adjectives to the text addresses a real limitation of language as a specification format: a reference image already contains the exact curve of a handle or the precise placement of a logo far more precisely than any string of adjectives could describe it, so when a detail keeps getting smoothed over or subtly reinterpreted across generations, the fix is turning up how much the model trusts the image it already has, not writing a longer paragraph trying to out-describe a photograph.

The instruction to check for shape and proportion drift on the object first, before evaluating the rest of the scene, reflects where the actual risk concentrates in this workflow — lighting and background composition vary naturally and acceptably from shot to shot by design, since that variation is the entire point of placing one consistent object into different scenes, but any drift in the object's own geometry is the one failure that defeats the reason --oref was used in the first place, and it is easy to miss if a reviewer's attention goes first to the more visually obvious background instead.`,
    exampleOutput:
      'A set of scenes where the coffee dripper keeps its exact shape, proportion, and logo placement across a market stall, a kitchen counter, and a studio shot, with lighting and background varying naturally scene to scene as intended.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-29' }],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Midjourney v7 --oref/--ow for product-object consistency across scenes.',
      },
    ],
  },
  {
    slug: 'midjourney-multiprompt-weighted-concept-blend',
    category: 'midjourney',
    title: 'Blend two distinct concepts with explicit multi-prompt weights',
    description:
      'A multi-prompt (::) recipe for deliberately fusing two named concepts — a creature hybrid, a two-culture architectural style, a genre mashup — with explicit numeric weights, instead of writing one blended sentence and hoping Midjourney splits its attention the way you intended.',
    promptText: `FIRST CONCEPT
{{concept_a}}

SECOND CONCEPT
{{concept_b}}

WHAT KIND OF BLEND THIS IS
{{blend_relationship}} — state plainly whether this is a physical hybrid (one creature/object with traits from both), a stylistic fusion (one subject rendered through the visual language of two different traditions), or a compositional pairing (both concepts present in one frame, interacting) — multi-prompt weighting behaves differently depending on which of these you actually mean, and being explicit about which one prevents a blend that reads as neither.

WEIGHT BALANCE
{{weight_ratio}} — a roughly equal split (1::1) treats both concepts as co-dominant; an uneven split (3::1) treats the first as the dominant subject with the second folded in as a strong secondary influence rather than an equal partner. Pick the ratio based on which concept should visually lead.

SHARED SETTING AND STYLE
{{shared_context}} — this part is not split by :: and should not repeat either concept's name, since anything stated outside the weighted segments applies evenly to the whole image regardless of the weight split.

MULTI-PROMPT SYNTAX
{{concept_a}}::{{weight_a}} {{concept_b}}::{{weight_b}} {{shared_context}}

WHAT TO AVOID
--no {{negative_elements}}

PARAMETERS
--ar {{aspect_ratio}} --v 7

OUTPUT
{{concept_a}}::{{weight_a}} {{concept_b}}::{{weight_b}} {{shared_context}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

IF THE BLEND COLLAPSES TO ONE CONCEPT
If the result looks like concept A with only a token nod to concept B (a color, a texture) rather than a genuine fusion, the weight ratio was too uneven for what you actually wanted — move it toward 1::1 and re-run rather than adding more adjectives describing concept B, since the imbalance is a weighting problem, not a description problem. If the result looks like two separate things awkwardly touching in one frame rather than a true hybrid, the blend relationship you actually wanted was probably a physical hybrid, not a stylistic fusion — restate {{blend_relationship}} explicitly and re-run.`,
    variables: [
      {
        name: 'concept_a',
        description: 'The first concept in the blend.',
        example: 'a red fox',
        required: true,
      },
      {
        name: 'concept_b',
        description: 'The second concept in the blend.',
        example: 'a stained-glass cathedral window',
        required: true,
      },
      {
        name: 'blend_relationship',
        description: 'What kind of fusion this actually is.',
        example:
          'a physical hybrid — a fox whose fur and body markings are made of stained glass panels, translucent and lit from within, not a fox standing near a window',
        required: true,
      },
      {
        name: 'weight_ratio',
        description: 'Which concept should visually lead, and by how much.',
        example:
          '2::1, fox anatomy leading, stained-glass as the surface material rather than a co-equal subject',
        required: true,
      },
      {
        name: 'weight_a',
        description: 'The numeric weight assigned to the first concept.',
        example: '2',
        required: true,
      },
      {
        name: 'weight_b',
        description: 'The numeric weight assigned to the second concept.',
        example: '1',
        required: true,
      },
      {
        name: 'shared_context',
        description: 'Setting, lighting, and style that apply evenly to the whole image.',
        example:
          'standing in a dark forest clearing at dusk, light glowing outward from within its own body',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example:
          'text, watermark, a literal window frame, actual glass shards on the ground',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '1:1',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'multi-prompt',
      'concept-blending',
      'weighted-prompting',
      'creature-design',
      'parameter-tuning',
    ],
    whyItWorks: `Midjourney's :: syntax splits a prompt into separately-weighted segments the model optimizes toward independently before combining them, which is mechanically different from writing one unified sentence describing a hybrid — a single sentence like "a fox made of stained glass" asks the model to satisfy one combined description as best it can, while concept_a::2 concept_b::1 explicitly tells it how much relative attention each named concept deserves in the final composition. This distinction matters most exactly when a plain-sentence blend keeps collapsing toward one concept dominating with only superficial nods to the other — a common failure because a single sentence gives the model no explicit signal about which noun should structurally dominate versus which should just flavor the surface, so it defaults to whichever concept is more common in its training data for that kind of scene.

Separating "what kind of blend this is" from the weighting itself targets a distinct, often-overlooked failure: even a correctly weighted multi-prompt produces a different-looking result depending on whether the intended blend is a physical hybrid, a stylistic fusion, or a compositional pairing, and the :: syntax alone does not disambiguate which one was meant — it only controls relative emphasis, not the nature of the relationship between the two weighted concepts. Two users running the identical fox::2 stained-glass window::1 prompt with different unstated assumptions about which blend type they wanted will judge the same output completely differently — one calling it a success, the other calling it a failure — because the ambiguity was never in the weights, it was in an assumption neither of them wrote down.

The diagnostic guidance for when a blend collapses toward one side, versus when it reads as two things merely touching, gives a concrete, checkable next step instead of the usual response to a disappointing multi-prompt result — rewriting the whole prompt from scratch. A collapse toward one concept is specifically a weight-ratio problem, correctable by moving the ratio toward 1::1 without touching a single word of description; a juxtaposition-instead-of-fusion problem is specifically a blend-relationship problem, correctable by restating what kind of merge was intended. Treating these as two different, separately diagnosable failure modes — rather than one generic "the blend didn't work" bucket — is what turns multi-prompt experimentation from trial-and-error into a workflow with an actual next step after a disappointing grid.`,
    exampleOutput:
      'An image where fox anatomy structurally dominates the silhouette and pose, with stained-glass panel texture, leading, and internal glow replacing fur across the body — a genuine hybrid rather than a fox posed near a window, with the 2::1 weighting visibly favoring the fox as the leading form.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Midjourney v7 multi-prompt (::) weighted concept blending.',
      },
    ],
  },
  {
    slug: 'midjourney-permutation-prompt-icon-batch-set',
    category: 'midjourney',
    title: 'Batch-generate a themed icon or sticker set with permutation prompts',
    description:
      'A permutation-prompt ({}) recipe for submitting one job that fans out into a full set of themed variants — icon colors, sticker characters, product flavors — in a single queued batch, instead of manually retyping and resubmitting a near-identical prompt for every variant.',
    promptText: `SHARED CONCEPT
{{shared_concept}} — this part of the prompt stays identical across every variant in the set and should carry all the description that must not change between them.

WHAT VARIES ACROSS THE SET
{{variant_list}} — this is the exact list of items Midjourney will substitute one at a time into the permutation bracket, generating one full job per item in the list.

WHERE THE VARIATION SITS IN THE SENTENCE
{{variant_slot}} — place the permutation bracket exactly where the varying word belongs grammatically in the sentence, since Midjourney inserts each list item literally into that position; a badly placed bracket produces a grammatically broken prompt for every single variant in the set, not just one.

STYLE LOCK ACROSS THE SET
{{consistent_style}} — restate this identically for every variant since permutation prompts do not add any extra consistency beyond what the shared, non-bracketed text already provides; a set is only as visually cohesive as the shared wording around the bracket.

NEGATIVE ELEMENTS
--no {{negative_elements}}

PERMUTATION SYNTAX
{{shared_concept}} {shared_concept_before}{{variant_list}}{shared_concept_after}, {{consistent_style}}

PARAMETERS
--ar {{aspect_ratio}} --v 7

OUTPUT
A single submitted prompt containing the {a, b, c} permutation bracket, which Midjourney splits into one separate job per listed item — each job returns its own full grid, and each job separately consumes one Fast-GPU-hour job slot, so a five-item list produces five full jobs from one submission, not one job with five results inside it.

BEFORE SUBMITTING A LARGE SET
Count the items in {{variant_list}} and multiply by the number of jobs that will actually be queued — permutation prompts are a convenience for not retyping the shared text, not a way to generate more images for the same cost. If the set is large, run one single test variant outside the bracket first to confirm the shared wording and style lock actually produce what you want, then submit the full permutation set once the wording is confirmed rather than debugging wording across an entire batch of queued jobs.`,
    variables: [
      {
        name: 'shared_concept',
        description: 'The description that stays identical across every variant.',
        example:
          'a minimalist flat-icon design of a single object, centered, on a plain white background',
        required: true,
      },
      {
        name: 'variant_list',
        description: 'The comma-separated list of items to substitute, one per job.',
        example: 'a coffee cup, a croissant, a rolling pin, a whisk, a teapot',
        required: true,
      },
      {
        name: 'variant_slot',
        description: 'Where in the sentence the varying item belongs grammatically.',
        example:
          'directly after "of" and before the rest of the description, since the object name is the subject of the icon',
        required: true,
      },
      {
        name: 'consistent_style',
        description: 'The rendering style restated identically for every variant.',
        example:
          'thin 2px outline, single accent color of warm terracotta, no gradients, no shadow',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, background texture, drop shadow',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value, typically square for icon work.',
        example: '1:1',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'permutation-prompts',
      'batch-generation',
      'icon-design',
      'workflow-automation',
    ],
    whyItWorks: `Permutation prompts using curly-brace syntax are Midjourney's mechanism for submitting one prompt that expands into multiple independent jobs at submission time — each item inside the braces produces its own full job with its own grid, which is a genuinely different thing from writing one prompt describing "a set of five kitchen icons" and hoping the model composes all five into a coherent single image or a tidy uniform batch on its own; it will not reliably do either, because a single generation has no concept of producing a deliberately matched series. Splitting the variation out into an explicit list is what actually guarantees five separate, individually-clean icon generations rather than one crowded attempt to render five objects into a single frame.

Placing the bracket in the exact grammatical slot where the varying word belongs matters more than it looks like it should, because Midjourney performs a literal text substitution — it drops each list item into that exact position in the sentence with no grammatical adjustment, so a bracket placed one word too early or late produces an awkward or broken sentence for every single variant in the batch simultaneously, not just a cosmetic issue in one job. Since fixing this after submission means re-running the entire set, catching it before submitting is the only cheap fix.

The instruction to restate the style-lock text identically across the shared portion of the prompt, rather than assuming the permutation mechanism itself enforces consistency, targets a real misunderstanding of what {} actually does: it only avoids retyping the prompt five separate times — it adds no additional visual-consistency guarantee beyond whatever the non-bracketed shared text already specifies. A permutation set with vague, unstated shared styling produces five icons that vary in ways nobody intended (one flat, one with a gradient, one with a drop shadow) purely because "the rest of the prompt was identical" was never actually true in a way that constrained line weight or shadow treatment.

The pre-submission test-run guidance exists because permutation prompts multiply cost and queue time by the list's length, not by one flat job cost — a five-item list is five full jobs, each burning its own generation budget, so debugging wording after submitting a fifteen-item batch is fifteen times more expensive than catching a wording problem in one exploratory job first and then expanding the confirmed wording into the full permutation set.`,
    exampleOutput:
      'Five separate job grids returned from one submission — a coffee cup icon, a croissant icon, a rolling pin icon, a whisk icon, and a teapot icon — each sharing the identical thin-outline, terracotta-accent, no-shadow style, differing only in the depicted object.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-31' }],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Midjourney v7 permutation-prompt batch generation for icon sets.',
      },
    ],
  },
  {
    slug: 'midjourney-seamless-tile-pattern-design',
    category: 'midjourney',
    title: 'Design a seamless repeating pattern with --tile',
    description:
      'A --tile-parameter recipe for generating a genuinely repeatable textile, wallpaper, or packaging pattern from Midjourney — edges that actually line up when tiled, not just a busy image that happens to look pattern-like in a single frame.',
    promptText: `MOTIF
{{motif_description}}

REPEAT LOGIC
{{repeat_style}} — state explicitly whether the motif should repeat as an obvious grid, a loosely scattered organic distribution, or a directional flow (diagonal, radiating), since --tile only guarantees the edges connect seamlessly, not that the internal repeat logic reads as intentional rather than accidental.

COLOR PALETTE
{{color_palette}} — pulled from a locked hex set if this pattern needs to match an existing brand or product line exactly, since Midjourney's own color interpretation of a named color ("forest green") will vary generation to generation more than a stated hex code will.

DENSITY AND SCALE
{{density_and_scale}} — how large the motif reads relative to the frame, and how much negative space sits between repeats; a pattern description with no stated density defaults to Midjourney's own judgment, which trends busier and more filled-in than most textile and wallpaper use cases actually want.

SURFACE THIS WILL BE PRINTED ON
{{intended_surface}} — naming the real end use (fabric weight, wallpaper, box packaging) steers the rendering style even though it will not appear literally in the output; a pattern meant for a heavy canvas tote reads differently from one meant for a delicate silk scarf, and stating the target surface nudges line weight and texture toward that context.

WHAT TO AVOID
--no {{negative_elements}}

TILE PARAMETER
--tile — this is what makes the specific left/right and top/bottom edges of the generated square actually connect without a visible seam when the image is repeated; omitting it produces a pattern-styled single image that will show an obvious seam line the moment it is tiled.

PARAMETERS
--tile --ar {{aspect_ratio}} --v 7

OUTPUT
{{motif_description}}, {{repeat_style}}, {{color_palette}}, {{density_and_scale}}, {{intended_surface}} --no {{negative_elements}} --tile --ar {{aspect_ratio}} --v 7

VERIFYING THE TILE ACTUALLY WORKS
Before using the result in production, duplicate the downloaded image into a 2x2 or 3x3 grid in any image editor and zoom in on the internal seams where the tiles meet. --tile guarantees no hard seam at the true image edges, but a motif with strong directional flow or an off-center focal element can still read as visibly repeating in an unintended way once tiled — that is a design problem in {{repeat_style}} to revise, not a --tile failure to debug.`,
    variables: [
      {
        name: 'motif_description',
        description: 'The core recurring visual element of the pattern.',
        example: 'small hand-drawn botanical sprigs of eucalyptus leaves',
        required: true,
      },
      {
        name: 'repeat_style',
        description:
          'How the motif is distributed across the repeat — grid, scattered, or directional.',
        example:
          'loosely scattered, organic, no visible grid alignment, varied rotation per sprig',
        required: true,
      },
      {
        name: 'color_palette',
        description: 'The exact colors, ideally locked to hex codes for brand matching.',
        example:
          '#4A5D45 (muted sage), #F5F0E6 (warm off-white background), #C9A66B (occasional warm brass accent)',
        required: true,
      },
      {
        name: 'density_and_scale',
        description:
          'How large the motif reads and how much negative space surrounds each repeat.',
        example:
          'small scale, generous negative space, motifs occupying roughly 20% of the visible area',
        required: true,
      },
      {
        name: 'intended_surface',
        description: 'The real end-use surface, to steer line weight and texture.',
        example:
          'a lightweight cotton scarf, delicate fine-line rendering rather than bold block print',
        required: false,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, a visible grid line, drop shadow beneath the motifs',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value — square is standard for tileable patterns.',
        example: '1:1',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'seamless-pattern',
      'tile',
      'textile-design',
      'surface-pattern',
      'repeat-design',
    ],
    whyItWorks: `--tile is a specific, checkable technical guarantee, not a style descriptor: it constrains the generation so the pixels along the top edge match the pixels along the bottom edge, and the pixels along the left edge match the pixels along the right edge, which is what actually allows the square to repeat without a visible seam line when placed edge to edge. Describing a scene as "a seamless repeating pattern" in plain text without the --tile parameter produces an image that looks pattern-like within its own single frame but has no such edge-matching guarantee — the moment it is tiled, the seam where each copy meets the next is usually obvious, because nothing about ordinary text description constrains edge pixels the way the parameter does.

Locking the color palette to specific hex codes rather than named colors matters more here than in most single-image use cases, because a surface pattern is judged by how it looks repeated across an entire bolt of fabric or roll of wallpaper — a subtle shift in what "forest green" means from one generation to the next is invisible in a single test swatch but becomes a visible, expensive color-matching problem once a pattern needs to be regenerated or extended and the new batch doesn't quite match the first.

Naming the intended surface — heavy canvas versus delicate silk — works the same way naming a specific camera and lens works in photography prompts: Midjourney has no literal concept of fabric weight, but the phrase still steers it toward a learned association between that kind of object and a corresponding rendering style, line weight, and level of textural detail, producing a meaningfully different result than the same motif with no stated end use.

The verification step — physically tiling the downloaded image into a 2x2 or 3x3 grid before production use — exists because --tile solves exactly one problem (edge-pixel continuity) and not a second, related problem (whether the internal repeat logic reads as intentional once multiplied). A motif with a strong directional flow or an off-center focal point can have a perfectly seamless edge match and still create an obvious, unwanted secondary pattern — a visible diagonal streak, a repeating cluster — once tiled several times over, which only shows up once you actually build the tiled grid and step back from it, not by inspecting the single source square alone.`,
    exampleOutput:
      'A single square image of scattered eucalyptus sprigs in sage and brass on an off-white ground that, when tiled 3x3 in an image editor, shows no visible seam at any internal edge and reads as one continuous organic field rather than nine repeated squares.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-08-02' }],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Midjourney v7 --tile for seamless surface-pattern design.',
      },
    ],
    relatedToolSlug: 'color-palette-generator',
  },
  {
    slug: 'midjourney-weird-parameter-surreal-exploration',
    category: 'midjourney',
    title: 'Push into deliberately unusual territory with --weird',
    description:
      'A surreal/abstract exploration brief using --weird to intentionally invite the strange, uncanny compositional choices Midjourney otherwise smooths away by default — for concept art, album covers, and creative work that specifically wants the unexpected rather than the safe, pleasing default.',
    promptText: `SUBJECT AND STARTING POINT
{{subject_and_scene}} — describe this as a normal, grounded scene first; --weird's job is to push the model's interpretation of it sideways, not to replace a clear starting description with vague, already-strange language that gives the model nothing stable to distort.

WHAT KIND OF STRANGENESS
{{strangeness_direction}} — name a direction even loosely, since --weird alone with no directional hint in the text pushes toward Midjourney's own default idea of unusual, which trends toward a specific, recognizable "weird Midjourney" aesthetic rather than the particular flavor of strange this project actually wants.

WEIRD VALUE
--weird {{weird_value}} — low values (250-750) nudge composition and proportion into slightly uncanny territory while the subject stays recognizable; high values (1500-3000) can abandon recognizable subject matter almost entirely in favor of pure abstract or surreal form, so match the value to how far from "still clearly the subject" this piece is meant to go.

INTERACTION WITH STYLIZE
{{stylize_note}} — --weird and --stylize compound rather than cancel each other out: high stylize alone pushes toward Midjourney's polished, painterly default, and adding high --weird on top pushes that same polished rendering into stranger territory, so a genuinely unhinged result usually needs both raised together, not --weird alone at a moderate stylize.

COLOR AND ATMOSPHERE
{{color_and_mood}}

WHAT TO AVOID
--no {{negative_elements}}

PARAMETERS
--weird {{weird_value}} --stylize {{stylize_value}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{subject_and_scene}}, {{strangeness_direction}}, {{color_and_mood}} --no {{negative_elements}} --weird {{weird_value}} --stylize {{stylize_value}} --ar {{aspect_ratio}} --v 7

IF THE RESULT ISN'T STRANGE ENOUGH, OR TOO STRANGE
Raise --weird in increments of roughly 500 rather than jumping straight to the maximum — the transition from "recognizable but uncanny" to "abstract and unrecognizable" is not linear, and a large single jump often skips past the specific in-between quality most surreal creative work is actually going for. If the subject has become fully unrecognizable and that's not the goal, drop --weird back down before touching the text description — the text was never the source of the problem.`,
    variables: [
      {
        name: 'subject_and_scene',
        description:
          'A clear, grounded starting description before any distortion is applied.',
        example: 'a formal dining table set for six, viewed from directly above',
        required: true,
      },
      {
        name: 'strangeness_direction',
        description:
          'A rough direction for what kind of unusual this should lean toward.',
        example:
          'the table setting subtly wrong in scale and proportion, as if seen in a fading dream',
        required: true,
      },
      {
        name: 'weird_value',
        description: '--weird value, roughly 0-3000.',
        example: '800',
        required: true,
      },
      {
        name: 'stylize_value',
        description:
          '--stylize value, since it compounds with --weird rather than working independently.',
        example: '400',
        required: true,
      },
      {
        name: 'stylize_note',
        description:
          'A one-line reminder of how stylize and weird are being combined for this piece.',
        example:
          'raising both together for a fully unhinged, polished-but-uncanny result',
        required: false,
      },
      {
        name: 'color_and_mood',
        description: 'Color palette and emotional register.',
        example:
          'muted sepia and dusty rose, an unsettling quiet rather than anything violent or gory',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, gore, body horror',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '1:1',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'weird-parameter',
      'surreal-art',
      'abstract-art',
      'creative-exploration',
      'parameter-tuning',
    ],
    whyItWorks: `--weird works by turning up the model's willingness to depart from its own most statistically typical rendering of a described subject — it is the parameter most directly opposed to Midjourney's default aesthetic pull toward the safe, pleasing, expected composition, which is exactly why creative work that wants the uncanny or surreal needs it explicitly named rather than hoping a vaguely strange text description gets there alone. A text prompt alone, however unusually worded, is still filtered through the model's default preference for a coherent, appealing image; --weird is the lever that actually loosens that preference rather than merely asking for strangeness within it.

Insisting on a clear, grounded starting description rather than already-strange language addresses a real trap in this kind of prompting: if the text itself is vague or already surreal ("something dreamlike and off"), --weird has nothing stable to distort, and the model has no clear baseline to push sideways from — the strangest, most interesting outputs almost always come from applying --weird to a description that is otherwise completely ordinary and legible, because the contrast between the mundane subject and the distorted rendering is what actually reads as uncanny, rather than a description that was already vague producing an equally vague, unfocused "weird" result.

Naming the interaction between --weird and --stylize directly addresses a common miscalibration: since they compound rather than operate on separate, unrelated axes, a user expecting maximum strangeness from --weird 3000 alone at a low or default stylize gets a stranger-but-still-fairly-literal result, because stylize is what pushes the rendering toward Midjourney's polished painterly aesthetic in the first place — without that polish also cranked up, there's a smaller aesthetic baseline for the weirdness to distort, and the combined effect reads as noticeably weaker than raising both together.

The incremental-adjustment guidance — moving in steps of roughly 500 rather than jumping to the extreme — reflects that the journey from "recognizable but uncanny" to "abstract and unrecognizable" is not a smooth, linear slide; there is a real middle zone most surreal creative briefs are actually aiming for, and a single large jump in --weird value tends to skip straight past that zone into either "barely different from normal" or "completely abstracted," missing the specific in-between quality that makes deliberate weirdness feel intentional rather than either timid or chaotic.`,
    exampleOutput:
      'A dining table setting that is recognizably still a dining table setting, but with subtly wrong proportions, an uncanny stillness, and slightly warped perspective that reads as dreamlike rather than glitched or broken — distinct in character from a low-weird, high-stylize result that would look merely painterly rather than strange.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-08-03' }],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Midjourney v7 --weird for controlled surreal exploration.',
      },
    ],
  },
  {
    slug: 'midjourney-style-raw-literal-architecture-interior',
    category: 'midjourney',
    title:
      'Get literal, unembellished architecture and interior renders with --style raw',
    description:
      "A --style raw brief for architectural and interior visualization where Midjourney's default painterly beautification actively works against the brief — real estate, portfolio, and pitch renders that need to look like the actual space, not an idealized painting of it.",
    promptText: `SPACE AND LAYOUT
{{space_description}}

MATERIALS
{{materials_and_finishes}} — name the actual materials, not just a style category; Midjourney's default rendering tends to generalize "modern kitchen" into its own idea of what that means, while naming the specific countertop stone, cabinet finish, and flooring material forces it to render those materials specifically rather than a generic stand-in for the category.

LIGHT SOURCE
{{lighting_description}} — state whether this is daylight through a specific window arrangement, or a specific artificial fixture layout, since an unstated light source defaults to a flattering, idealized studio-style wash that real spaces rarely actually have.

CAMERA POSITION
{{camera_position}} — a real estate or portfolio render is judged by whether the spatial layout is legible and believable from this angle, not by how flattering the angle is; state the actual vantage point a person would stand at, not an impossible floating camera position.

RAW MODE
--style raw — this suppresses Midjourney's default aesthetic embellishment layer, which otherwise adds dramatic lighting, exaggerated depth, and a more "painted" quality that looks appealing as a standalone image but actively misrepresents a real or planned space by making it look more dramatic or spacious than it actually is or will be.

WHAT TO AVOID
--no {{negative_elements}}

STYLIZE VALUE
--stylize {{stylize_value}} — keep this low even with --style raw active, since the two settings work together: raw mode removes the default embellishment layer, and a low stylize value on top of that keeps the model from reintroducing dramatic flourishes through a different mechanism.

PARAMETERS
--style raw --stylize {{stylize_value}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{space_description}}, {{materials_and_finishes}}, {{lighting_description}}, {{camera_position}} --no {{negative_elements}} --style raw --stylize {{stylize_value}} --ar {{aspect_ratio}} --v 7

CHECKING THE RESULT FOR HONESTY
Compare the generated render's apparent room proportions and ceiling height against the actual space this is meant to represent, if it exists yet — even with raw mode active, Midjourney can still subtly exaggerate room scale and light quality relative to a genuinely average real space, since "average and slightly ordinary" is still underrepresented in what the model considers a good architectural image to produce. If the render reads noticeably more dramatic or spacious than the real brief, that is a sign to describe the space's actual limitations explicitly rather than trust raw mode alone to correct for it.`,
    variables: [
      {
        name: 'space_description',
        description: 'The room type, layout, and dimensions or proportions.',
        example:
          'a narrow galley kitchen, roughly 3 by 4 meters, with a window at one end',
        required: true,
      },
      {
        name: 'materials_and_finishes',
        description: 'Specific materials, not just a style category.',
        example:
          'honed grey quartz countertops, matte navy shaker cabinets, wide-plank white oak flooring',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'The actual light source and its realistic quality.',
        example:
          'daylight through a single window at the far end, plus a warm-white under-cabinet LED strip',
        required: true,
      },
      {
        name: 'camera_position',
        description:
          'A believable human vantage point, not an idealized impossible angle.',
        example:
          'standing at the kitchen entrance looking straight down the galley toward the window',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, people, staged props, exaggerated lens flare',
        required: false,
      },
      {
        name: 'stylize_value',
        description: '--stylize, kept low to reinforce raw mode.',
        example: '50',
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '16:9',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'style-raw',
      'architecture',
      'interior-design',
      'real-estate',
      'literal-rendering',
    ],
    whyItWorks: `--style raw suppresses a specific, well-documented default: Midjourney's baseline aesthetic layer, trained to make images look appealing as standalone art, adds dramatic contrast, exaggerated depth, and a more painted quality that is exactly wrong for an architectural or interior render whose entire job is to represent a real or planned space honestly. Without raw mode, a real estate render of an ordinary galley kitchen risks coming back looking like a dramatically lit, aspirational magazine spread — beautiful as an image, but misleading about what the actual space looks or will look like, which defeats the render's actual purpose.

Naming specific materials rather than a style category addresses how Midjourney actually handles underspecified prompts: "modern kitchen" is resolved by falling back on the model's own generalized, statistically average idea of what a modern kitchen contains, which may include cabinet colors, countertop materials, or a layout that has nothing to do with the actual space being represented. Naming the exact quartz, cabinet color, and flooring forces the model to render those specific materials rather than substitute its own genre-typical stand-in, which matters enormously for a client-facing render meant to represent a real, specific design decision.

Pairing raw mode with a low --stylize value rather than raw mode alone closes a real gap between the two settings: raw mode removes one specific layer of embellishment, but stylize is a separate dial that can still push the rendering toward more dramatic contrast and depth through its own independent mechanism even with raw mode active. Treating raw mode as sufficient on its own and leaving stylize at a moderate or high default value is a common mistake that quietly reintroduces some of the exact drama raw mode was meant to suppress.

The honesty-check instruction at the end matters because raw mode changes how the model renders a described space — it does not change the training data's underlying skew toward spacious, well-lit, generously-proportioned rooms being more common and more rewarded during training than genuinely average or slightly cramped ones. A galley kitchen described accurately can still come back looking subtly roomier or better-lit than it actually is, simply because "cramped and slightly awkward" is a rarer target in the model's learned sense of what a good architectural image looks like — checking the output against the real space's actual limitations, and describing those limitations explicitly if they're missing, is the only reliable correction available.`,
    exampleOutput:
      'A flatly and evenly lit galley-kitchen render that reads as a plausible, slightly ordinary real space rather than a dramatic magazine spread — proportions, cabinet color, and countertop material matching the stated brief closely enough to use in a client presentation without over-promising the space.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-23' }],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Midjourney v7 --style raw for honest architectural and interior rendering.',
      },
    ],
  },
  {
    slug: 'midjourney-draft-mode-rapid-composition-exploration',
    category: 'midjourney',
    title:
      'Use Draft Mode to explore compositions cheaply before committing to full renders',
    description:
      "A rapid-iteration workflow using Midjourney's Draft Mode — roughly half the cost and faster turnaround at slightly reduced fidelity — to burn through many compositional directions quickly, reserving full-quality generations for the one or two directions actually worth finishing.",
    promptText: `WHAT THIS EXPLORATION PASS IS FOR
{{exploration_goal}} — state plainly what decision this round of generations is meant to help make (a composition, a color direction, a pose), since Draft Mode is a tool for deciding, not for shipping.

SUBJECT AND SCENE
{{subject_and_scene}}

VARIABLES BEING TESTED THIS ROUND
{{variables_under_test}} — list the specific things you are actually comparing across this batch of draft generations (three different camera angles, four different color moods), since an unfocused draft pass that changes everything at once produces results that are hard to compare against each other for any single decision.

DRAFT MODE
Use Draft Mode for this exploration pass: roughly half the normal cost and meaningfully faster generation, in exchange for reduced fine detail and coherence compared to a full-quality run. This trade-off is the entire point at this stage — fine detail is exactly what you do not need yet when the open question is still "which composition, which angle, which mood," not "is this final."

WHAT TO ACCEPT AT THIS STAGE
Do not judge draft output by the fine-detail standard a final image needs — hands, exact texture, and edge sharpness are all expected to look rougher in Draft Mode. Judge only the thing named in {{variables_under_test}}, and treat everything else as provisional.

PARAMETERS
--draft --ar {{aspect_ratio}} --v 7

OUTPUT
{{subject_and_scene}}, {{variables_under_test}} --draft --ar {{aspect_ratio}} --v 7

MOVING FROM DRAFT TO FINAL
Once a draft grid answers the question in {{exploration_goal}}, take the exact winning composition's description, remove --draft, and re-run at full quality — do not simply upscale the draft image itself expecting it to sharpen into final quality, since Draft Mode's reduced coherence is baked into the generation itself, not a resolution limitation an upscale pass can recover. Optionally lock the seed from the chosen draft if the full-quality re-run should stay close to that exact composition rather than generating a fresh interpretation of the same words.`,
    variables: [
      {
        name: 'exploration_goal',
        description:
          'What decision this batch of draft generations is meant to help make.',
        example:
          'deciding between a low-angle hero shot and an eye-level straight-on shot before committing to a final render',
        required: true,
      },
      {
        name: 'subject_and_scene',
        description: 'The subject and scene being explored.',
        example:
          'a vintage motorcycle parked in front of a sun-bleached desert gas station',
        required: true,
      },
      {
        name: 'variables_under_test',
        description: 'The specific thing being compared across this draft batch.',
        example:
          'camera angle only — testing a low-angle hero shot against an eye-level straight-on shot, everything else held constant',
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value, matched to the eventual final-use format.',
        example: '3:2',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'draft-mode',
      'workflow-efficiency',
      'iteration-workflow',
      'cost-management',
      'composition-exploration',
    ],
    whyItWorks: `Draft Mode's actual trade — roughly half the normal generation cost and faster turnaround, in exchange for reduced fine detail and coherence — is the correct trade specifically during the compositional decision-making stage of a project, and the wrong trade at final-delivery stage, which is why this workflow explicitly names what the current exploration round is deciding before generating anything: a workflow that skips that framing tends to either burn full-price generations on rough compositional questions that didn't need full fidelity to answer, or, just as wastefully, tries to extract a final-quality answer from Draft Mode output it was never capable of producing.

Naming a specific, narrow variable under test rather than letting a whole batch vary freely addresses a real comparison problem: a draft batch that changes camera angle, lighting, and color mood all at once across four generations gives four results that differ from each other in several dimensions simultaneously, which makes it genuinely difficult to attribute why one result looked better — was it the angle, the light, or the color that made the difference? Holding everything constant except the one stated variable is what makes a draft batch's four results into a genuine, interpretable comparison instead of four unrelated rolls of the dice.

The instruction not to judge draft output by final-quality standards addresses the most common way this workflow goes wrong in practice: a user runs Draft Mode, sees rougher hands or softer detail than they're used to from a full-quality generation, and concludes the composition itself is bad — when the actual defect is entirely explained by the mode's known, expected trade-off and has nothing to do with whether the composition being tested is good.

The explicit warning against upscaling a draft image instead of re-running at full quality targets a specific, costly misunderstanding of what Draft Mode actually reduces: its lower fidelity comes from the generation process itself trading detail and coherence for speed, not from a lower output resolution that a separate upscale step could restore — an upscale operation sharpens and enlarges existing pixels, it does not retroactively generate the finer coherent detail a full-quality run would have produced in the first place, so treating an upscaled draft as equivalent to a full-quality final image is a category error that produces a final asset with problems baked in from the original lower-fidelity generation.`,
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-26' }],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Midjourney v7 Draft Mode for cost-efficient composition exploration.',
      },
    ],
  },
  {
    slug: 'midjourney-vary-region-targeted-image-edit',
    category: 'midjourney',
    title: 'Fix or change one part of a generated image with Vary (Region)',
    description:
      "A targeted-editing workflow using Midjourney's Vary (Region) tool to regenerate just one selected area of an already-generated image — the wrong hand, an unwanted background object, a piece of clothing — while leaving everything else in the frame untouched.",
    promptText: `IMAGE BEING EDITED
{{source_image_description}} — the already-generated (and typically already-upscaled) image this edit applies to.

EXACT REGION TO SELECT
{{region_to_edit}} — describe this precisely enough that whoever is doing the selection (drawing the mask in Midjourney's editor) knows exactly where the boundary should sit; a selection that's too tight leaves a visible seam around the edit, and one that's too loose regenerates more of the image than intended.

WHAT IS WRONG WITH THAT REGION NOW
{{current_problem}}

WHAT SHOULD REPLACE IT
{{desired_replacement}} — describe only the replacement content for the selected region; do not re-describe the rest of the image, since Vary (Region) already holds everything outside the selection fixed and re-describing it risks introducing a subtly different interpretation of the untouched area into the edit prompt.

REGION-EDIT PROMPT
{{desired_replacement}}, matching the {{lighting_and_style_match}} of the surrounding image exactly, seamlessly blending at the selection edge.

WHY THIS NEEDS TO MATCH THE SURROUNDING IMAGE
{{lighting_and_style_match}} — restate the specific lighting direction, color temperature, and rendering style already present in the untouched parts of the image, since the region-edit prompt is evaluated somewhat independently and will not automatically infer the surrounding image's exact lighting and style unless told explicitly.

VARIATION STRENGTH
{{strength_setting}} — a subtle setting keeps the edit close to the original region's composition while changing the specific problem; a strong setting gives Midjourney more freedom to substantially reimagine the selected area, useful when the problem is severe enough that a close variation of it would just reproduce the same flaw.

OUTPUT
A version of the original image identical outside the selected region, with the selected region regenerated according to the edit prompt above, blended at the selection boundary rather than pasted with a visible hard edge.

IF THE EDIT DOESN'T BLEND CLEANLY
Re-select a slightly larger region that includes a small margin of the surrounding, already-correct area rather than only the exact flawed pixels — giving Midjourney a little context from the correct surrounding area inside the selection itself, not just outside it, is usually what fixes a visible seam that a tightly-fitted selection produced.`,
    variables: [
      {
        name: 'source_image_description',
        description: 'What the original, already-generated image shows overall.',
        example:
          'an upscaled portrait of a chef standing in a restaurant kitchen, plating a dish',
        required: true,
      },
      {
        name: 'region_to_edit',
        description: 'The precise area to select for regeneration.',
        example: "the chef's left hand and the plating tool it's holding",
        required: true,
      },
      {
        name: 'current_problem',
        description: 'What is specifically wrong with that region as generated.',
        example:
          'the hand has six visibly malformed fingers and the tool it holds looks like a warped, unreadable shape',
        required: true,
      },
      {
        name: 'desired_replacement',
        description: 'What should render in that region instead.',
        example:
          'a correctly-formed hand with five fingers holding a plating spoon at a natural angle over the dish',
        required: true,
      },
      {
        name: 'lighting_and_style_match',
        description:
          "The surrounding image's lighting direction, color, and rendering style to match.",
        example:
          'warm kitchen light from overhead, slightly steamy atmosphere, same photoreal rendering as the rest of the frame',
        required: true,
      },
      {
        name: 'strength_setting',
        description: 'How much freedom to give the regeneration — subtle or strong.',
        example:
          'strong, since a subtle variation of a badly malformed hand tends to just produce a slightly different malformed hand',
        required: true,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'vary-region',
      'inpainting',
      'image-editing',
      'targeted-fix',
      'post-processing',
    ],
    whyItWorks: `Vary (Region) holds everything outside a drawn selection mathematically fixed and only regenerates pixels inside the boundary, which is a fundamentally different operation from re-running the whole prompt and hoping the next generation happens to fix one specific flaw while keeping everything else that was already good — a full re-roll risks losing a composition, expression, or lighting result that took several attempts to land, purely to fix one unrelated malformed hand. Region editing decouples "fix this one thing" from "keep everything else," which is the entire reason it exists as a distinct tool rather than users simply re-rolling the full generation more times.

The instruction to describe only the replacement content, not the rest of the image, inside the region-edit prompt matters because the untouched area outside the selection is not being regenerated at all — it is preserved directly from the source image. Re-describing it inside the edit prompt does nothing to protect it and instead risks confusing the region-specific instruction with irrelevant detail about pixels that were never going to change anyway, diluting the actual instruction that matters: what goes inside the selected boundary.

Explicitly restating the surrounding lighting, color temperature, and rendering style inside the edit prompt — rather than assuming the model will infer it from context — addresses a real limitation of how region editing evaluates its prompt: the model generating new content for the selected area is working from the text description given for that edit plus some visual context at the boundary, but it has no guaranteed strong signal that the new content must match the specific light source and style of the rest of the image unless that match is stated as an explicit requirement; without it, a regenerated hand can come back correctly formed but lit from a subtly different angle than the rest of the photograph, which reads as an even more obvious edit than the original flaw did.

The guidance to choose strength based on the severity of the original flaw, and to widen the selection with a small margin of correct surrounding area when a blend looks seamed, both target the same underlying mechanical reality: a subtle-strength edit stays close to the original region's existing (flawed) composition, so it is the wrong choice when that composition itself is the problem, and a tightly-fitted selection gives the regeneration no correctly-rendered context inside its own boundary to blend from, so a small margin of already-correct pixels inside the mask gives it something reliable to match against at the seam.`,
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-25' }],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Midjourney v7 Vary (Region) for targeted local edits.',
      },
    ],
  },
  {
    slug: 'midjourney-pan-extend-scene-composition',
    category: 'midjourney',
    title: 'Widen a shot beyond its original frame with Pan',
    description:
      'A Pan-tool workflow for extending a Midjourney image sideways or vertically beyond its original borders — turning a tightly cropped result into a wider composition without regenerating the subject from scratch and losing what already worked.',
    promptText: `ORIGINAL IMAGE
{{original_image_description}} — the already-generated image being extended, and specifically which edge or edges are too tight for the intended final use.

DIRECTION TO PAN
{{pan_direction}} — Midjourney's Pan tool extends in one of four directions per pan action (left, right, up, down); state which one, and if more than one edge needs extending, plan on a separate pan action per direction rather than expecting one action to widen the frame on multiple sides at once.

WHAT SHOULD APPEAR IN THE NEWLY REVEALED AREA
{{new_area_content}} — describe this as an extension of the same physical scene the original image implies, not a new, separate idea; Pan is generating what the camera would have captured just outside the original crop, and the newly revealed content needs to plausibly belong to the same continuous space and lighting as the part already generated.

WHY THIS EXTENSION IS NEEDED
{{extension_reason}}

PAN PROMPT
{{new_area_content}}, continuing the {{lighting_and_style_match}} of the existing image seamlessly at the join.

CONSISTENCY NOTE
{{lighting_and_style_match}} — restate the existing image's light direction, color grade, and rendering style explicitly, since Pan generates the new region from a prompt plus the edge context of the existing image, and an unstated style mismatch is the most common way a panned extension reads as visibly bolted-on rather than a continuous frame.

OUTPUT
The original image extended in the {{pan_direction}} direction, with the new region continuous in lighting, style, and spatial logic with the untouched original content, at a new overall aspect ratio wider or taller than the source.

WHEN NOT TO USE PAN
If the newly revealed area needs to contain something structurally unrelated to what the original scene implies just outside its frame — a different subject entirely, not more of the same room or landscape — Pan is the wrong tool; that is closer to a fresh composite or a new generation than an extension of an existing continuous space, and forcing it through Pan usually produces a visible, illogical seam where the scene's internal logic breaks.`,
    variables: [
      {
        name: 'original_image_description',
        description: 'What the source image shows and which edge is too tightly cropped.',
        example:
          'a landscape shot of a lone cabin in a snowy valley, cropped too tightly on the left with the mountain range cut off',
        required: true,
      },
      {
        name: 'pan_direction',
        description: 'Which single direction is being extended in this action.',
        example: 'left',
        required: true,
      },
      {
        name: 'new_area_content',
        description:
          'What should plausibly appear in the newly revealed area, as a continuation of the existing scene.',
        example:
          'more of the snow-covered mountain range continuing into the distance, with a thin line of pine trees at the base',
        required: true,
      },
      {
        name: 'extension_reason',
        description: 'The practical reason this wider composition is needed.',
        example:
          'the client needs a 21:9 ultra-wide banner crop for a website hero section, and the original 16:9 crop is too tight on the left',
        required: true,
      },
      {
        name: 'lighting_and_style_match',
        description:
          "The existing image's light direction, color grade, and rendering style, restated explicitly.",
        example:
          'soft overcast light with no strong directional shadow, cool blue-grey color grade, same painterly matte-painting rendering as the rest of the frame',
        required: true,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'pan',
      'scene-extension',
      'aspect-ratio-conversion',
      'image-editing',
      'composition',
    ],
    whyItWorks: `Pan generates new content specifically as a continuation of the existing image's edge — it is conditioned on what is already there at the boundary being extended, which is why it can produce a plausible, spatially continuous widening of a scene rather than an unrelated new composition awkwardly stitched onto one side. This is the direct alternative to the two worse options a too-tightly-cropped result usually forces: re-rolling the entire generation from scratch at a wider aspect ratio and risking losing a composition, subject pose, or lighting result that took several tries to land, or manually compositing a separately-generated background extension in an external editor and fighting to match lighting and grain by hand.

Restricting each pan action to one direction, and planning multiple sequential pan actions for a shot that needs extending on more than one side, reflects an actual mechanical constraint of the tool rather than an arbitrary limitation stated for caution's sake — expecting one action to widen a frame on two sides simultaneously will not produce the intended result, and workflows planned around that false expectation waste a generation finding this out rather than planning the sequence correctly up front.

The instruction to describe the newly revealed content as a continuation of the same physical scene, not a new idea, targets the most common way a Pan result reads as obviously artificial: Pan is answering "what would the camera have also captured just outside this crop," and a prompt that introduces a structurally unrelated element into that region — a new object with no plausible reason to be there, a lighting condition that doesn't match — breaks the spatial logic the original frame implied, producing an extension that looks stitched-together rather than photographed as one continuous scene.

Restating the existing image's lighting, color grade, and rendering style explicitly in the pan prompt, rather than trusting Pan to infer it purely from the edge pixels it can see, matters because the edge context available to the tool is a relatively thin sliver of the original image — enough to inform local continuity right at the seam, but not necessarily enough on its own to carry the full character of light direction and color grade consistently across a large newly-generated region. Stating it explicitly is a low-cost way to close that gap rather than discovering after the fact that the new region drifted subtly warmer, cooler, or flatter than the rest of the frame.`,
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-28' }],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Midjourney v7 Pan for aspect-ratio-driven scene extension.',
      },
    ],
  },
  {
    slug: 'midjourney-zoom-out-reveal-environment',
    category: 'midjourney',
    title: 'Reveal the wider environment around a tight subject with Zoom Out',
    description:
      'A Zoom Out workflow for pulling back from a tightly-framed Midjourney result to reveal the surrounding environment and context — turning a close portrait or product shot into an establishing wide shot without regenerating the subject and risking it come back different.',
    promptText: `ORIGINAL TIGHT SHOT
{{original_image_description}} — the already-generated close or medium shot this pulls back from.

WHY A WIDER SHOT IS NEEDED NOW
{{wider_shot_reason}}

ZOOM LEVEL
{{zoom_level}} — Midjourney offers preset zoom-out multiples (roughly 1.5x and 2x) as well as a custom zoom level; choose based on how much surrounding context is actually needed, since a 2x zoom that only needed a modest pullback often reveals more empty, undirected space than the composition can use well.

WHAT THE NEWLY REVEALED ENVIRONMENT SHOULD CONTAIN
{{environment_description}} — describe this as what plausibly surrounds the original subject in the real or implied world of the shot, at the same time of day, weather, and general setting already established by what's visible in the tight shot.

HOW THE ORIGINAL SUBJECT SHOULD SIT IN THE WIDER FRAME
{{subject_placement}} — state where in the new, wider frame the original subject should end up positioned, since Zoom Out does not always simply center the exact original content; specifying an intended placement (rule-of-thirds, off-center, small within a large environment) gives the tool a compositional target for the pullback.

CONSISTENCY NOTE
{{lighting_and_style_match}} — restate the light direction, color grade, and rendering style already established in the tight shot, for the same reason it matters in any extension of existing generated content: the environment being revealed needs to share that established character, not introduce a new one.

OUTPUT
The original subject, recognizably intact, now sitting within a wider environment consistent with the described setting, lighting, and mood, at the new pulled-back framing.

WHEN THE ORIGINAL SUBJECT SHIFTS TOO MUCH
If the subject itself changes noticeably — a different pose, a different expression, a shifted color — across the zoom-out result, that specific run did not hold the original content as fixed as intended; re-run at the same zoom level rather than accepting a subject that has quietly drifted, since the entire value of Zoom Out over a fresh wide-shot generation is keeping the original subject's specific result intact while only the surrounding context is new.`,
    variables: [
      {
        name: 'original_image_description',
        description: 'What the tight original shot shows.',
        example:
          'a close-up portrait of a woman in a red coat, shot tight from the shoulders up',
        required: true,
      },
      {
        name: 'wider_shot_reason',
        description: 'The practical reason a wider establishing shot is needed now.',
        example:
          'the tight portrait works for a profile photo but the client also needs an establishing shot for a magazine feature spread',
        required: true,
      },
      {
        name: 'zoom_level',
        description: 'The preset or custom zoom-out multiple.',
        example:
          '1.5x, since only a modest amount of surrounding context is needed, not a full wide establishing shot',
        required: true,
      },
      {
        name: 'environment_description',
        description: 'What the newly revealed surroundings should plausibly contain.',
        example:
          'a quiet cobblestone street in early autumn, a few blurred pedestrians in the distance, string-lit café awnings along the block',
        required: true,
      },
      {
        name: 'subject_placement',
        description: 'Where the original subject should sit within the new wider frame.',
        example:
          'positioned in the right third of the frame, leaving open street and café awnings occupying the left two-thirds',
        required: true,
      },
      {
        name: 'lighting_and_style_match',
        description:
          "The tight shot's established light direction, color grade, and rendering style.",
        example:
          'warm late-afternoon light from the left, slightly desaturated documentary color grade',
        required: true,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'zoom-out',
      'scene-extension',
      'establishing-shot',
      'composition',
      'image-editing',
    ],
    whyItWorks: `Zoom Out is built to hold the already-generated subject in place while generating new environment around it, which is the direct fix for a real, common problem: a tight portrait or product shot that works well for one use case (a profile photo, a close product hero) but is the wrong crop for a second, later use case (a magazine establishing shot, a wide banner) that surfaces after the tight version has already been approved and is now the version everyone expects to see recognizably preserved. Re-running a fresh wide-shot generation from the same text prompt risks a different pose, expression, or exact look — Zoom Out is specifically for when that risk is unacceptable because the tight version is already the approved, final look.

Choosing the zoom multiple based on how much context is actually needed, rather than defaulting to the largest available multiple, matters because a bigger pullback than the composition calls for tends to reveal more undirected, empty space than the wider shot can use meaningfully — an environment description written for "somewhat more context" does not automatically fill a much larger newly-revealed area with equally purposeful detail, and a 2x zoom applied where a 1.5x pullback would have served the actual need often produces a wide shot with a small, oddly isolated subject swimming in more background than the scene's own logic supports.

Specifying where the original subject should land within the new, wider frame targets a real ambiguity in what "zoom out" could mean compositionally: simply centering the exact original content in a larger canvas is one valid outcome, but an editorial establishing shot more often wants the subject placed off-center per a rule-of-thirds logic, with the newly revealed environment doing more of the compositional work — stating that placement as an explicit target, rather than leaving it to whatever the tool defaults to, is what makes the pulled-back result usable as an actual establishing shot rather than just a bigger version of the same centered composition.

The instruction to re-run rather than accept a subject that has visibly drifted addresses the actual failure mode worth watching for with this tool: because new environment is being generated around existing content, there is some risk the original subject shifts subtly in the process rather than staying perfectly fixed, and accepting that drift defeats the entire reason to use Zoom Out instead of a fresh wide generation in the first place — the tool's whole value proposition depends on the original subject staying intact, so a result where it hasn't should be treated as a failed run, not a usable one with a minor cosmetic difference.`,
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-30' }],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Midjourney v7 Zoom Out for establishing-shot environment reveal.',
      },
    ],
  },
  {
    slug: 'midjourney-image-to-video-animate-still',
    category: 'midjourney',
    title: 'Animate a finished Midjourney still into a short native video clip',
    description:
      "A brief for Midjourney's own native image-to-video feature that turns an already-generated still into a short motion clip — describing camera movement and subject motion the way you would for the still image itself, tuned to what a several-second extension of a single frame can plausibly do.",
    promptText: `SOURCE IMAGE
{{source_image_description}} — the already-generated, already-chosen still this clip animates from; the video feature works from this specific frame, not from a fresh text prompt describing the whole scene again.

MOTION TO ADD
{{motion_description}} — name one primary motion, not several competing ones. A still that shows a person mid-stride and a curtain in the background can plausibly animate the person continuing to walk and the curtain drifting in a breeze at the same time, since those are both small, physically consistent continuations of what the still already implies — but asking for a completely different camera angle, a new character entering, and a full scene change all within a several-second clip from one starting frame is asking the feature to do more than that short a clip generated from a single image can coherently deliver.

CAMERA MOVEMENT, IF ANY
{{camera_movement}} — state explicitly if the camera should stay locked or move; a locked camera focusing purely on subject motion is generally the safer, more coherent choice for a first attempt from a still with complex detail, since a moving camera compounds however much interpretation the model already has to do to animate the subject itself.

MOTION INTENSITY
{{motion_intensity}} — Midjourney's video controls typically offer a choice between a lower-motion, more subtle animation and a higher-motion, more dramatic one; lower motion keeps the result closer to the original still's exact detail and composition, higher motion allows more visible change but risks the subject drifting further from what the still originally showed.

CLIP LENGTH
{{clip_length}} — clips extend in short increments; treat the first generated segment as the base and only extend further if the motion established in that first segment is actually working, since extending a clip whose initial motion already looks wrong just compounds the same problem across a longer duration.

OUTPUT
A short video clip beginning from the exact source still, with the described motion applied, at the chosen motion intensity and camera behavior.

IF THE MOTION LOOKS WRONG OR THE SUBJECT WARPS
Lower the motion intensity before rewriting the motion description — a subject that warps or loses coherence during animation is very often a motion-intensity problem, where the model has been given more freedom to change the frame than the specific source image's detail level can support without breaking down, not a wording problem with how the motion was described.`,
    variables: [
      {
        name: 'source_image_description',
        description: 'The specific already-generated still being animated.',
        example:
          'a chosen, upscaled still of a woman in a red coat walking down a cobblestone street at dusk, mid-stride',
        required: true,
      },
      {
        name: 'motion_description',
        description:
          'The single primary motion to add, consistent with what the still already implies.',
        example:
          'her continuing her walking stride naturally, coat hem swaying slightly with the movement',
        required: true,
      },
      {
        name: 'camera_movement',
        description: 'Whether the camera stays locked or moves, and how.',
        example: 'locked camera, no movement, focus entirely on her walking motion',
        required: true,
      },
      {
        name: 'motion_intensity',
        description:
          'Lower (subtle, closer to the still) or higher (more dramatic, more drift risk).',
        example:
          'lower motion intensity, to keep her face and coat detail close to the original still',
        required: true,
      },
      {
        name: 'clip_length',
        description: 'How long the clip should be, built up in extendable increments.',
        example:
          'start with the first short segment, extend only once if the walking motion looks natural',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7', 'Midjourney Video'],
    tags: [
      'midjourney',
      'image-to-video',
      'native-video',
      'motion',
      'animation',
      'still-to-motion',
    ],
    whyItWorks: `Midjourney's native video feature animates from a specific already-generated frame rather than from a fresh text description of the whole scene, which means the actual creative decision that mattered most — composition, lighting, subject appearance — was already locked in when the still was generated and chosen; the video step's only real job is adding believable motion consistent with that frame, not re-deciding what the scene looks like. Framing the brief around one primary motion, rather than several competing changes, matters because a several-second clip generated from a single starting frame has a narrow amount of physically plausible change it can introduce before it stops looking like a continuation of that frame and starts looking like a different, disconnected scene stitched on afterward.

Explicitly choosing whether the camera moves, rather than leaving it unstated, targets a real compounding-difficulty problem: animating subject motion from a still frame is already an interpretive task, since the model has to infer plausible continued movement from one instant; adding independent camera movement on top asks it to solve two overlapping problems in the same short clip, which is why a locked camera is the more coherent, more reliable choice for a first attempt, especially on a still with a lot of fine detail (hands, textured fabric, an expressive face) that is easiest to lose coherence in in exactly the way this kind of feature commonly does.

The motion-intensity distinction between "lower, closer to the original" and "higher, more dramatic but more drift-prone" reflects the actual mechanical trade the setting makes: the model is not simply choosing how fast something moves, it is choosing how much freedom it has to reinterpret and regenerate detail across the clip's duration, so a higher setting on a detailed still is spending that freedom on can-be-imperceptible drift in exactly the areas (a face, a hand, fine fabric texture) that were the most carefully chosen parts of the original still.

Building a clip up in short increments, and only extending further once the initial motion is confirmed to be working, rather than requesting a long clip in one go, exists because each extension segment continues from wherever the previous one left off — if the very first segment already shows the subject warping or the motion reading as physically implausible, extending it further only compounds that same defect across more seconds of footage rather than giving the model a chance to correct course, since there is no correction mechanism partway through an extension; the fix has to happen by regenerating from the source still with adjusted settings, not by continuing forward from a flawed first segment.`,
    exampleOutput:
      "A short clip of the woman continuing her walking stride down the cobblestone street, her coat swaying naturally with the motion, camera locked and steady, her face and coat detail staying close to the original chosen still rather than visibly warping over the clip's duration.",
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-08-04' }],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against Midjourney v7 native image-to-video for still-to-motion animation.',
      },
    ],
  },
  {
    slug: 'midjourney-negative-prompt-clean-product-photography',
    category: 'midjourney',
    title: 'Get a genuinely clutter-free product shot using real negative prompting',
    description:
      "An e-commerce product-photography brief that leans on --no, Midjourney's real negative-prompting mechanism, to reliably strip out props, extra units, and background clutter that a positive-only description often fails to keep out.",
    promptText: `PRODUCT
{{product_description}}

PLACEMENT AND SURFACE
{{placement_and_surface}}

BACKGROUND
{{background_description}}

LIGHTING SETUP
{{lighting_setup}}

CAMERA ANGLE
{{camera_angle}}, sharp focus on {{focus_detail}}.

RAW MODE FOR LITERAL COLOR
--style raw — a listing photo needs to represent the product's actual color and finish, not Midjourney's default tendency to push a "pleasing photo" toward warmer, more saturated tones than the real item.

NEGATIVE PROMPTING
--no {{negative_elements}} — this is Midjourney's genuine negative-conditioning mechanism, distinct from describing what should be in frame; use it specifically for the recurring failure modes of product shots — a second unit of the product appearing in the background, a hand or prop nobody asked for, text or a watermark-like mark — rather than trying to prevent all of them purely through positive description alone.

PARAMETERS
--style raw --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{product_description}}, {{placement_and_surface}}, {{background_description}}, {{lighting_setup}}, {{camera_angle}}, sharp focus on {{focus_detail}} --style raw --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

WHAT --NO ACTUALLY REMOVES VERSUS WHAT IT DOESN'T
--no reliably suppresses concrete, nameable things — an object category, text, a color. It does not reliably suppress a vague quality like "clutter" stated as a single word, because the model has nothing concrete to subtract for an abstract term; if the background still reads as busy after a first attempt, replace a vague --no clutter with the specific objects that actually showed up unwanted (--no cardboard box, price tag, second product) rather than assuming a broader or repeated vague term will do more.

IF A SECOND UNIT OF THE PRODUCT KEEPS APPEARING
This is common enough in product photography prompts to name explicitly: add the literal phrase describing a duplicate — "second unit," "duplicate item," "multiple products" — to the --no list, since Midjourney's default composition instinct for product-category scenes sometimes includes more than one unit unless told not to.`,
    variables: [
      {
        name: 'product_description',
        description: 'The product, including material and finish.',
        example:
          'a matte-black ceramic pour-over coffee dripper with a walnut wood collar',
        required: true,
      },
      {
        name: 'placement_and_surface',
        description: 'Where on what surface the product sits.',
        example: 'centered on a honed light-grey concrete surface',
        required: true,
      },
      {
        name: 'background_description',
        description: 'What the backdrop looks like.',
        example:
          'a seamless soft off-white gradient background fading to pale grey at the edges',
        required: true,
      },
      {
        name: 'lighting_setup',
        description:
          'A specific lighting arrangement, as if briefing a real studio setup.',
        example:
          'a large soft overhead softbox key light with gentle fill from the left, subtle rim light separating the product edge from the background',
        required: true,
      },
      {
        name: 'camera_angle',
        description: 'The shooting angle.',
        example: 'three-quarter angle, slightly above eye level',
        required: true,
      },
      {
        name: 'focus_detail',
        description: 'The specific texture or detail that should be tack-sharp.',
        example: 'the ceramic glaze texture and wood grain',
        required: false,
      },
      {
        name: 'negative_elements',
        description:
          'Comma-separated list of concrete, nameable things to exclude — not vague qualities.',
        example:
          'text, watermark, second unit of the product, hands, price tag, cardboard box',
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '1:1',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'product-photography',
      'ecommerce',
      'negative-prompt',
      'style-raw',
      'no-parameter',
    ],
    whyItWorks: `--no is Midjourney's real negative-conditioning mechanism, not a phrase the model might choose to honor loosely — unlike Flux or Nano Banana, which have no negative-prompt field at all and must steer unwanted content out purely through positive description, Midjourney's underlying process supports true negative conditioning, which is why it is the more reliable tool here for the specific, recurring failure modes of product photography: a second unit appearing in the background, an unrequested prop, watermark-like text.

The distinction drawn between concrete, nameable exclusions and vague quality words is the practical difference between --no actually working and --no doing nothing measurable: a term like "clutter" has no specific referent for the model to subtract, since it names a subjective quality rather than an object category, while "cardboard box" or "price tag" names something concrete the model can specifically suppress. A user who tries --no clutter, doesn't get a cleaner result, and concludes negative prompting doesn't work for product shots has usually just used it on the wrong kind of term — the fix is naming the actual unwanted object once it's visible in a first attempt, not abandoning --no for a purely positive-description approach.

Pairing --no with --style raw addresses a separate, unrelated default bias that --no cannot touch: --no controls what's absent from the frame, while raw mode controls how faithfully the present content's color and finish are rendered. Without raw mode, Midjourney's aesthetic layer tends to push product colors toward a warmer, more saturated "pleasing photo" grade that can misrepresent the product's actual color to a buyer — a defect --no has no ability to fix since it's not about removing an unwanted object, it's about the fidelity of a wanted one.

The explicit callout for duplicate-product suppression reflects a specific, well-observed pattern in this exact use case: Midjourney's learned association for a product-category scene sometimes includes rendering more than one unit of the product, likely because many training images of a product category legitimately show multiples (a shelf of items, a set), and a single-product listing shot needs to explicitly override that association rather than assume "one product" was implied by only describing one in the positive prompt text.`,
    exampleOutput:
      'A single, cleanly-lit product photo on a seamless background with true-to-life color, no second unit, no stray prop, and no watermark-like text — ready to use as a listing image with minimal or no further retouching.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-21' }],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against Midjourney v7 --no negative prompting for clean product photography.',
      },
    ],
  },
  {
    slug: 'midjourney-fashion-editorial-lookbook-story',
    category: 'midjourney',
    title: 'Brief a multi-look fashion editorial story for Midjourney',
    description:
      'A structured multi-look editorial fashion brief that holds one model, one location, and one visual identity constant across several distinct outfit changes — the actual structure a fashion lookbook or lookbook page needs, rather than four unrelated fashion images that happen to share a subject description.',
    promptText: `MODEL AND CONSISTENT FEATURES
{{model_description}} — restate this identically across every look in the story, since without a character reference locking the face, each look is a separate generation and will otherwise show a different-looking model per shot.

LOCATION FOR THIS STORY
{{location_description}} — one location, described identically across every look, since an editorial story reads as one continuous shoot specifically because the setting doesn't change between frames, only the pose and outfit do.

LOOK FOR THIS SPECIFIC FRAME
{{outfit_description}} — the one thing that should actually differ between frames in this story; be as specific about garment, texture, and color here as the model description is about the model, since a vague outfit description drifts more between generations than a precise one.

POSE AND ATTITUDE FOR THIS LOOK
{{pose_and_attitude}}

PHOTOGRAPHIC TREATMENT
{{photographic_treatment}} — camera, lens, and grade, restated identically across every look in the story, for the same reason the location and model description are restated: a lookbook is judged on whether it reads as one photographer's consistent eye across the whole set, not four different photographic treatments loosely related by subject.

CHARACTER CONSISTENCY
--cref {{character_reference_url}} --cw {{character_weight_value}} — lower the character weight from the default so the reference locks the model's face and build without also forcing this frame's specific outfit description to fight against the reference image's original clothing.

WHAT TO AVOID
--no {{negative_elements}}

PARAMETERS
--cref {{character_reference_url}} --cw {{character_weight_value}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{model_description}}, {{outfit_description}}, {{pose_and_attitude}}, in {{location_description}}, {{photographic_treatment}} --cref {{character_reference_url}} --cw {{character_weight_value}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

REPEAT FOR EVERY LOOK
Generate this same structure once per outfit change, keeping the model description, location description, photographic treatment, character reference URL, and character weight identical across every look, and changing only the outfit and pose lines — this is what makes the finished set read as one lookbook rather than a loose collection of separately-styled shots.`,
    variables: [
      {
        name: 'model_description',
        description: 'The model, restated identically across every look in the story.',
        example:
          'a tall model with sharp cheekbones, close-cropped dark hair, and an angular, editorial bone structure',
        required: true,
      },
      {
        name: 'location_description',
        description: 'The one location used across the whole story.',
        example:
          'a stark, minimalist concrete gallery space with tall industrial windows and diffuse grey daylight',
        required: true,
      },
      {
        name: 'outfit_description',
        description: 'The specific garment and styling for this one frame.',
        example:
          'an oversized charcoal wool coat over a cream silk slip dress, black leather ankle boots',
        required: true,
      },
      {
        name: 'pose_and_attitude',
        description: 'The pose and emotional register for this frame.',
        example:
          'standing at a three-quarter angle, chin slightly lowered, an unreadable, aloof expression',
        required: true,
      },
      {
        name: 'photographic_treatment',
        description: 'Camera, lens, and grade, restated identically across the story.',
        example:
          'shot on a Hasselblad medium-format camera, high-contrast black-and-white grade, sharp focus throughout',
        required: true,
      },
      {
        name: 'character_reference_url',
        description:
          "The anchor image URL locking the model's face and build across looks.",
        example: 'https://cdn.midjourney.com/jkl012-model-anchor.png',
        required: true,
      },
      {
        name: 'character_weight_value',
        description:
          "--cw, lowered from the default so outfit descriptions aren't overridden by the reference's original clothing.",
        example: '40',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, a second model, visible brand logos',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value, kept consistent across the story.',
        example: '4:5',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'fashion-photography',
      'editorial',
      'lookbook',
      'character-reference',
      'multi-look-story',
    ],
    whyItWorks: `A fashion lookbook is judged on whether it reads as one continuous shoot with one model, one photographer's eye, and one location across several outfit changes — which is a structurally different problem from generating four independently strong fashion images that each happen to describe "the same model" in text, since text descriptions alone give each generation only a loose, non-specific resemblance to the others rather than a genuinely consistent face and build. Locking the model with --cref, and restating the location and photographic treatment identically across every look, is what turns four separate generations into one coherent story instead of four unrelated fashion images that share a vague family resemblance at best.

Lowering --cw below its default specifically for this workflow addresses the direct tension a lookbook creates for character reference: the default --cw 100 pulls clothing from the reference image along with the face, which actively fights the entire point of a multi-look story — different clothing in every frame. A lower weight biases the match toward the model's facial features and build while leaving room for each frame's specific outfit description to actually take effect, which is the opposite tuning from the earlier general-purpose character-consistency use case, where holding the reference's original outfit steady across scenes is often exactly what's wanted.

Restating the photographic treatment identically in every look's prompt, rather than assuming it carries over from an earlier generation, matters because each look in this workflow is its own independent generation with no memory of the others besides the shared --cref value — a subtly different camera or grade description on look three, even unintentionally, produces a photograph that looks like it came from a different shoot when the four looks are laid out side by side in a finished lookbook spread, which is exactly the failure a lookbook cannot afford.

Being specific about the outfit description, at the same level of detail the model description gets, addresses an asymmetry that's easy to fall into: it's tempting to over-invest description effort in getting the model right since that's the harder consistency problem, and under-describe the outfit since it changes every frame anyway — but a vague outfit description ("a nice coat") drifts unpredictably between generations in exactly the same way an underspecified subject drifts in any other Midjourney prompt, and a lookbook with inconsistent garment rendering quality across its looks reads as unpolished even when the model's face is perfectly consistent throughout.`,
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-08-05' }],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Midjourney v7 --cref-anchored multi-look fashion editorial workflow.',
      },
    ],
  },
  {
    slug: 'midjourney-food-photography-macro-styling',
    category: 'midjourney',
    title: 'Shoot appetite-driving macro food photography with Midjourney',
    description:
      'A texture-and-styling-forward food photography brief that names the specific physical details — steam, glaze, crumb structure — that actually separate an appetizing macro food shot from a flat, generic "delicious food" render.',
    promptText: `DISH
{{dish_description}}

STYLING AND PLATING
{{styling_details}} — describe the actual plating choices (garnish placement, sauce drizzle pattern, how components are arranged relative to each other), not just "beautifully plated," since that phrase carries no specific visual information for the model to render and defaults to a generic, editorial-adjacent plating style regardless of what dish it's applied to.

TEXTURE DETAIL THAT SELLS THE DISH
{{texture_detail}} — name the one or two specific textures that make this particular dish look appetizing up close: a glaze's sheen, a crust's visible crumb structure, condensation on a cold dessert, steam rising off something hot. A macro food shot lives or dies on this kind of physical specificity far more than on the dish description alone.

CAMERA AND FOCUS
{{camera_and_focus}} — a true macro or close-up lens character, with an explicit statement of exactly what stays in sharp focus versus what falls into soft blur, since food photography's appetite appeal depends heavily on a narrow, deliberate plane of focus rather than an evenly sharp frame.

LIGHTING
{{lighting_description}} — food photography almost always wants soft, directional natural-feeling light rather than a harsh flash or flat overhead studio wash, since hard light flattens texture exactly where texture is doing the most work to sell the dish.

SURFACE AND SETTING
{{surface_and_setting}}

WHAT TO AVOID
--no {{negative_elements}}

RAW MODE FOR TRUE-TO-LIFE COLOR
--style raw — food color accuracy matters for the same reason product color accuracy does: Midjourney's default aesthetic layer pushes toward a warmer, more saturated "food ad" color grade that can look appealing in isolation but reads as artificial and can misrepresent the dish's actual appearance.

PARAMETERS
--style raw --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{dish_description}}, {{styling_details}}, {{texture_detail}}, {{camera_and_focus}}, {{lighting_description}}, {{surface_and_setting}} --style raw --no {{negative_elements}} --ar {{aspect_ratio}} --v 7`,
    variables: [
      {
        name: 'dish_description',
        description: 'The dish, including its key visible components.',
        example:
          'a bowl of tonkotsu ramen with a soft-boiled egg, sliced chashu pork, and scallions',
        required: true,
      },
      {
        name: 'styling_details',
        description: 'Specific, concrete plating choices — not "beautifully plated."',
        example:
          'the egg halved and placed cut-side up in the center, chashu slices fanned along one edge, scallions scattered unevenly rather than in a neat line',
        required: true,
      },
      {
        name: 'texture_detail',
        description:
          'The one or two specific physical textures that sell the dish up close.',
        example:
          'visible steam rising off the broth, a thin sheen of fat glistening on the surface',
        required: true,
      },
      {
        name: 'camera_and_focus',
        description: 'Lens character and exactly what stays sharp versus what blurs.',
        example:
          'true macro lens, tack-sharp focus on the egg yolk, the rest of the bowl falling into a soft, shallow blur',
        required: true,
      },
      {
        name: 'lighting_description',
        description: 'Soft, directional, natural-feeling light.',
        example:
          'soft window light from the side, gentle shadow falling across the far side of the bowl',
        required: true,
      },
      {
        name: 'surface_and_setting',
        description: 'The table setting and immediate surroundings.',
        example:
          'a dark weathered wood table, a folded linen napkin and chopsticks resting just out of frame',
        required: false,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example:
          'text, watermark, a hand holding chopsticks, extra bowls in the background',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '1:1',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'food-photography',
      'macro-photography',
      'styling',
      'style-raw',
      'texture',
    ],
    whyItWorks: `Naming specific textures — steam, glaze sheen, crumb structure — rather than relying on the dish description and a generic "delicious" or "appetizing" adjective addresses the actual mechanism by which food photography reads as appetizing versus flat: appetite appeal in a photograph is carried almost entirely by texture cues the eye reads instinctively (visible moisture, heat, crispness), and "delicious" is not a texture the model can render, it's a judgment about the image that names nothing concrete for the generation to act on — while "visible steam rising off the broth" is a specific, renderable physical phenomenon that produces the actual visual cue a viewer's eye associates with heat and freshness.

Requiring concrete plating detail instead of "beautifully plated" for the same reason closes a gap that's specific to food photography among photographic genres: plating style varies enormously by dish and cuisine, and a phrase with no specific referent gets resolved by the model's own default idea of attractive plating, which trends toward a generic, editorial-restaurant aesthetic that may have nothing to do with how this particular dish is actually served — describing the actual garnish placement and sauce pattern is what makes the plating look intentional for this dish rather than generically photogenic in a way that could apply to almost any dish.

The explicit focus-plane instruction — naming exactly what stays sharp versus what blurs — targets a specific technical lever that separates professional food photography from an amateur snapshot: a narrow, deliberately chosen plane of focus (sharp on the egg yolk, soft everywhere else) is what creates the sense of an intentional, considered shot, while an evenly sharp frame edge to edge reads as flat and documentary regardless of how well-styled the food itself is — and Midjourney's default interpretation of "food photo" with no focus instruction tends toward that flatter, evenly sharp rendering rather than the shallow selective focus a macro food shot actually wants.

Pairing --style raw with a warning about the model's default "food ad" color grade addresses the same underlying bias mechanism seen in product photography, applied to a genre where it's arguably even more pronounced: food imagery in Midjourney's training distribution skews toward an oversaturated, warm, commercial-advertising color treatment, because that treatment is disproportionately common in the food photography the model learned from — raw mode is the direct lever against that specific learned bias, not a general-purpose realism toggle applied out of habit.`,
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-31' }],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Midjourney v7 --style raw for texture-driven food photography.',
      },
    ],
  },
  {
    slug: 'midjourney-fantasy-scifi-environment-matte-painting',
    category: 'midjourney',
    title: 'Build a fantasy or sci-fi environment matte painting with real scale cues',
    description:
      'A world-building environment brief structured around explicit scale reference and atmospheric depth — the two elements that most reliably separate a matte painting that feels genuinely vast from one that just looks like a big empty picture.',
    promptText: `ENVIRONMENT
{{environment_description}}

SCALE REFERENCE
{{scale_reference}} — include at least one recognizably human-scale or human-familiar object or figure somewhere in the frame, even small and distant, since without a known reference point the eye has no way to judge whether a structure is fifty feet tall or five thousand, and an environment meant to feel vast needs something the viewer's brain already knows the size of to measure the vastness against.

ATMOSPHERIC DEPTH
{{atmosphere_and_depth}} — describe how visibility and color shift with distance (haze, fog, atmospheric perspective fading distant elements toward a lighter, cooler, less detailed version of themselves), since genuine environmental scale reads through this kind of depth cue as much as through the scale reference itself.

LIGHT SOURCE AND TIME
{{light_source_and_time}}

FOREGROUND, MIDGROUND, BACKGROUND
{{layered_composition}} — describe what occupies each of these three depth bands specifically, rather than one flat description of "a vast alien landscape," since naming what's near, what's middle-distance, and what's far is what actually produces the layered depth a matte painting is judged on.

MOOD AND GENRE REFERENCE
{{mood_and_genre_reference}}

WHAT TO AVOID
--no {{negative_elements}}

STYLIZE AND CHAOS
--stylize {{stylize_value}} --chaos {{chaos_value}} — a matte painting benefits from a moderate-to-high stylize value, since Midjourney's own painterly aesthetic instincts are well-suited to this genre specifically, more so than to a photorealistic brief.

PARAMETERS
--stylize {{stylize_value}} --chaos {{chaos_value}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{environment_description}}, {{scale_reference}}, {{atmosphere_and_depth}}, {{light_source_and_time}}, {{layered_composition}}, {{mood_and_genre_reference}} --stylize {{stylize_value}} --chaos {{chaos_value}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7`,
    variables: [
      {
        name: 'environment_description',
        description: 'The core environment or structure being depicted.',
        example:
          'an ancient, colossal stone bridge spanning a bottomless chasm, half-collapsed and overgrown',
        required: true,
      },
      {
        name: 'scale_reference',
        description:
          'A recognizably human-scale figure or object somewhere in the frame.',
        example:
          "a single small figure standing at the bridge's edge, dwarfed by the scale of the stonework around them",
        required: true,
      },
      {
        name: 'atmosphere_and_depth',
        description: 'How color and visibility shift with distance.',
        example:
          'a thick blue-grey haze filling the chasm below, distant bridge sections fading paler and less detailed the further they recede',
        required: true,
      },
      {
        name: 'light_source_and_time',
        description: 'The actual light source and time of day.',
        example:
          'a single shaft of late-afternoon sunlight breaking through storm clouds directly overhead',
        required: true,
      },
      {
        name: 'layered_composition',
        description:
          'What occupies the foreground, midground, and background specifically.',
        example:
          'foreground: cracked stone and creeping vines close to camera; midground: the bridge structure and the small figure; background: distant chasm walls fading into haze',
        required: true,
      },
      {
        name: 'mood_and_genre_reference',
        description: 'The emotional tone and any genre or artist-adjacent reference.',
        example:
          'awe-struck and melancholic, in the spirit of classic matte-painting concept art for epic fantasy',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, modern structures, multiple figures',
        required: false,
      },
      {
        name: 'stylize_value',
        description: '--stylize, typically moderate-to-high for this genre.',
        example: '500',
        required: true,
      },
      {
        name: 'chaos_value',
        description: '--chaos, for varying interpretations during early exploration.',
        example: '30',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value, typically wide for environment work.',
        example: '21:9',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'concept-art',
      'environment-design',
      'matte-painting',
      'worldbuilding',
      'fantasy',
      'sci-fi',
    ],
    whyItWorks: `Scale in a matte painting is a relative judgment the viewer's eye makes, not an absolute quality of the described structure — a description that only names a structure as "colossal" or "vast" gives the model an adjective to aim for but no actual reference point for the viewer to measure that vastness against, and Midjourney's own rendering of "colossal" without a scale anchor tends to default to a merely large-looking structure rather than one that reads as genuinely, disorientingly huge. Including a recognizably human-scale figure or object, even small and distant, gives the eye something it already knows the true size of, and vastness is then read as a ratio against that known reference rather than asserted by a word alone.

Atmospheric depth works through a related but distinct mechanism: real large-scale distance genuinely does desaturate, lighten, and blur detail through haze and air, and naming that effect explicitly gives the model a physically grounded reason to render distant elements differently from near ones, rather than rendering a technically large environment at uniform clarity and saturation throughout — which is a common default that quietly undercuts a scale-driven brief, since uniform clarity at all distances is actually a visual cue for a smaller, more compressed space, not a vast one, even when the described structure itself is enormous.

Explicitly separating foreground, midground, and background addresses a related default tendency: an unstructured environment description tends to produce a flatter compositional read, where detail is distributed fairly evenly across the frame rather than concentrated with the deliberate near-to-far falloff that makes a matte painting feel like it has real spatial layers to travel through. Naming what belongs in each band forces that layering explicitly rather than leaving it to chance.

Recommending a moderate-to-high stylize value specifically for this genre, in contrast to the lower values recommended for photorealistic or literal briefs elsewhere in this category, reflects a genuine difference in what the two output styles need from the model's own aesthetic bias: a matte painting is explicitly a painterly, artistically embellished genre by definition, so the exact painterly instinct that fights a literal architectural render or a true-to-life food shot is the same instinct that actively serves an epic fantasy or sci-fi environment brief — the right stylize setting is a function of what the genre itself wants, not a fixed universal default.`,
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-08-06' }],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against Midjourney v7 for scale-driven fantasy/sci-fi environment concept art.',
      },
    ],
  },
  {
    slug: 'midjourney-seed-locked-icon-set-consistency',
    category: 'midjourney',
    title:
      'Hold a whole icon set visually consistent with --seed, no reference image needed',
    description:
      'A text-only consistency workflow using a locked --seed value across many independently-run icon prompts, for cases where a reference-image-based approach is overkill — a coherent set built purely through disciplined, repeated wording and one shared seed.',
    promptText: `SET CONCEPT
{{set_concept}} — the overall theme uniting every icon in this set, restated identically in every individual icon prompt.

STYLE TEMPLATE
{{style_template}} — the exact rendering style (line weight, color treatment, level of detail) written once here and then copied verbatim into every icon's prompt with no rewording between icons, since even small unintentional wording drift between otherwise-similar prompts is often enough to shift the rendered style noticeably across a set.

FIRST ICON IN THE SET
{{first_icon_subject}} — generate this one first, without a seed specified, and review it against the style template before locking anything; committing to a seed from a result that doesn't actually match the intended style just propagates that mismatch through the entire rest of the set.

SEED TO LOCK
Once the first icon's style is approved, note its seed number and reuse that exact value — {{locked_seed_value}} — as --seed on every subsequent icon in the set.

REMAINING ICONS
{{remaining_icon_subjects}} — generate one at a time, each using the identical style template text and the identical locked seed, changing only the specific subject named for that icon.

WHAT SEED-LOCKING ACTUALLY GUARANTEES
A locked seed biases the model's starting point toward a similar overall composition and rendering approach across prompts that are otherwise worded identically — it narrows random variation, it does not force pixel-perfect consistency the way a reference image would. Some acceptable variation in exact line placement or minor proportion between icons is normal and expected; if the variation crosses into visibly different styles (a different color treatment, a different level of detail) across two icons that used the identical seed and style template text, that is a sign the wording drifted between the two prompts somewhere, not a seed failure.

WHAT TO AVOID
--no {{negative_elements}}

PARAMETERS PER ICON
{{style_template}}, depicting {{icon_subject}} --no {{negative_elements}} --seed {{locked_seed_value}} --ar {{aspect_ratio}} --v 7

OUTPUT
One icon per prompt run, sharing a seed-biased overall style and composition approach across the full set, differing only in the specific object depicted.`,
    variables: [
      {
        name: 'set_concept',
        description: 'The overall theme uniting the icon set.',
        example: 'a set of kitchen and cooking icons for a recipe app',
        required: true,
      },
      {
        name: 'style_template',
        description:
          'The exact rendering-style wording copied verbatim into every icon prompt.',
        example:
          'a minimalist flat-icon design, thin 2px outline, single accent color of warm terracotta, no gradients, no shadow, centered on a plain white background',
        required: true,
      },
      {
        name: 'first_icon_subject',
        description: 'The specific subject for the first, unseeded test icon.',
        example: 'a whisk',
        required: true,
      },
      {
        name: 'locked_seed_value',
        description: 'The seed number carried forward from the approved first icon.',
        example: '2847193056',
        required: true,
      },
      {
        name: 'remaining_icon_subjects',
        description: 'The list of remaining subjects, each generated in its own prompt.',
        example: "a rolling pin, a coffee cup, a mixing bowl, a chef's knife",
        required: true,
      },
      {
        name: 'icon_subject',
        description: 'The specific subject for the current icon prompt in the set.',
        example: 'a rolling pin',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, background texture, drop shadow',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value, kept consistent across the set.',
        example: '1:1',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'seed-locking',
      'icon-design',
      'consistency-workflow',
      'ui-assets',
      'text-only-consistency',
    ],
    whyItWorks: `--seed fixes the initial noise pattern the generation process starts from, which biases otherwise-identical prompts toward a similar overall composition and rendering approach rather than each one starting from an unrelated random starting point — this is a real, useful lever for icon-set consistency precisely because it requires no reference image at all, which matters for a workflow where the icons don't share a face, an object, or a color palette in the --sref or --oref sense, only a shared rendering philosophy that text description alone has to carry.

Generating the first icon without a locked seed and reviewing it before committing to anything addresses a real ordering trap: locking a seed from a result that doesn't actually match the intended style template just propagates that same mismatch through every remaining icon in the set, since the seed is reinforcing whatever composition and rendering tendency that first result happened to land on — a bad first icon, seed-locked, produces a consistently bad set rather than a consistently good one.

Copying the style-template wording verbatim into every icon's prompt, rather than paraphrasing the same intent slightly differently each time, matters because seed-locking only narrows variation between prompts that are otherwise close to identical — it does not correct for or override wording that has actually drifted. Two prompts that describe the same intended style in slightly different words, even with the same seed, can still land on visibly different renderings, because the seed is biasing the starting point of two meaningfully different text-conditioned generations, not forcing two different descriptions to converge on one result.

The explicit distinction between what seed-locking guarantees (a narrowed range of variation) and what it does not (pixel-perfect matching) sets a realistic, checkable expectation that prevents a common frustration: a user expecting a locked seed to behave like a reference image — forcing near-identical results — will read normal, acceptable minor variation between icons as a failure of the technique, when it's actually working within its real, more modest scope. Distinguishing "some line-placement variation" (expected) from "a genuinely different style or detail level" (a real sign of wording drift) gives a concrete standard for telling the two apart rather than a vague sense that something in the set "feels off."`,
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-29' }],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Midjourney v7 --seed for text-only icon-set consistency.',
      },
    ],
  },
  {
    slug: 'midjourney-text-free-logo-mark-concept',
    category: 'midjourney',
    title:
      'Sketch text-free brand mark concepts, honestly scoped around what Midjourney can render',
    description:
      "An icon-only brand mark exploration brief that deliberately avoids asking Midjourney to render any wordmark text — because reliable in-image typography is not Midjourney's strength — and instead focuses its actual strength on the symbolic mark, with the wordmark pairing handled separately in a design tool or a text-rendering-focused model.",
    promptText: `BRAND CONCEPT
{{brand_concept}} — what the brand does or represents, in plain language, as context for what kind of mark would suit it symbolically.

SYMBOLIC DIRECTION
{{symbolic_direction}} — the actual visual idea for the mark itself: an abstract shape, an animal or object rendered iconically, a geometric monogram-adjacent form. This is the one thing Midjourney is actually being asked to design here.

STYLE CATEGORY
{{style_category}} — flat, line-based, geometric, organic, and so on; state this precisely since "modern logo" alone resolves to Midjourney's own generic idea of contemporary branding rather than a specific, intentional style choice.

COLOR TREATMENT
{{color_treatment}}

WHY NO WORDMARK TEXT IS REQUESTED HERE
Midjourney does not reliably render short, legible in-image text the way a text-rendering-focused model does, and a brand mark with garbled or misspelled lettering is worse than no lettering at all for actual client-facing use. This brief is scoped deliberately to the icon-only mark; pair the resulting icon with a separately typeset wordmark in a vector design tool, or generate the wordmark itself with a tool built specifically for text accuracy.

COMPOSITION
{{composition_note}} — where the mark sits in frame and how much negative space surrounds it, since a mark meant to eventually sit beside typeset text needs breathing room built into the composition now, not cropped in tightly as if it were the final, complete logo lockup.

WHAT TO AVOID
--no {{negative_elements}}

PARAMETERS
--style raw --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{symbolic_direction}}, {{style_category}}, {{color_treatment}}, {{composition_note}}, minimalist icon mark, no lettering, no wordmark, on a plain white background --style raw --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

WHAT THIS BRIEF PRODUCES VERSUS A FINISHED LOGO
Treat every result as early symbolic direction, not a production-ready vector mark — Midjourney output is a raster image, not an editable vector file, so a chosen direction still needs to be redrawn or vectorized in a design tool before it becomes an actual usable logo asset, the same way any AI-generated concept sketch needs a production pass before shipping.`,
    variables: [
      {
        name: 'brand_concept',
        description: 'What the brand does, as symbolic context.',
        example: 'a specialty coffee roaster focused on single-origin, small-batch beans',
        required: true,
      },
      {
        name: 'symbolic_direction',
        description: 'The actual visual idea for the mark, with no text involved.',
        example:
          'a single coffee bean rendered as a minimal, abstract topographic contour shape, evoking both the bean and a mountain landscape',
        required: true,
      },
      {
        name: 'style_category',
        description: 'A precise style category rather than a vague "modern" descriptor.',
        example: 'flat, single-line continuous stroke, geometric minimalism',
        required: true,
      },
      {
        name: 'color_treatment',
        description: 'The color approach for the mark.',
        example: 'single deep espresso-brown color, no gradient, no secondary color',
        required: true,
      },
      {
        name: 'composition_note',
        description:
          'Placement and negative space, leaving room for a wordmark to sit beside it later.',
        example:
          'mark occupies the left third of the frame, generous empty space to its right where a wordmark would eventually sit',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example:
          'text, letters, watermark, gradients, drop shadow, photorealistic rendering',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '1:1',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'logo-design',
      'brand-identity',
      'icon-design',
      'symbolic-mark',
      'style-raw',
    ],
    whyItWorks: `Scoping this brief to an icon-only mark and explicitly excluding any wordmark text is not a limitation stated for caution's sake — it targets a specific, well-documented capability gap: Midjourney, unlike a text-rendering-focused model, does not reliably produce short, legible in-image lettering, and a brand mark is exactly the use case where a garbled or misspelled word is worse than useless, since it's the one asset most likely to go in front of a client or into production with the expectation of exact accuracy. Rather than fighting that gap with increasingly elaborate quoted-text instructions that still fail unpredictably, this brief routes around it entirely by asking Midjourney to do only the part it's actually good at — symbolic, iconic visual concepting — and hands the wordmark itself to a separate, better-suited tool or a human typesetting pass.

Requiring a precise style category instead of a vague "modern logo" phrase addresses the same underspecification problem seen across other Midjourney branding and icon work: "modern" resolves to whatever the model's own training distribution considers generically contemporary branding, which produces a plausible-looking but generic result with no specific point of view — naming an actual style category (flat, single-line, geometric) gives the model a concrete rendering approach to commit to rather than an aesthetic mood to loosely gesture toward.

The composition guidance — leaving deliberate negative space for a wordmark that isn't being generated yet — matters because a mark generated as if it were the complete, final logo tends to compose itself centered and self-contained, which then has no natural place for typeset text to sit beside it without cropping or re-composing later. Planning that empty space into the very first exploratory generation, rather than discovering the composition doesn't leave room for a wordmark after a direction has already been chosen and refined, saves an entire round of rework.

The closing distinction between this brief's output and a finished, production-ready logo addresses a category error that's easy to make with any AI image output used for branding work: a raster image, however clean and well-composed, is not an editable vector file, and treating an approved direction from this brief as done rather than as the concept stage before an actual vectorization and typesetting pass sets an expectation that leads to real production problems — a logo that needs to scale from a favicon to a billboard needs vector geometry a raster export cannot provide.`,
    exampleOutput:
      'A clean, symbolic icon mark — no lettering, no attempted wordmark — composed with deliberate open space to one side, ready to hand to a designer for vectorization and pairing with a separately typeset brand name.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Midjourney v7 for text-free symbolic brand mark exploration.',
      },
    ],
    relatedToolSlug: 'business-name-generator',
  },
  {
    slug: 'midjourney-image-prompt-weight-remix',
    category: 'midjourney',
    title: 'Remix an uploaded reference photo with an image prompt and --iw',
    description:
      "A foundational image-prompt workflow — pairing an uploaded reference image URL with text instructions and a tuned --iw weight — for restyling a real photo, turning a rough sketch into finished art, or blending a real scene's composition with new stylistic direction, without touching --cref, --sref, or --oref's more specialized, narrower mechanisms.",
    promptText: `REFERENCE IMAGE
{{reference_image_url}} — the uploaded photo, sketch, or existing image whose composition and general content this generation should draw from.

WHAT IN THE REFERENCE SHOULD CARRY THROUGH
{{elements_to_preserve}} — name specifically which parts of the reference matter most (the composition and camera angle, the color palette, the general layout of objects), since --iw weights the whole reference image as one signal and cannot selectively preserve one element while ignoring another on its own — the text prompt has to do that selective work.

TEXT INSTRUCTIONS FOR THE NEW RESULT
{{new_direction_text}} — what should change or be added relative to the reference: a new style, a different medium, additional detail the reference didn't have.

IMAGE WEIGHT
--iw {{image_weight_value}} — this sets how strongly the reference image's actual visual content competes against the text instructions. Low values (0.5-1) let the text direction dominate, using the reference mostly as loose compositional inspiration. High values (2-3) keep the result much closer to the reference's actual content, using the text mainly to adjust style or add detail on top of it rather than to substantially reinterpret the scene.

WHY THIS IS DIFFERENT FROM CREF, SREF, OR OREF
This is the general-purpose, original image-prompting mechanism — an uploaded image plus text, weighted against each other — rather than one of the specialized reference types built for a narrower job: --cref specifically for a character's face and clothing, --sref specifically for color and lighting style transferred onto new content, --oref specifically for a single object's exact geometry. Use plain image-prompt weighting when the goal doesn't fit neatly into any of those three narrower boxes — restyling a whole photo, or turning a sketch into finished art — rather than forcing one of the specialized types to do a job it wasn't built for.

WHAT TO AVOID
--no {{negative_elements}}

PARAMETERS
--iw {{image_weight_value}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{reference_image_url}} {{new_direction_text}} --iw {{image_weight_value}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

TUNING --IW ACROSS ATTEMPTS
If the result ignores the reference almost entirely and just generates from the text alone, --iw was too low for how much of the reference actually mattered — raise it. If the result barely changes anything from the reference despite clear text instructions to change the style or medium, --iw was too high for what was being asked — lower it, since a very strong image weight can effectively drown out text instructions that are asking for a substantial reinterpretation rather than a light touch-up.`,
    variables: [
      {
        name: 'reference_image_url',
        description:
          'The uploaded photo, sketch, or existing image being used as the base reference.',
        example: 'https://cdn.midjourney.com/mno345-rough-sketch.png',
        required: true,
      },
      {
        name: 'elements_to_preserve',
        description:
          'Which specific parts of the reference matter most to carry through.',
        example:
          'the overall composition and camera angle, and the rough placement of the three main figures',
        required: true,
      },
      {
        name: 'new_direction_text',
        description: 'What should change or be added relative to the reference.',
        example:
          'rendered as a finished, fully painted digital illustration in a warm watercolor style, with detailed lighting and color the rough sketch lacks',
        required: true,
      },
      {
        name: 'image_weight_value',
        description:
          '--iw, roughly 0.5-3. How strongly the reference competes against the text.',
        example: '1.5',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, visible pencil sketch lines',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '16:9',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'image-prompt',
      'image-weight',
      'iw-parameter',
      'sketch-to-art',
      'photo-remix',
    ],
    whyItWorks: `Plain image-prompt weighting is the original, general-purpose version of what --cref, --sref, and --oref later specialized into narrower jobs — all four mechanisms ultimately weight an uploaded image's visual content against the text prompt's instructions, but the three specialized reference types constrain what part of the image gets matched (a face and clothing for --cref, color and light for --sref, one object's geometry for --oref), while plain --iw weights the entire reference image as one undifferentiated signal. That difference is exactly why plain image-prompt weighting is the right tool for jobs that don't fit neatly into one of those three narrower boxes — restyling a whole photograph's medium, or turning a rough sketch into a finished painting — where the goal is closer to "use this whole image as a loose or strong starting point" than "match this one specific attribute of it."

Requiring an explicit statement of which elements of the reference matter most, rather than assuming --iw handles that selectivity on its own, addresses a real limitation of the parameter: it adjusts one overall dial for how strongly the reference competes against the text, but it has no internal mechanism for preserving the reference's composition while discarding its color palette, or vice versa — any selective preservation has to come from what the text prompt explicitly asks for, since the image weight alone only controls how much of the reference bleeds through as an undifferentiated whole, not which specific parts of it do.

The distinction between low --iw ("loose inspiration, text direction dominates") and high --iw ("close to the reference, text mainly adjusts style on top") reflects the actual mechanical trade the parameter makes between two competing signals feeding into one generation — it is not a linear "more reference equals better fidelity" dial, it is a balance point, and picking the wrong side of that balance for the actual goal produces two specific, recognizable failure modes: a too-low setting on a job that needed the reference's composition preserved produces a result that might as well have skipped uploading the reference entirely, while a too-high setting on a job that wanted a substantial reinterpretation produces a result barely different from the source despite clear text instructions asking for real change.

Naming both of those specific failure signatures, and mapping each to the actual direction to adjust --iw next, turns a discouraging "the remix didn't work" result into an immediately actionable next step, rather than a rewritten text prompt that leaves the actual mismatched parameter untouched and produces the same kind of disappointing result on the next attempt.`,
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-08-07' }],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial publish, verified against Midjourney v7 image-prompt --iw weighting for photo and sketch remixing.',
      },
    ],
  },
  {
    slug: 'midjourney-personalization-profile-brand-consistency',
    category: 'midjourney',
    title: "Manage Midjourney's personalization profile for consistent team brand output",
    description:
      "A team-workflow brief for handling Midjourney's always-on personalization — the account-level learned aesthetic bias that quietly shifts default output toward one person's trained taste — so a shared brand asset generated by different team members doesn't silently drift depending on whose account ran the prompt.",
    promptText: `WHAT THIS ASSET IS FOR
{{asset_purpose}} — state clearly that this is a shared brand or client asset rather than personal creative work, since that distinction is exactly what determines whether personalization should be on, off, or shared across this task.

THE ACTUAL CONTENT REQUEST
{{content_description}}

WHY PERSONALIZATION MATTERS FOR THIS JOB
Every Midjourney account accumulates its own personalization profile from that account's past ratings and generation history, and that profile quietly biases default output toward that specific account's learned taste — two team members running the identical text prompt from their own separate accounts can get visibly different results purely because of this account-level bias, with no wording difference responsible for the gap at all.

PERSONALIZATION HANDLING FOR THIS JOB
{{personalization_approach}} — decide and state one of three approaches: turn personalization off entirely with --p off for a neutral, account-independent baseline; use a shared team personalization code with --p {{personalization_code}} so every team member's generations pull from the same trained aesthetic profile regardless of whose account runs the prompt; or, if brand consistency doesn't require this level of control for this particular asset, note explicitly that personalization is being left on the individual runner's account and any resulting variation between team members' outputs is expected and acceptable.

STYLE ANCHOR
{{style_anchor_note}} — for genuinely brand-critical work, pairing an explicit --sref style reference with either --p off or a shared --p code gives two independent, complementary consistency guarantees rather than relying on personalization handling alone.

WHAT TO AVOID
--no {{negative_elements}}

PARAMETERS
{{personalization_flag}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{content_description}} {{personalization_flag}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7

TEAM DOCUMENTATION NOTE
Whatever approach is chosen for {{personalization_approach}}, write it down where the rest of the team generating assets for this same brand or client can see it — an undocumented, informal convention ("we all just leave personalization on") is the exact condition that produces silent, hard-to-diagnose output drift between team members months into a project, once nobody remembers whether a shared approach was ever actually agreed on.`,
    variables: [
      {
        name: 'asset_purpose',
        description: 'What this asset is for, and why consistency across people matters.',
        example:
          "a set of hero images for a client's product launch, generated by three different team members across the same week",
        required: true,
      },
      {
        name: 'content_description',
        description: 'The actual image request.',
        example:
          "a clean studio product shot of the client's new wireless speaker on a pale grey backdrop",
        required: true,
      },
      {
        name: 'personalization_approach',
        description: 'Which of the three handling approaches applies to this job.',
        example:
          'shared team code — every team member should use the same --p code so results stay consistent regardless of whose account generates them',
        required: true,
      },
      {
        name: 'personalization_code',
        description:
          'The actual shared personalization code, if that approach is chosen.',
        example: 'a1B2c3D4',
        required: false,
      },
      {
        name: 'personalization_flag',
        description:
          'The literal flag to append — --p off, --p <code>, or omitted if leaving it on the individual account.',
        example: '--p a1B2c3D4',
        required: true,
      },
      {
        name: 'style_anchor_note',
        description:
          'Whether a companion --sref is also being used for extra consistency.',
        example:
          'paired with a locked --sref value from an approved prior hero shot, for a second, independent consistency guarantee beyond personalization handling alone',
        required: false,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, props, a second unit of the product',
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: 'Midjourney --ar value.',
        example: '4:5',
        required: false,
      },
    ],
    targetTools: ['Midjourney v7'],
    tags: [
      'midjourney',
      'personalization',
      'brand-consistency',
      'team-workflow',
      'p-parameter',
      'account-bias',
    ],
    whyItWorks: `Midjourney's personalization system trains an account-level aesthetic bias from that account's own rating and generation history, and it is applied by default — this is the direct, mechanical explanation for a specific, confusing team problem: two people on the same brand project, running what looks like an identical text prompt, get results that lean noticeably differently in color, composition preference, or overall polish, purely because their two accounts have each independently trained their own personalization profile from unrelated past use. Without understanding this mechanism, that gap gets misdiagnosed as a wording inconsistency between the two people's prompts, and hours get spent trying to fix wording that was never the actual source of the difference.

Naming three explicit handling options — off, shared code, or accepted individual variation — rather than leaving the decision implicit gives a team a concrete choice to actually make and document, instead of defaulting by omission to "whatever each person's account happens to do," which is the option most likely to produce silent, accumulating drift across a project's asset set specifically because nobody consciously chose it. A shared --p code is the option that actually solves cross-person consistency directly, since it points every team member's generations at the same trained aesthetic profile regardless of whose personal account is technically running the command — closer to a shared brand style guide than to any one person's individual taste.

Recommending a companion --sref alongside whichever personalization approach is chosen, rather than treating personalization handling as sufficient on its own, reflects that the two mechanisms solve genuinely different, complementary problems: personalization handling controls which account-level aesthetic bias is in play, while --sref controls a specific, chosen visual style transferred onto new content — using both together for brand-critical work closes two independent gaps rather than assuming one setting compensates for the other.

The closing instruction to document whichever approach is chosen, rather than treating the decision as a one-time fix, targets the actual long-term failure mode this workflow exists to prevent: an informal, undocumented team convention is exactly the kind of decision that quietly stops being followed months into a project once new team members join or the original context is forgotten, and by the time the resulting drift becomes visible across a large asset set, it is far more expensive to diagnose and correct than writing the agreed approach down once at the start would have been.`,
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against Midjourney v7 --p personalization handling for team brand-asset consistency.',
      },
    ],
  },
  {
    slug: 'midjourney-low-key-cinematic-headshot-lighting-ratio',
    category: 'midjourney',
    title: `Set an exact lighting ratio for a moody, cinematic low-key headshot`,
    description: `A short, direct portrait brief built around naming an exact key-to-fill lighting ratio and a specific film-stock reference, so a request for a 'cinematic headshot' stops meaning generic dark-and-moody and starts meaning a controllable, repeatable look.`,
    promptText: `SUBJECT
{{subject_description}}

LIGHTING RATIO
{{lighting_ratio}} key-to-fill. State the number, not just "dramatic" or "moody" — a ratio like 4:1 tells the model exactly how deep the shadow side of the face should fall relative to the lit side, while a mood adjective alone leaves that decision to Midjourney's own default, which trends toward flatter, more evenly lit faces than most cinematic references actually use.

FILM EMULATION REFERENCE
{{film_stock_reference}} — name a specific stock or digital-cinema look rather than the word "cinematic" on its own, since that word alone has no fixed visual meaning to the model and gets interpreted differently prompt to prompt.

FRAMING AND CROP
{{framing_and_crop}}

MOOD
{{mood_keyword}}

WHAT NOT TO DO
Do not add a heavy vignette on top of the lighting ratio above — a strong key-to-fill ratio already darkens the frame's edges naturally as a byproduct of the light falloff, and stacking an explicit vignette instruction on top of that tends to crush the shadow side into pure black instead of the graded, detailed dark the ratio was meant to produce.

PARAMETERS
--ar {{aspect_ratio}} --stylize {{stylize_value}} --v 7

OUTPUT
{{subject_description}}, lit with a {{lighting_ratio}} key-to-fill ratio, {{film_stock_reference}}, {{framing_and_crop}}, {{mood_keyword}} --ar {{aspect_ratio}} --stylize {{stylize_value}} --v 7`,
    variables: [
      {
        name: 'subject_description',
        description: `Who is in frame and a defining physical detail.`,
        example: `a middle-aged jazz trumpeter with close-cropped grey hair and reading glasses pushed up on his forehead`,
        required: true,
      },
      {
        name: 'lighting_ratio',
        description: `The explicit key-to-fill contrast ratio.`,
        example: `4:1`,
        required: true,
      },
      {
        name: 'film_stock_reference',
        description: `A specific film or digital-cinema look to anchor grain and color response.`,
        example: `shot on Kodak Vision3 500T tungsten-balanced stock, slightly warm highlights against cool shadow`,
        required: true,
      },
      {
        name: 'framing_and_crop',
        description: `How tight the shot is and what's visible.`,
        example: `tight head-and-shoulders crop, three-quarter angle`,
        required: true,
      },
      {
        name: 'mood_keyword',
        description: `The emotional register of the image.`,
        example: `quiet intensity, mid-performance focus rather than a posed studio smile`,
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: `Midjourney --ar value.`,
        example: `2:3`,
        required: false,
      },
      {
        name: 'stylize_value',
        description: `--stylize, 0-1000. Keep moderate to preserve the photographic feel.`,
        example: `150`,
        required: false,
      },
    ],
    targetTools: [`Midjourney v7`],
    tags: [`midjourney`, `cinematic-portrait`, `lighting-ratio`, `film-emulation`, `headshot`],
    whyItWorks: `Naming an explicit key-to-fill ratio gives Midjourney a quantifiable instruction instead of a mood word with no fixed meaning — "4:1" specifies exactly how much darker the shadow side of the face should read relative to the lit side, whereas "moody lighting" or "dramatic lighting" is a phrase the model has seen attached to an enormous range of actual contrast levels in training, so it produces an inconsistent, often too-flat result because it has no single number to converge on. V7's default portrait behavior leans toward even, flattering, front-heavy fill light — a holdover from the aesthetic bias baked into what the model considers a "good" portrait — so an explicit ratio is doing real corrective work against that default rather than just adding flavor text on top of it.

Naming a specific film stock instead of the word "cinematic" works for the same reason the ratio does: "cinematic" is a category label with no fixed visual content, while "Kodak Vision3 500T, tungsten-balanced" names an actual color response — warm highlights, cooler shadows, a specific grain structure — that the model has strong, consistent associations for because that stock's look is well-represented and consistently labeled in its training data. Two different film-stock names will reliably produce two visibly different color grades from the same lighting ratio, which is the whole point of naming one specifically rather than reaching for a generic mood tag.

The warning against stacking a vignette on top of the ratio targets a specific, avoidable failure: a strong lighting ratio already produces natural edge falloff as a physical consequence of the light source's falloff curve, and adding an explicit vignette instruction on top of that double-darkens the frame edges, frequently crushing the graded, still-detailed shadow side the ratio was built to produce into flat, textureless black — losing exactly the shadow detail a genuine low-key cinematic look depends on to read as lit rather than simply underexposed.`,
    exampleOutput: `A tightly cropped three-quarter portrait with a clearly deeper shadow side of the face than lit side, warm tungsten-leaning highlights and a cooler shadow tone consistent with the named film stock, and visible shadow detail rather than crushed black at the frame edges.`,
    verifiedAgainst: [
      { tool: 'Midjourney', version: 'v7', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against Midjourney v7 for explicit lighting-ratio cinematic portraits.`,
      },
    ],
  },
  {
    slug: 'midjourney-instagram-carousel-cohesive-aesthetic-set',
    category: 'midjourney',
    title: `Build an Instagram carousel where slide five still feels like slide one`,
    description: `A three-phase workflow for generating a multi-slide Instagram carousel that reads as one continuous aesthetic instead of five separately-styled images fighting each other in the feed, using one anchor slide's style reference across the whole set.`,
    promptText: `PHASE 1 — ANCHOR SLIDE
Generate the carousel's first slide on its own: {{slide_one_subject}}, {{brand_aesthetic_keywords}}. This is the slide that sets the color grade, lighting mood, and overall texture every later slide has to match, so pick the result you like best from this run before moving on — do not proceed to phase 2 with a first slide you're only half-happy with, since every later slide is judged against it.

PHASE 2 — LOCK THE STYLE
Take the image URL of the anchor slide you picked and set it as {{style_reference_url}}. This becomes the shared --sref value for every remaining slide in the carousel.

PHASE 3 — REMAINING SLIDES
For each additional slide, keep {{brand_aesthetic_keywords}} and {{style_reference_url}} identical and change only the subject: {{additional_slide_subjects}}. Generate one slide at a time rather than batching them, and check each new slide against the anchor before generating the next — a small color-grade drift on slide two, left uncorrected, compounds into a visibly mismatched slide four even with the same --sref value applied throughout.

STYLE WEIGHT
--sw {{style_weight_value}} — push this toward the higher end of the range if a slide's subject is visually very different from the anchor slide's subject (a close product shot after a wide lifestyle anchor, for instance), since a big subject-matter gap is exactly when Midjourney's own default aesthetic tends to reassert itself over the reference style.

CAROUSEL-SPECIFIC RULE
A carousel is judged on completion, not on any single slide in isolation — a viewer who swipes past slide one, two, and three sees them stacked in their peripheral vision before landing on any given slide, so an inconsistency between slides is far more visible here than the same inconsistency would be across five unrelated single posts scrolled past on different days.

PARAMETERS
--sref {{style_reference_url}} --sw {{style_weight_value}} --ar {{aspect_ratio}} --v 7

OUTPUT
One anchor slide, followed by each additional slide sharing its exact --sref value, together forming a set that reads as one shoot when swiped through in sequence.`,
    variables: [
      {
        name: 'slide_one_subject',
        description: `What the first, anchor slide depicts.`,
        example: `a hand pouring cold-brew coffee from a glass carafe into a ceramic cup on a marble counter`,
        required: true,
      },
      {
        name: 'brand_aesthetic_keywords',
        description: `The recurring visual language repeated on every slide.`,
        example: `warm morning light, minimal props, soft neutral color palette, no harsh shadows`,
        required: true,
      },
      {
        name: 'style_reference_url',
        description: `The image URL of the chosen anchor slide, reused as --sref for every remaining slide.`,
        example: `https://cdn.midjourney.com/jkl012-carousel-anchor.png`,
        required: true,
      },
      {
        name: 'additional_slide_subjects',
        description: `What each subsequent slide in the sequence depicts.`,
        example: `slide 2: coffee beans being scooped into a grinder; slide 3: the finished drink on a breakfast table; slide 4: a person's hands wrapped around the cup outdoors`,
        required: true,
      },
      {
        name: 'style_weight_value',
        description: `--sw, 0-1000, raised for slides whose subject differs most from the anchor.`,
        example: `200`,
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: `Midjourney --ar value, kept identical across every slide for feed consistency.`,
        example: `4:5`,
        required: false,
      },
    ],
    targetTools: [`Midjourney v7`],
    tags: [`midjourney`, `instagram`, `carousel`, `style-reference`, `sref`, `social-content`],
    whyItWorks: `A carousel's actual success metric — swipe-through completion — depends on the slides reading as one continuous piece when viewed in rapid sequence, which is a stricter visual bar than five unrelated single posts each judged on their own merits days apart; a viewer's eye catches the edges of adjacent slides in their peripheral vision while swiping, so a color-grade or lighting mismatch between slide two and slide three is far more noticeable here than the identical mismatch would be between two unrelated feed posts. Generating all five slides from five independently-worded prompts, even with identical keyword lists, produces exactly that kind of drift, because each generation still runs through Midjourney's own aesthetic judgment fresh each time with only text to anchor it.

Anchoring every later slide to one chosen first-slide image via --sref, rather than to keywords alone, is what actually closes that gap — --sref conditions each subsequent generation on the anchor's real color grade, lighting character, and texture rather than on the model's independent interpretation of the same adjectives, which is why slide five can depict a completely different subject than slide one and still visually belong to the same shoot. Raising --sw specifically for the slides whose subject matter differs most from the anchor addresses the same style-thinning problem seen across any --sref workflow: the bigger the gap between the anchor's original subject and a new slide's subject, the harder Midjourney's own default aesthetic pulls against the reference style, so an outlier slide often needs a stronger style weight than the rest of the set to stay visually anchored.

Checking each slide against the anchor before generating the next, rather than batch-generating the whole set and reviewing at the end, catches drift while it is still a one-slide problem instead of letting an early inconsistency compound silently across three more generations before anyone notices — by the time a five-slide batch is fully generated, tracing a mismatch back to which slide introduced it is far harder than catching it at slide two.`,
    exampleOutput: `A five-slide carousel where a coffee pour, a bean grind close-up, a finished-drink table shot, an outdoor hands-around-the-cup shot, and a fifth closing shot all share the same warm morning light and neutral palette, reading as one continuous morning-routine story when swiped through.`,
    verifiedAgainst: [
      { tool: 'Midjourney', version: 'v7', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against Midjourney v7 --sref for multi-slide Instagram carousel consistency.`,
      },
    ],
  },
  {
    slug: 'midjourney-brand-moodboard-tile-grid-single-prompt',
    category: 'midjourney',
    title: `Generate a four-quadrant brand moodboard in a single Midjourney prompt`,
    description: `A single-image moodboard recipe that arranges a color chip, a texture close-up, a typography sample, and a material object into one flat-lay grid — a fast first-pass visual reference for a pitch deck, not a substitute for a real, editable brand-guideline document.`,
    promptText: `MOODBOARD CONCEPT
{{brand_name_or_concept}}

GRID LAYOUT
Flat-lay photograph arranged as a 2x2 grid of four equal-sized quadrants, divided by a thin white gutter — state the equal sizing and gutter explicitly, since an unguided grid request tends to let one visually busier quadrant crowd out the others rather than actually dividing the frame evenly.

QUADRANT ONE — COLOR
A physical paint chip or fabric swatch showing {{color_palette}}.

QUADRANT TWO — TEXTURE
A macro close-up of {{texture_and_material_words}}.

QUADRANT THREE — TYPOGRAPHY
A printed card or embossed sample showing {{typography_style_words}} lettering, treated as a physical object in the flat-lay, not as rendered on-screen text.

QUADRANT FOUR — OBJECT
A single object that captures {{mood_keywords}} for this brand, photographed the same flat-lay way as the other three quadrants.

OVERALL LIGHT AND SURFACE
Soft, even overhead studio light, all four quadrants photographed against the same neutral surface so the set reads as one photoshoot rather than four unrelated images stitched together.

COLOR ACCURACY
If this moodboard needs to match an existing brand palette exactly, state {{color_palette}} as hex codes rather than named colors — Midjourney's interpretation of a named color like "terracotta" will vary generation to generation more than a stated hex value will.

PARAMETERS
--ar {{aspect_ratio}} --stylize {{stylize_value}} --v 7

OUTPUT
One flat-lay image, four equal quadrants divided by a thin white gutter: color chip, texture close-up, typography sample, and mood object, all lit and surfaced identically --ar {{aspect_ratio}} --stylize {{stylize_value}} --v 7

USE THIS AS A FIRST PASS, NOT THE FINAL DELIVERABLE
Treat the result as a fast visual gut-check for a pitch or internal review, not as the client-facing brand guideline itself — a real moodboard deliverable typically needs each quadrant sourced, credited, and editable independently, which a single generated image cannot provide.`,
    variables: [
      {
        name: 'brand_name_or_concept',
        description: `The brand or concept this moodboard represents.`,
        example: `a small-batch olive oil brand positioning itself as rustic but modern`,
        required: true,
      },
      {
        name: 'color_palette',
        description: `The palette, ideally as hex codes for accuracy.`,
        example: `#6B7A4F (olive green), #E8DCC4 (unbleached linen), #A63D2F (terracotta accent)`,
        required: true,
      },
      {
        name: 'texture_and_material_words',
        description: `The material texture that represents the brand's tactile feel.`,
        example: `raw unbleached linen weave next to a rough cork stopper`,
        required: true,
      },
      {
        name: 'typography_style_words',
        description: `The lettering style, described as a physical printed or embossed sample.`,
        example: `a serif letterpress card with generous letter spacing, deep ink impression`,
        required: true,
      },
      {
        name: 'mood_keywords',
        description: `The single object standing in for the brand's overall feel.`,
        example: `a hand-thrown ceramic pouring vessel with an uneven, hand-finished glaze`,
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: `Midjourney --ar value.`,
        example: `1:1`,
        required: false,
      },
      {
        name: 'stylize_value',
        description: `--stylize, 0-1000. Keep low-to-mid so the flat-lay reads as documentary photography rather than an over-stylized illustration.`,
        example: `100`,
        required: false,
      },
    ],
    targetTools: [`Midjourney v7`],
    tags: [`midjourney`, `brand-moodboard`, `flat-lay`, `grid-composition`, `branding`, `color-palette`],
    whyItWorks: `Describing the image explicitly as a flat-lay photograph arranged into an equal, gutter-divided 2x2 grid gives Midjourney a recognizable compositional template — this exact style of divided product/texture flat-lay is a well-represented photography genre in its training data, distinct from an open-ended "moodboard collage" request with no stated layout logic, which tends to produce an unevenly weighted composition where one visually dominant element crowds the frame instead of four genuinely separate, equally-weighted quadrants. Stating the equal sizing and the thin white gutter explicitly is what actually forces that even division, because an unstated grid defaults to whatever composition the model finds most visually interesting for the described objects, not necessarily the balanced reference-sheet layout a moodboard needs.

Treating each quadrant as its own separately-described physical object — a paint chip, a fabric close-up, a printed card, a standalone object — rather than one paragraph describing "a brand moodboard with these elements" matters because Midjourney renders concrete physical objects with specific material properties far more reliably than it renders an abstract compositional concept like "moodboard" on its own, which has no fixed visual referent and gets interpreted inconsistently. Framing the typography quadrant as a physical printed or embossed card, rather than asking for rendered on-screen lettering, sidesteps Midjourney's well-known unreliability at generating legible arbitrary text — a photographed physical letterform sample is something the model can render convincingly, while asking it to spell out actual brand copy usually produces garbled or misspelled characters.

Locking the palette to hex codes rather than named colors matters here for the same reason it matters in any pattern or brand-matching workflow: a moodboard's entire purpose is color-accurate reference, and named colors drift generation to generation in a way a specific hex value does not. The closing instruction to treat this as a fast first pass rather than a finished deliverable is an honest limitation, not a hedge — a single generated image cannot be individually sourced, credited, or edited quadrant by quadrant the way an actual client-facing brand-guideline document needs to be, so its real value is speeding up the gut-check stage before that real document gets built.`,
    exampleOutput: `One flat-lay image divided into four equal quadrants by a thin white gutter — an olive-green fabric swatch, a macro shot of raw linen weave against cork, a letterpress-printed serif type card, and a hand-thrown ceramic vessel — all lit evenly against the same neutral surface.`,
    verifiedAgainst: [
      { tool: 'Midjourney', version: 'v7', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Midjourney v7 for single-prompt four-quadrant brand moodboards.`,
      },
    ],
  },
  {
    slug: 'midjourney-tilt-shift-miniature-world-diorama',
    category: 'midjourney',
    title: `Turn a real-world scene into a tilt-shift miniature diorama`,
    description: `A tilt-shift miniature-effect brief built around the actual optical mechanism — a narrow, oddly-shaped focus plane and a high oblique camera angle — rather than the word "miniature" alone, which Midjourney frequently renders as small props scattered around a normal-scale scene instead of the toy-like effect that word is meant to evoke.`,
    promptText: `REAL-WORLD SCENE
{{real_world_scene}}

CAMERA ANGLE
{{camera_angle}} — the elevated, oblique angle is doing as much work as the focus effect below; a tilt-shift miniature look is shot from above looking down at a shallow angle onto the scene, the way a person would look down at a model train set on a table, and a straight-on eye-level angle undercuts the illusion no matter how the focus is described.

FOCUS PLANE
{{focus_plane_note}} — describe a narrow horizontal band of the frame as sharp with everything above and below that band falling into soft blur, since this specific selective-focus shape, not the word "miniature" on its own, is what actually reads as toy-scale to a viewer; a real tilt-shift lens produces exactly this narrow in-focus band by physically tilting the lens plane relative to the sensor.

COLOR AND CONTRAST
{{color_saturation_note}} — toy and model photography reads as more saturated and higher-contrast than the equivalent full-scale real-world scene, so push color and contrast noticeably past what the actual real-world reference would look like.

WHAT TO AVOID
Do not rely on the word "miniature" or "tiny" alone to carry the effect — those words alone are just as likely to produce a normal-scale scene with small toy props placed in it as they are to produce the genuine optical illusion this brief is describing; the elevated angle and narrow focus band above are what actually do that work.

PARAMETERS
--ar {{aspect_ratio}} --stylize {{stylize_value}} --v 7

OUTPUT
{{real_world_scene}}, shot from {{camera_angle}}, {{focus_plane_note}}, {{color_saturation_note}}, tilt-shift miniature effect --ar {{aspect_ratio}} --stylize {{stylize_value}} --v 7`,
    variables: [
      {
        name: 'real_world_scene',
        description: `The real, full-scale scene to render as a miniature.`,
        example: `a busy downtown intersection with yellow taxis and pedestrians crossing at dusk`,
        required: true,
      },
      {
        name: 'camera_angle',
        description: `The elevated, oblique viewing angle that sells the toy-scale illusion.`,
        example: `a high oblique angle looking down at roughly 45 degrees, as if from a tall rooftop across the street`,
        required: true,
      },
      {
        name: 'focus_plane_note',
        description: `The narrow sharp band and how the rest falls into blur.`,
        example: `a narrow horizontal band across the middle of the intersection in sharp focus, with the near foreground and far background falling into soft blur`,
        required: true,
      },
      {
        name: 'color_saturation_note',
        description: `How much to push color and contrast beyond a realistic reading.`,
        example: `noticeably boosted saturation on the taxi yellow and traffic lights, punchy contrast, like backlit plastic`,
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: `Midjourney --ar value.`,
        example: `3:2`,
        required: false,
      },
      {
        name: 'stylize_value',
        description: `--stylize, 0-1000. Slightly higher than a straight photo brief helps lean into the toy-like rendering.`,
        example: `250`,
        required: false,
      },
    ],
    targetTools: [`Midjourney v7`],
    tags: [`midjourney`, `tilt-shift`, `miniature-effect`, `diorama`, `photography-technique`],
    whyItWorks: `The tilt-shift miniature illusion is a specific, well-documented optical effect — a real tilt-shift lens physically angles its lens plane relative to the camera's sensor, which produces an unusually narrow, sometimes wedge-shaped band of sharp focus instead of the ordinary near-to-far focus falloff a normal lens produces, and it is that specific focus geometry the human eye associates with toy and model photography, not the word "small" or "miniature" itself. Prompting Midjourney with "miniature" or "tiny" alone gives the model no information about this focus geometry at all, so it just as often interprets the request literally — rendering small toy-scale props scattered inside an otherwise normal, fully-in-focus scene — as it produces the intended illusion, because both readings are plausible completions of a vague size adjective with no optical instruction attached.

Naming the elevated, oblique camera angle explicitly matters for the same reason: the miniature illusion depends on a viewing angle people associate with looking down at a tabletop model, and a straight-on eye-level shot of the identical scene with the identical focus band applied reads far less convincingly as toy-scale, because that viewing angle is itself part of what the brain recognizes as "looking down at a small thing" independent of focus. Describing both the angle and the focus band together gives the model two mutually reinforcing physical cues rather than one vague style label doing all the work alone.

The saturation and contrast push targets a secondary but well-established convention of toy photography — plastic and resin miniatures reflect light differently than the full-scale materials they represent, typically reading as glossier and more saturated under the same lighting, so real tilt-shift photography of full-scale scenes is conventionally graded with boosted color and contrast specifically to borrow that plastic-toy color signature, and skipping that step leaves an image with the right focus geometry but a color palette that still reads as a real, full-scale photograph rather than a model.`,
    exampleOutput: `A downtown intersection viewed from a high oblique rooftop angle, with only a narrow band across the middle of the frame in sharp focus and the foreground and background falling into soft blur, taxis and traffic lights rendered in boosted, glossy, toy-like saturation.`,
    verifiedAgainst: [
      { tool: 'Midjourney', version: 'v7', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against Midjourney v7 for optically-grounded tilt-shift miniature scenes.`,
      },
    ],
  },
  {
    slug: 'midjourney-anamorphic-cinematic-scene-color-script',
    category: 'midjourney',
    title: `Write a wide cinematic scene with anamorphic lens character and a locked color script`,
    description: `A three-part cinematic-scene brief that names the actual optical traits of anamorphic glass — oval bokeh, horizontal flare streaks — instead of the word "cinematic" alone, paired with a short, deliberately locked color script so a sequence of related shots doesn't drift in grade from one generation to the next.`,
    promptText: `SCENE AND ACTION
{{scene_and_action}}

ANAMORPHIC LENS CHARACTER
{{anamorphic_lens_note}} — name the actual optical traits (oval-shaped background bokeh, horizontal blue-tinted flare streaks off practical lights, slight edge distortion) rather than the single word "cinematic," which carries no fixed visual meaning to the model on its own and gets rendered inconsistently prompt to prompt.

COLOR SCRIPT
{{color_script}} — name two or three specific colors this scene, and every other shot in its sequence, should be locked to, the way a film's actual color script plans a handful of deliberate color beats across a whole sequence rather than letting each shot's grade be decided independently. Reuse this exact color-script wording, unchanged, in every other shot prompt belonging to the same sequence.

TIME OF DAY AND LIGHT SOURCE
{{time_of_day}}

WHAT TO AVOID
--no {{negative_elements}}

PARAMETERS
--ar {{aspect_ratio}} --stylize {{stylize_value}} --v 7

OUTPUT
{{scene_and_action}}, {{anamorphic_lens_note}}, {{color_script}}, {{time_of_day}} --no {{negative_elements}} --ar {{aspect_ratio}} --stylize {{stylize_value}} --v 7

CARRYING THIS ACROSS A MULTI-SHOT SEQUENCE
If this scene is one shot in a longer sequence, keep the {{anamorphic_lens_note}} and {{color_script}} lines worded identically across every shot's prompt and change only {{scene_and_action}} and {{time_of_day}} — the lens character and color script are what make a set of otherwise different shots read as belonging to the same film, and any wording drift between shots in those two lines is the most common cause of a sequence that looks like several different productions cut together.`,
    variables: [
      {
        name: 'scene_and_action',
        description: `What is happening in this specific shot.`,
        example: `a lone figure walking away down an empty rain-slicked highway, taillights receding in the distance`,
        required: true,
      },
      {
        name: 'anamorphic_lens_note',
        description: `The specific optical traits of anamorphic glass, named explicitly.`,
        example: `oval-shaped bokeh on the background lights, horizontal blue flare streaks off the taillights, subtle barrel distortion at the frame edges`,
        required: true,
      },
      {
        name: 'color_script',
        description: `Two or three locked colors this shot and its sequence should be graded toward.`,
        example: `deep teal shadows, warm amber practical lights, muted desaturated midtones — no other color family present`,
        required: true,
      },
      {
        name: 'time_of_day',
        description: `The time of day and dominant light source.`,
        example: `true night, lit only by sodium streetlights and the car's own taillights`,
        required: true,
      },
      {
        name: 'negative_elements',
        description: `Comma-separated list of things to actively exclude.`,
        example: `text, watermark, lens flare on the horizon sun, daylight`,
        required: false,
      },
      {
        name: 'aspect_ratio',
        description: `Midjourney --ar value, wide for a scene rather than a portrait crop.`,
        example: `21:9`,
        required: false,
      },
      {
        name: 'stylize_value',
        description: `--stylize, 0-1000. Kept moderate to preserve a grounded, photographic scene rather than a painterly one.`,
        example: `150`,
        required: false,
      },
    ],
    targetTools: [`Midjourney v7`],
    tags: [`midjourney`, `cinematic-scene`, `anamorphic`, `color-script`, `wide-shot`, `film-look`],
    whyItWorks: `The word "cinematic" on its own is a category label with no consistent visual content — it has been attached to an enormous range of actual looks across the model's training data, so it produces an unpredictable result each time. Anamorphic lens character has specific, well-documented physical traits instead: oval rather than circular background bokeh, caused by the lens's non-spherical elements; horizontal-streaking flare off practical light sources, caused by the anamorphic squeeze itself; and mild edge distortion. Naming those traits directly gives the model concrete optical geometry to render, which is why two different anamorphic-trait descriptions produce two visibly different, specifically anamorphic-looking results, while two different uses of the bare word "cinematic" might produce nothing in common at all.

A color script — borrowed directly from real film production, where a handful of deliberate color beats are planned across an entire sequence before any shot is lit — solves a problem that is otherwise invisible shot to shot: without a locked, reused color description, each individual generated shot might look perfectly graded in isolation while still drifting slightly warmer, cooler, more saturated, or less saturated than its neighbors once several shots from the same intended sequence sit next to each other. Naming two or three specific colors and reusing that exact wording, unchanged, across every shot in the sequence is what actually prevents that drift, since it is the only thing giving each independent generation the same fixed color target to converge toward — Midjourney has no memory between separate generations, so nothing except identically-worded text carries the color decision from one shot's prompt to the next.

The instruction to keep the lens-note and color-script lines worded identically across a multi-shot sequence, while letting the scene and time-of-day lines vary freely, isolates the two variables that actually determine whether a sequence reads as one production: everything else in a shot list naturally changes shot to shot by design, but the optical character and color grade are the two threads that need to stay constant underneath that variation, and even small unintentional wording drift in either one is the most common cause of a shot sequence that ends up looking like footage from several different films spliced together.`,
    exampleOutput: `A wide, 21:9 night highway shot with a lone receding figure, taillights producing horizontal blue-tinted flare streaks and oval background bokeh, graded toward deep teal shadows and warm amber practicals — a look that would hold consistently across other shots in the same sequence sharing the identical lens and color-script wording.`,
    verifiedAgainst: [
      { tool: 'Midjourney', version: 'v7', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against Midjourney v7 for anamorphic-lens cinematic scenes with a locked color script.`,
      },
    ],
  },
  {
    slug: 'midjourney-high-fashion-editorial-lookbook-sequence',
    category: 'midjourney',
    title: `Keep the same model reading consistent across a fashion lookbook's different looks`,
    description: `A fashion-editorial workflow using --cref with a deliberately low --cw so the model's face stays recognizable across a lookbook while each look's garment and drape render on their own terms, plus explicit fabric-movement language to counter Midjourney's tendency to render clothing as static rather than worn.`,
    promptText: `MODEL REFERENCE
One clear reference image establishing the model's face and general build. Its URL goes in {{model_reference_url}}.

CHARACTER WEIGHT — KEPT LOW ON PURPOSE
--cw {{character_weight_value}} — set this low, in the 10-40 range, not the 100 default. At --cw 100, --cref pulls the reference image's clothing along with the face, which actively fights a lookbook where every look is a different garment by design; a low --cw matches face and general build while leaving the garment entirely to this look's own text description below.

THIS LOOK'S GARMENT
{{look_description}}

FABRIC BEHAVIOR
{{fabric_movement_note}} — name how the specific fabric should move or hang, since Midjourney's default rendering of clothing tends toward static, catalog-flat drape unless the movement is stated explicitly; a silk slip dress and a structured wool coat should visibly behave differently in the same gust of wind or the same stride, and the model will not supply that difference on its own from the garment name alone.

POSE AND ENERGY
{{pose_and_movement}}

EDITORIAL MOOD
{{editorial_mood}}

WHAT NOT TO DO
Do not describe the garment as "flowing" or "elegant" as a substitute for naming the actual fabric and its behavior — those words describe an intended feeling, not a physical property the model can render, and tend to default back to the same generic drape regardless of which garment is named.

PARAMETERS
--cref {{model_reference_url}} --cw {{character_weight_value}} --ar {{aspect_ratio}} --v 7

OUTPUT
{{look_description}}, {{fabric_movement_note}}, {{pose_and_movement}}, {{editorial_mood}} --cref {{model_reference_url}} --cw {{character_weight_value}} --ar {{aspect_ratio}} --v 7

ACROSS THE FULL LOOKBOOK
Reuse the identical {{model_reference_url}} for every look in the set, and re-check --cw each time a new look's garment silhouette is very different from the reference image's original outfit — a look far more fitted or far looser than the reference tends to need --cw pushed toward the lower end of the range to keep the reference from fighting the new silhouette.`,
    variables: [
      {
        name: 'model_reference_url',
        description: `The image URL of the anchor image establishing the model's face and build.`,
        example: `https://cdn.midjourney.com/mno345-lookbook-model.png`,
        required: true,
      },
      {
        name: 'character_weight_value',
        description: `--cw, kept low (roughly 10-40) so only the face and build carry over, not the reference outfit.`,
        example: `20`,
        required: true,
      },
      {
        name: 'look_description',
        description: `This specific look's garment.`,
        example: `an oversized ivory raw-silk trench coat, cinched loosely at the waist, worn open over nothing beneath`,
        required: true,
      },
      {
        name: 'fabric_movement_note',
        description: `How this specific fabric should physically move or hang.`,
        example: `raw silk with visible slubbed texture, catching a light breeze so the coat's open front lifts slightly away from the body mid-stride`,
        required: true,
      },
      {
        name: 'pose_and_movement',
        description: `The pose and sense of motion in the shot.`,
        example: `mid-stride on a concrete runway, caught in motion rather than posed still`,
        required: true,
      },
      {
        name: 'editorial_mood',
        description: `The overall tone of the shoot.`,
        example: `austere, high-contrast studio editorial, minimal set, all attention on the garment`,
        required: true,
      },
      {
        name: 'aspect_ratio',
        description: `Midjourney --ar value, kept consistent across the lookbook.`,
        example: `3:4`,
        required: false,
      },
    ],
    targetTools: [`Midjourney v7`],
    tags: [`midjourney`, `fashion-editorial`, `cref`, `lookbook`, `character-consistency`, `fabric-rendering`],
    whyItWorks: `A fashion lookbook creates a specific conflict that a comic-panel or portrait use of --cref does not: every look is, by definition, a different garment, so the reference image's own clothing is actively unwanted information in every generation after the first. --cw 100, the default, matches face, hair, and clothing together because Midjourney has no separate lever for "match the face but not the outfit" built into the parameter itself — the only way to get that selective match is to deliberately lower --cw into the 10-40 range, which biases the reference match toward facial features and general build while letting the new look's own text description take over the garment entirely, rather than having the reference outfit bleed through or visibly compete with the described one.

Naming actual fabric behavior instead of feeling-words like "flowing" or "elegant" targets a specific, well-known rendering bias: Midjourney's default clothing rendering tends toward a flat, catalog-still drape because that is how a large share of its fashion-photography training data actually presents garments — folded, hung, or standing still rather than caught mid-movement — so a word like "elegant" gives the model an emotional target with no physical information about how the material actually behaves, and it falls back to that same static default regardless of which garment is named. Describing how a specific fabric moves — raw silk lifting in a breeze versus a structured wool coat holding its shape through the same stride — gives the model an actual physical difference to render between two different garments, which "flowing" and "elegant" alone cannot supply since neither names a material property at all.

Re-checking --cw whenever a new look's silhouette differs sharply from the reference image's original outfit addresses the same style-thinning dynamic seen in other reference-image workflows: the bigger the visual gap between what the reference image actually shows and what the current generation is describing, the harder the reference tries to reassert its own visual information, so an oversized, loose silhouette following a reference photographed in a fitted outfit typically needs --cw pushed even lower than the rest of the lookbook to keep the reference's original clothing from fighting the new look's shape.`,
    exampleOutput: `A mid-stride editorial shot of a model whose face and build clearly match the reference image, wearing an oversized raw-silk trench with visible texture and a front hem lifting naturally in motion, against a stark high-contrast studio backdrop — with the same face carrying recognizably into other looks in the set that swap the garment entirely.`,
    verifiedAgainst: [
      { tool: 'Midjourney', version: 'v7', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against Midjourney v7 --cref/--cw for consistent-model fashion lookbook sequences.`,
      },
    ],
  },
]
