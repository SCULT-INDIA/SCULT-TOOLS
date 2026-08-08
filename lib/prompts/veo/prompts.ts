import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'veo-cinematic-product-showcase',
    category: 'veo',
    title: 'Turn a product photo into a cinematic showcase clip',
    description:
      'A layered Veo 3.1 brief for an 8-second hero shot of a physical product, with native audio described in the prompt rather than added afterward.',
    promptText:
      'Subject and action: a {{product}} rotating slowly on a matte {{surface_material}} pedestal, catching light as it turns.\nCamera: slow dolly-in from a medium shot to a close-up, locked-off tripod smoothness, no handheld shake.\nEnvironment and lighting: a dark studio backdrop with a single soft key light from the upper left and a subtle rim light separating the product edge from the background.\nStyle and mood: {{visual_style}}, shallow depth of field, premium and quiet.\nAudio: a low ambient studio hum with a soft rising tone as the camera reaches the close-up, no dialogue, no music track.',
    variables: [
      {
        name: 'product',
        description: 'The physical product being showcased',
        example: 'ceramic pour-over coffee dripper',
        required: true,
      },
      {
        name: 'surface_material',
        description: 'What the product is resting on, for light interaction',
        example: 'brushed concrete',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall look/grade for the clip',
        example: 'warm minimalist commercial, soft film grain',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'product-video', 'commercial', 'cinematic', 'native-audio'],
    whyItWorks:
      'Veo 3.1 generates native audio from the prompt itself, so describing the soundscape ("low ambient studio hum," "no dialogue, no music") in the same brief as the visuals is what actually produces synced audio — bolting sound on in post is not how the model works. The prompt is also deliberately layered in one fixed order (subject/action, then camera, then lighting, then style, then audio) rather than one run-on sentence: each layer maps to a distinct thing the model conditions on, and keeping them in separate, short clauses gives Veo an unambiguous signal for each rather than making it guess which adjective belongs to which layer. Naming exactly one camera movement (a dolly-in) instead of stacking several ("dolly in while orbiting and craning up") is the single biggest lever for output quality on 5-10s clips — combined movements are the most common cause of warped geometry and inconsistent product shape in generated video.',
    exampleOutput:
      'An 8-second clip: the dripper starts in a medium shot against near-black, a soft key light sweeping across the ceramic glaze as it rotates; the camera glides inward to a close-up on the pour spout as a faint tonal swell rises under a constant low studio hum, ending on a tight, still frame.',
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-20' }],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Published, verified against Veo 3.1 with native-audio generation enabled.',
      },
    ],
  },
  {
    slug: 'veo-social-short-form-hook',
    category: 'veo',
    title: 'Generate a vertical short-form hook clip built to stop the scroll',
    description:
      'A Veo 3.1 prompt for a 5-8 second vertical clip designed as the opening hook of a Reels/Shorts/TikTok-style video, with the fast, immediate camera move and native audio a scroll-stopping open needs.',
    promptText:
      "Subject and action: {{subject}}, {{surprising_or_striking_action}}, framed to fill most of a vertical 9:16 frame.\nCamera: quick whip-pan into a snap zoom on the subject's reaction, landing on a tight close-up within the first second.\nEnvironment and lighting: {{setting}}, natural handheld-feel lighting, nothing that reads as a studio.\nStyle and mood: raw, unpolished, phone-shot authenticity — no cinematic color grade.\nAudio: {{diegetic_sound}}, sudden and attention-grabbing at the exact moment of the whip-pan, no music bed.",
    variables: [
      {
        name: 'subject',
        description: 'Who or what the clip centers on',
        example: 'a street food vendor',
        required: true,
      },
      {
        name: 'surprising_or_striking_action',
        description: 'The specific striking moment the hook is built around',
        example: 'flipping a pan of food into the air and catching it without looking',
        required: true,
      },
      {
        name: 'setting',
        description: 'Where the clip is set',
        example: 'a busy night market stall lit by string lights',
        required: true,
      },
      {
        name: 'diegetic_sound',
        description: 'The realistic in-scene sound tied to the action',
        example: 'a sharp pan clang and a crowd gasp',
        required: true,
      },
    ],
    targetTools: ['Veo 3.1'],
    tags: ['video', 'short-form', 'social', 'hook', 'vertical', 'reels'],
    whyItWorks:
      'Short-form hooks live or die in the first second, so this prompt puts the payoff — a snap zoom landing on a tight close-up — inside "within the first second" as an explicit, checkable instruction rather than a vague "exciting opening." Deliberately naming the aesthetic as "raw, unpolished, phone-shot authenticity" and ruling out a cinematic grade is a real Veo 3.1 lever: without it, the model\'s default leans toward a smoother, more produced look that reads as an ad rather than the native, algorithm-favored short-form style it needs to blend into a feed. Tying the audio instruction to a specific diegetic sound synced to the visual beat (the pan clang landing on the whip-pan) rather than a generic music bed is what makes the native audio generation reinforce the hook instead of competing with whatever the platform\'s auto-captions or trending-audio overlay will add on top after upload.',
    exampleOutput:
      'A 6-second vertical clip: the vendor tosses the pan, the camera whip-pans and snaps into a tight close-up on their face mid-catch, a loud pan clang and an off-camera crowd gasp landing exactly on the zoom, string lights blown out slightly in the background, no color grading applied.',
    verifiedAgainst: [{ tool: 'Veo 3.1', version: '3.1', date: '2026-07-20' }],
    changelog: [{ date: '2026-07-20', note: 'Published, verified against Veo 3.1.' }],
  },
]
