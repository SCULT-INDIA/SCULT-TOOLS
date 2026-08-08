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
]
