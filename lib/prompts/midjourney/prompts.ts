import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'midjourney-v7-natural-language-portrait',
    category: 'midjourney',
    title: 'Write a natural-language portrait brief for Midjourney v7',
    description:
      'A V7-style portrait photography brief written as a flowing natural-language description rather than a comma-separated keyword stack, tuned for a believable, editorial-looking human portrait.',
    promptText:
      'A {{subject_description}} {{action_or_pose}} in {{setting}}, {{lighting_description}}, shot on {{camera_and_lens}}, {{mood_or_atmosphere}} --ar {{aspect_ratio}} --v 7',
    variables: [
      {
        name: 'subject_description',
        description: 'Who is in the frame — age, build, defining physical detail.',
        example:
          'a weathered fisherman in his sixties with sun-creased skin and a grey beard',
        required: true,
      },
      {
        name: 'action_or_pose',
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
        description: 'The light source, direction, and quality.',
        example: 'soft directional light from a low winter sun, cutting through the fog',
        required: true,
      },
      {
        name: 'camera_and_lens',
        description:
          'A specific camera/lens pairing to anchor the depth of field and rendering.',
        example: 'a Canon EOS R5 with an 85mm f/1.2 lens, shallow depth of field',
        required: true,
      },
      {
        name: 'mood_or_atmosphere',
        description: 'The overall emotional register of the image.',
        example: 'quiet, contemplative, documentary realism',
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
      'portrait-photography',
      'natural-language-prompting',
      'photorealism',
    ],
    whyItWorks:
      "Midjourney V7 was retrained to parse a full natural-language brief the way a human photographer would, not a flat list of isolated tags — this is the single biggest prompting-behavior change from V6. On V6, stacking quality tags like \"8k, hyperrealistic, masterpiece, highly detailed\" reliably nudged output quality upward; on V7 those tags do noticeably less, and can even fight the model's own (already strong) default realism by pulling it toward an over-processed look. Writing the subject, action, setting, and light as connected phrases — the way you'd brief a photographer — gives V7 the causal relationships it was trained to use (this light, on this subject, doing this action) instead of a bag of disconnected keywords. --ar sets the frame shape; --v 7 pins the model version explicitly so the prompt doesn't silently drift to whatever Midjourney defaults to next.",
    exampleOutput:
      'A single, editorial-looking portrait matching the described subject, pose, and lighting — expect real photographic variation between the four grid options (skin texture, exact framing, micro-expression) rather than four near-identical copies.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-20' }],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, written and verified against Midjourney v7 as a natural-language brief.',
      },
    ],
  },
  {
    slug: 'midjourney-stylize-chaos-parameter-tuning',
    category: 'midjourney',
    title: "Dial in Midjourney's --stylize and --chaos for concept-art exploration",
    description:
      'A concept-art brief paired with a --stylize/--chaos/--no parameter recipe for deliberately controlling how far Midjourney drifts from your literal description and how varied its 4-image grid is.',
    promptText:
      '{{subject_and_scene}}, {{style_reference}}, {{color_palette}} --stylize {{stylize_value}} --chaos {{chaos_value}} --no {{negative_elements}} --ar {{aspect_ratio}} --v 7',
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
        example:
          'in the style of matte-painting concept art, in the spirit of Simon Stålenhag',
        required: true,
      },
      {
        name: 'color_palette',
        description: 'The dominant colors of the scene.',
        example: 'dusty rust oranges against a deep indigo sky',
        required: true,
      },
      {
        name: 'stylize_value',
        description:
          '--stylize, 0–1000. Low = literal and flat; high = painterly and artistically embellished.',
        example: '250',
        required: true,
      },
      {
        name: 'chaos_value',
        description:
          '--chaos, 0–100. Low = similar, safe grid variations; high = wildly different interpretations.',
        example: '35',
        required: true,
      },
      {
        name: 'negative_elements',
        description: 'Comma-separated list of things to actively exclude.',
        example: 'text, watermark, extra limbs',
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
    ],
    whyItWorks:
      "--stylize and --chaos control two genuinely different axes, and confusing them is the most common Midjourney parameter mistake. --stylize governs how much of Midjourney's own aesthetic bias overrides your literal description — low values (0–100) render close to what you typed, sometimes flatly; high values (500+) add painterly embellishment the model decided looks good, even if you didn't ask for it. --chaos governs variation between the four images in a single grid, not how \"wild\" any one image looks — low chaos gives four safe, similar takes on your idea; high chaos gives four genuinely different interpretations, which is the right tool for surveying an idea space before you've committed to a direction. A practical workflow: run at high chaos first to see the range of interpretations, pick the direction you like, then lock stylize and drop chaos toward 0 to get consistent, refinable variations of that one direction. --no is Midjourney's real negative-prompt mechanism — unlike Flux or DALL·E-style models, its underlying diffusion process supports true negative conditioning, so --no text actually suppresses text rather than just being ignored.",
    exampleOutput:
      'A 2x2 grid of concept-art style images sharing the same subject and palette, with the degree of divergence between the four scaling with the chaos value and the amount of artistic embellishment scaling with the stylize value.',
    verifiedAgainst: [{ tool: 'Midjourney', version: 'v7', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Midjourney v7 with current --stylize/--chaos ranges.',
      },
    ],
  },
]
