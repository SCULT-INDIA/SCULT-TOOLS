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
]
