import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'nano-banana-ecommerce-product-photography',
    category: 'nano-banana',
    title: 'Shoot a clean e-commerce product photo with Nano Banana',
    description:
      "A studio product-photography brief tuned for Nano Banana (Gemini 3.1 Flash Image) — the model's best-documented real-world strength is photorealistic, catalog-ready product shots with accurate materials and reflections.",
    promptText:
      'A professional product photograph of {{product_description}}, placed {{placement_and_surface}}, {{background_description}}, {{lighting_setup}}, {{camera_angle}}, sharp focus on {{focus_detail}}, no props, no text overlays, e-commerce catalog style, high resolution',
    variables: [
      {
        name: 'product_description',
        description: 'The product, including material and finish.',
        example: 'a matte-black ceramic pour-over coffee dripper with a wooden collar',
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
    ],
    targetTools: ['Nano Banana / Gemini 3.1 Flash Image'],
    tags: ['nano-banana', 'gemini', 'product-photography', 'ecommerce', 'photorealism'],
    whyItWorks:
      'Nano Banana is a natively multimodal image model trained heavily on grounded, real-world scenes rather than stylized art, which is exactly why it\'s become the go-to free tool for e-commerce sellers redoing product shots in 2026 — it renders plausible material response (matte ceramic vs. glossy plastic, soft vs. hard shadow) more reliably than art-generation-first models. It has no --no flag, no bracket-parameter syntax, and no separate negative-prompt field at all: everything you want excluded (props, text, clutter) has to be stated as a positive instruction inside the brief itself, the same steering method Flux and DALL·E-style models use. Nano Banana also supports turn-by-turn conversational refinement of the same image ("make the background whiter," "move the key light further left") rather than only full regeneration, so treat a first pass as a draft to iterate on, not a final take.',
    exampleOutput:
      'A clean, evenly lit product photo suitable for a listing thumbnail — exact reflections, shadow softness, and crop will vary between generations, and getting the background or focus exactly right sometimes takes one or two conversational follow-up edits rather than a single perfect pass.',
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
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image).',
      },
    ],
  },
  {
    slug: 'nano-banana-brand-mood-board',
    category: 'nano-banana',
    title: 'Turn a hex palette into a brand mood-board with Nano Banana',
    description:
      'A composited flat-lay mood-board brief for Nano Banana (Gemini 3.1 Flash Image) that locks every object and surface to a fixed hex palette — the natural next step after generating a palette with the Colour Palette Generator.',
    promptText:
      'A flat-lay brand mood-board photograph showing {{material_objects}} arranged on {{surface_description}}, every object and the surface strictly limited to this color palette: {{hex_palette}}, {{lighting_description}}, shot from directly overhead, {{composition_style}}, no text, no logos',
    variables: [
      {
        name: 'material_objects',
        description: 'The real-world objects to compose into the flat-lay.',
        example:
          'a swatch of linen fabric, a small ceramic bowl, a sprig of dried eucalyptus, a stack of blank business cards, a fountain pen',
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
        example: 'soft natural window light from one side, gentle visible shadows',
        required: true,
      },
      {
        name: 'composition_style',
        description: 'How the objects are laid out relative to each other.',
        example: 'loosely gridded, generous negative space, editorial flat-lay style',
        required: false,
      },
    ],
    targetTools: ['Nano Banana / Gemini 3.1 Flash Image'],
    tags: [
      'nano-banana',
      'gemini',
      'mood-board',
      'brand-identity',
      'color-palette',
      'flat-lay',
    ],
    whyItWorks:
      'Nano Banana\'s grounded, photoreal strength extends naturally to compositing a believable arrangement of real-world materials, which is what a brand mood-board actually is. Pasting exact hex codes into the prompt — rather than only color-name adjectives — gives it a much tighter, more literal color target, which matters because a mood-board is judged on color accuracy first, not artistic license. Like Flux, Nano Banana has no negative-prompt field, so "no text, no logos" only works as a positive instruction stated inside the brief itself, not as a separate exclusion list. The practical workflow this is built for: run the Colour Palette Generator first, then paste its hex output straight into hex_palette here.',
    exampleOutput:
      'An overhead flat-lay image with the requested objects color-graded toward — not laser-precise to — the specified hex codes; treat it as directional mood-board material for a pitch or brand deck, not a pixel-accurate color proof.',
    verifiedAgainst: [
      {
        tool: 'Nano Banana / Gemini 3.1 Flash Image',
        version: 'Gemini 3.1 Flash Image',
        date: '2026-08-03',
      },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Nano Banana (Gemini 3.1 Flash Image) for hex-locked flat-lay composition.',
      },
    ],
    relatedToolSlug: 'color-palette-generator',
  },
]
