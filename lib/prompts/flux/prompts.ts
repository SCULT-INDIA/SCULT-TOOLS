import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'flux-2-editorial-lifestyle-photograph',
    category: 'flux',
    title: 'Brief Flux.2 for an editorial lifestyle photograph, no negative prompts',
    description:
      'A camera-aware natural-language brief for Flux.2, which — like other flow-matching and DALL·E-style models — has no negative-prompt field; unwanted elements are steered out through what you describe, not through an exclusion list.',
    promptText:
      '{{scene_description}}, {{subject_detail}}, {{lighting_and_time_of_day}}, {{camera_and_lens}}, {{color_and_film_look}}, composition: {{composition_note}}',
    variables: [
      {
        name: 'scene_description',
        description: 'The setting and overall feel of the location.',
        example: 'a small independent bookshop café corner, warm and lived-in',
        required: true,
      },
      {
        name: 'subject_detail',
        description: 'Who is in the frame and what they are doing, including expression.',
        example:
          'a young woman in a cream knit sweater reading a paperback at a window table, soft candid expression',
        required: true,
      },
      {
        name: 'lighting_and_time_of_day',
        description: 'Light source, quality, and time of day.',
        example: 'late-afternoon window light, warm and slightly hazy, long soft shadows',
        required: true,
      },
      {
        name: 'camera_and_lens',
        description: 'A camera body and lens to anchor the photographic rendering.',
        example: 'shot as if on a Fujifilm X-T5 with a 35mm f/1.4 lens',
        required: true,
      },
      {
        name: 'color_and_film_look',
        description: 'The color grade or film stock reference.',
        example:
          'warm Kodak Portra 400 color grade, gentle film grain, slightly lifted blacks',
        required: false,
      },
      {
        name: 'composition_note',
        description: 'Explicit framing and negative-space instructions.',
        example:
          'rule-of-thirds, window and bookshelves framing the left third, generous negative space on the right',
        required: true,
      },
    ],
    targetTools: ['Flux.2'],
    tags: [
      'flux',
      'photorealism',
      'editorial-photography',
      'no-negative-prompt',
      'film-look',
    ],
    whyItWorks:
      'Flux.2 has no --no parameter and no negative-prompt input of any kind — unlike Midjourney or Stable Diffusion, its architecture is steered entirely through positive description. If you want to exclude something (other people in frame, visible text, a cluttered background), that has to be written as a positive statement inside the brief itself, e.g. "an otherwise-empty café with no other patrons visible," rather than assumed as an exclusion the model will honor from a separate field — treating it like SD\'s negative box will just be silently ignored. Flux.2 responds strongly to specific camera/lens/film-stock language for photorealism and to plain-prose compositional instructions (rule-of-thirds, where the negative space sits), so put the same care into composition_note that you\'d put into a subject description.',
    exampleOutput:
      'A warm, editorial-style lifestyle photograph matching the described scene and framing — the film-stock reference (Portra 400, in this example) will read as an approximate color-and-grain feel rather than a technically exact emulation of that real film.',
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.2', date: '2026-07-28' }],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Flux.2 — confirmed no negative-prompt field exists in the current API/UI.',
      },
    ],
  },
  {
    slug: 'flux-2-social-media-campaign-graphic',
    category: 'flux',
    title: 'Design a social post with built-in caption space using Flux.2',
    description:
      'A lifestyle-and-composition brief for a scroll-stopping social graphic on Flux.2, with deliberately reserved empty space for a text overlay added later in a design tool.',
    promptText:
      'A {{platform_format}} social media graphic, {{scene_and_subject}}, {{brand_color_accent}}, {{lighting_mood}}, clean empty space in {{empty_space_location}} reserved for text overlay, {{overall_style}}',
    variables: [
      {
        name: 'platform_format',
        description:
          'The named platform format — Flux.2 responds to this even without a --ar-style flag.',
        example: 'square 1:1 Instagram feed post',
        required: true,
      },
      {
        name: 'scene_and_subject',
        description: 'The scene and what is happening in it.',
        example:
          "a person's hands wrapping a small kraft-paper gift box on a wooden table, cozy top-down angle",
        required: true,
      },
      {
        name: 'brand_color_accent',
        description: 'A single accent detail that carries the brand color.',
        example:
          'a single sprig of holly with red berries as the only saturated color accent',
        required: false,
      },
      {
        name: 'lighting_mood',
        description: 'Light quality and emotional tone.',
        example: 'warm, soft, slightly moody winter light',
        required: true,
      },
      {
        name: 'empty_space_location',
        description: 'Exactly where in the frame the clutter-free area should be.',
        example: 'the upper third of the frame',
        required: true,
      },
      {
        name: 'overall_style',
        description: 'The overall aesthetic reference.',
        example: 'muted, editorial, lifestyle-brand aesthetic, shot on film',
        required: false,
      },
    ],
    targetTools: ['Flux.2'],
    tags: [
      'flux',
      'social-media-graphic',
      'no-negative-prompt',
      'lifestyle-photography',
      'campaign-creative',
    ],
    whyItWorks:
      '"Reserved empty space" is the practical technique for generating social graphics that still need a caption or headline added afterward in a design tool. Because Flux.2 has no negative-prompt field, you get clutter-free negative space by explicitly describing where it should be — not by telling the model to exclude text after the fact, which it has no mechanism to honor. Flux.2 also responds well to platform-aware format naming ("square Instagram post" vs. "vertical Reels/Story") because it changes the model\'s framing instincts even though Flux has no Midjourney-style CLI parameters at all; format has to live in the prose, not in a flag.',
    exampleOutput:
      'A warm, on-brand lifestyle image with a genuinely clear region for a caption to be overlaid afterward — if the first pass fills the reserved area anyway, regenerate rather than trying to fix it with an exclusion instruction, since none exists.',
    verifiedAgainst: [{ tool: 'Flux', version: 'Flux.2', date: '2026-08-05' }],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Flux.2 for platform-format handling and reserved negative space.',
      },
    ],
  },
]
