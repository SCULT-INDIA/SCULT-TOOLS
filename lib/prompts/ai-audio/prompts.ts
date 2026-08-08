import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'suno-brand-jingle',
    category: 'ai-audio',
    title: 'Write a short, catchy brand jingle with a real hook',
    description:
      'A Suno v5 prompt using the required two-field format — a Style-of-Music description and separately tagged Lyrics — for a 30-45 second brand jingle with a memorable, repeatable hook.',
    promptText:
      'STYLE OF MUSIC:\nUpbeat {{genre}}, {{tempo}} tempo, warm handclaps and a bouncy bassline, bright major-key melody, radio-jingle production, female or male vocal (your choice), polished and short — built to loop as a 15-30 second ad cut.\n\nLYRICS:\n[Intro]\n{{brand_name}}, {{brand_name}}\n\n[Verse]\n{{verse_line_1}}\n{{verse_line_2}}\n\n[Chorus]\n{{brand_name}} is the one you need\n{{tagline_line}}\n{{brand_name}}, {{brand_name}}\n\n[Outro]\n{{brand_name}} — {{tagline_short}}',
    variables: [
      {
        name: 'genre',
        description: 'The musical genre/feel for the jingle',
        example: 'funky pop',
        required: true,
      },
      {
        name: 'tempo',
        description: 'The tempo feel',
        example: 'mid-fast',
        required: true,
      },
      {
        name: 'brand_name',
        description: 'The brand name to repeat as the hook',
        example: 'Bright Loaf Bakery',
        required: true,
      },
      {
        name: 'verse_line_1',
        description: 'First verse line describing the product/benefit',
        example: 'Fresh bread rising every morning light',
        required: true,
      },
      {
        name: 'verse_line_2',
        description: 'Second verse line, rhymes with or continues line 1',
        example: 'Warm and golden, baked just right',
        required: true,
      },
      {
        name: 'tagline_line',
        description: 'The core tagline expanded into a sung line',
        example: 'Every slice, every single day',
        required: true,
      },
      {
        name: 'tagline_short',
        description: 'A short 2-4 word tagline for the sung outro',
        example: 'baked fresh daily',
        required: true,
      },
    ],
    targetTools: ['Suno v5'],
    tags: ['audio', 'music', 'jingle', 'suno', 'branding', 'advertising'],
    whyItWorks:
      'Suno v5 reads the Style field and the Lyrics field as two separate instructions, not one blob of text — the Style field controls genre, tempo, instrumentation and production feel, while section tags inside Lyrics (`[Intro]`, `[Verse]`, `[Chorus]`, `[Outro]`) tell the model exactly where structure changes should happen musically, not just where the words change. Repeating the brand name in the Intro, Chorus and Outro (rather than once) is what actually makes a jingle memorable and is the same repetition pattern real advertising jingles use — Suno will set that repeated line to the most hook-like melodic phrase in the take if it appears at structurally obvious points. Keeping the Style field\'s production note ("built to loop as a 15-30 second ad cut") explicit matters because Suno\'s default output length skews toward a full song; naming the intended runtime up front measurably shortens what comes back.',
    exampleOutput:
      'A 34-second track: a bouncy handclap-driven intro chanting the brand name twice, a short two-line verse over a funky bassline, a chorus that repeats the brand name three times around the tagline line, and a clean four-word outro tag ending on a held major chord — ready to cut down for a 15-second ad.',
    verifiedAgainst: [{ tool: 'Suno v5', version: 'v5', date: '2026-07-18' }],
    changelog: [{ date: '2026-07-18', note: 'Published, verified against Suno v5.' }],
  },
  {
    slug: 'elevenlabs-character-voice-design',
    category: 'ai-audio',
    title: 'Design a distinct character voice from a text description alone',
    description:
      'An ElevenLabs Voice Design prompt that generates a usable synthetic voice from a character description, with the structured attributes that most reliably steer the result.',
    promptText:
      '{{core_character_description}}. Age: {{age_range}}. Gender: {{gender}}. Accent: {{accent}}. Tone: {{tone}}. Pacing: {{pacing}}. Delivered as if {{delivery_context}}.',
    variables: [
      {
        name: 'core_character_description',
        description:
          'A short, vivid one-line character sketch — the single highest-leverage part of the prompt',
        example: 'A weary lighthouse keeper who has seen one too many storms',
        required: true,
      },
      {
        name: 'age_range',
        description: 'Approximate age of the voice',
        example: 'late 60s',
        required: true,
      },
      {
        name: 'gender',
        description: 'Gender of the voice',
        example: 'male',
        required: true,
      },
      {
        name: 'accent',
        description: 'Accent or regional quality',
        example: 'coastal New England',
        required: true,
      },
      {
        name: 'tone',
        description: 'Emotional tone/quality of the voice',
        example: 'gravelly, resigned but kind',
        required: true,
      },
      {
        name: 'pacing',
        description: 'Speaking speed and rhythm',
        example: 'slow, with long pauses between sentences',
        required: true,
      },
      {
        name: 'delivery_context',
        description: 'A short scenario framing how the line is being delivered',
        example: 'telling a ghost story to a child by candlelight',
        required: true,
      },
    ],
    targetTools: ['ElevenLabs Voice Design'],
    tags: ['audio', 'voice', 'character-voice', 'elevenlabs', 'voiceover'],
    whyItWorks:
      'ElevenLabs Voice Design generates a voice from the description itself rather than from a recorded sample, so the description is doing the entire job a casting call would normally do — a vivid one-line character sketch ("a weary lighthouse keeper who has seen one too many storms") reliably steers timbre and character more than any single structured attribute alone, which is why it leads the prompt rather than being buried after the demographics. The structured age/gender/accent/tone/pacing fields exist because Voice Design responds well to being given each axis explicitly instead of having to infer it from prose — leaving one out (especially pacing) is the most common reason a generated voice sounds generic rather than specific. Adding a short delivery context ("telling a ghost story to a child by candlelight") gives the model an implied emotional performance target, not just a static timbre, which is what separates a usable character voice from a flat text-to-speech read.',
    exampleOutput:
      'A gravelly, slow-paced male voice in its late 60s with a soft coastal New England accent, warm but weary, pausing between phrases as if genuinely recalling old memories rather than reading them.',
    verifiedAgainst: [
      { tool: 'ElevenLabs Voice Design', version: '2026 release', date: '2026-07-15' },
    ],
    changelog: [
      {
        date: '2026-07-15',
        note: 'Published, verified against ElevenLabs Voice Design.',
      },
    ],
  },
  {
    slug: 'suno-instrumental-background-track',
    category: 'ai-audio',
    title: 'Generate a royalty-free instrumental background track for video',
    description:
      'A Suno v5 instrumental-only prompt (no lyrics field needed) for background music sized to a specific mood and use — the kind of track that sits under a product video or podcast intro without competing with narration.',
    promptText:
      'STYLE OF MUSIC:\nInstrumental only, no vocals. {{genre}}, {{mood}} mood, {{tempo}} tempo. Built for {{use_case}} — steady dynamics with no jarring drops or vocal-shaped melodic peaks, so it can sit under spoken narration or on-screen text without pulling focus. {{instrumentation_detail}}. Clean loopable intro and outro.',
    variables: [
      {
        name: 'genre',
        description: 'Musical genre/style of the instrumental',
        example: 'lo-fi corporate ambient',
        required: true,
      },
      {
        name: 'mood',
        description: 'Emotional mood of the track',
        example: 'calm and optimistic',
        required: true,
      },
      {
        name: 'tempo',
        description: 'Tempo feel',
        example: 'slow-to-mid',
        required: true,
      },
      {
        name: 'use_case',
        description: 'What the track will sit under',
        example: 'a two-minute explainer video with voiceover',
        required: true,
      },
      {
        name: 'instrumentation_detail',
        description: 'Specific instruments or sounds to feature',
        example: 'Soft piano and warm analog synth pads, light brushed percussion',
        required: false,
      },
    ],
    targetTools: ['Suno v5'],
    tags: ['audio', 'music', 'instrumental', 'background-music', 'suno', 'video-scoring'],
    whyItWorks:
      'Explicitly stating "instrumental only, no vocals" in the Style field is necessary rather than assumed — Suno v5 defaults toward adding vocals unless told otherwise, since most of its training-time usage is full songs, and an unwanted vocal line is the single most common reason a generated track gets discarded for background-music use. Naming the functional constraint directly ("no jarring drops or vocal-shaped melodic peaks... sit under spoken narration without pulling focus") works because it describes the dynamic envelope the track needs, which Suno can act on, rather than a vague "chill" mood tag that leaves dynamics unconstrained. Asking for a "clean loopable intro and outro" matters specifically for background-music use cases where the track may need to be trimmed or looped to match variable video length — a track that fades in from silence and swells to a big ending is much harder to cut cleanly than one that starts and ends near the same steady level.',
    exampleOutput:
      'A two-minute instrumental loop: soft piano arpeggios over warm analog pad chords, light brushed percussion keeping a steady mid tempo, even dynamics throughout with no drops or swells, clean enough at the start and end to loop seamlessly under a voiceover.',
    verifiedAgainst: [{ tool: 'Suno v5', version: 'v5', date: '2026-07-18' }],
    changelog: [{ date: '2026-07-18', note: 'Published, verified against Suno v5.' }],
  },
]
