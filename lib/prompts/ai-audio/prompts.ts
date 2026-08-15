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
  {
    slug: 'ai-audio-explainer-voiceover-tone-match',
    category: 'ai-audio',
    title: `Get a voiceover read that actually matches your video's pacing, not a generic narrator drone`,
    description: `An ElevenLabs Voice Design brief for narrated explainer or product-demo voiceover, built around the specific pacing and emphasis points a script needs rather than a flat neutral read.`,
    promptText: `{{narrator_persona}}. Age: {{age_range}}. Gender: {{gender}}. Accent: {{accent}}. Delivery style: {{delivery_style}}, with natural emphasis on {{emphasis_words}} and a brief pause before {{pause_point}}. Paced for {{content_type}} — {{pacing_note}}.`,
    variables: [
      {
        name: 'narrator_persona',
        description: `A short sketch of who this narrator sounds like, not just a job title`,
        example: `A calm, competent product-support lead walking a new user through their first setup`,
        required: true,
      },
      {
        name: 'age_range',
        description: `Approximate age of the voice`,
        example: `mid-30s`,
        required: true,
      },
      {
        name: 'gender',
        description: `Gender of the voice`,
        example: `female`,
        required: true,
      },
      {
        name: 'accent',
        description: `Accent or regional quality`,
        example: `neutral American`,
        required: true,
      },
      {
        name: 'delivery_style',
        description: `The overall speaking style/energy`,
        example: `warm, unhurried, reassuring`,
        required: true,
      },
      {
        name: 'emphasis_words',
        description: `The specific word or phrase in the script that needs vocal stress`,
        example: `the word 'automatically'`,
        required: true,
      },
      {
        name: 'pause_point',
        description: `Where a beat of silence should land, usually before a key instruction`,
        example: `the line 'click Save'`,
        required: false,
      },
      {
        name: 'content_type',
        description: `What kind of video or content this voiceover sits under`,
        example: `a 90-second onboarding walkthrough with on-screen UI callouts`,
        required: true,
      },
      {
        name: 'pacing_note',
        description: `A specific pacing instruction tied to how the video is edited`,
        example: `slightly slower than conversational speed so viewers can follow along with each screen change`,
        required: true,
      },
    ],
    targetTools: [`ElevenLabs Voice Design`],
    tags: [`audio`, `voiceover`, `elevenlabs`, `explainer-video`, `narration`, `product-demo`],
    whyItWorks: `Most voiceover prompts fail because they describe a voice in the abstract ("professional, friendly") without tying it to the actual pacing constraints of the video it sits under, so Voice Design defaults to an even, generic narrator cadence that doesn't match where a viewer's attention actually needs to land. Naming a specific word or phrase for emphasis works because it gives the model a concrete acoustic target — a stressed syllable and a slight pitch rise on one word — rather than a vague instruction like "emphasize the important parts," which Voice Design has no way to act on since it doesn't know which parts you consider important. The explicit pause-point field matters even more for UI walkthroughs specifically: a beat of silence right before an instruction like "click Save" gives the viewer's eyes time to find the button on screen, and that timing gap is exactly the kind of structural cue Voice Design will reliably insert when told where to put it but will never invent unprompted. Tying the pacing note to the edit itself ("slightly slower... so viewers can follow along with each screen change") rather than a generic speed adjective is what keeps the narration in sync with a video that has hard cuts on specific actions.`,
    exampleOutput: `A warm, unhurried female voice in her mid-30s with a neutral American accent, speaking at a measured pace that leaves clear space around each instruction — a light stress lands on 'automatically' to reassure the listener it needs no extra steps, and a half-second pause sits right before 'click Save' so the direction lands cleanly against the on-screen action.`,
    verifiedAgainst: [
      { tool: 'ElevenLabs Voice Design', version: '2026 release', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ElevenLabs Voice Design 2026 release.`,
      },
    ],
  },
  {
    slug: 'ai-audio-podcast-intro-sonic-signature',
    category: 'ai-audio',
    title: `Build a podcast intro bed that listeners recognize within two seconds`,
    description: `A Suno v5 instrumental prompt for a short, distinctive podcast intro sting designed around a recognizable sonic signature rather than generic 'upbeat podcast music.'`,
    promptText: `STYLE OF MUSIC:
Instrumental only, no vocals. {{genre}} with a {{signature_sound}} as the recurring hook element, {{tempo}} tempo, {{energy_arc}}. Runtime target: {{runtime_seconds}} seconds — {{structure_note}}. Mixed to sit comfortably under a spoken cold-open voiceover in the final few seconds, not just at full volume throughout.`,
    variables: [
      {
        name: 'genre',
        description: `The base musical genre/feel`,
        example: `synthwave with a hint of jazz`,
        required: true,
      },
      {
        name: 'signature_sound',
        description: `One distinct, repeatable sonic element that becomes the show's audio identity`,
        example: `a rising arpeggiated synth riff`,
        required: true,
      },
      {
        name: 'tempo',
        description: `Tempo feel`,
        example: `mid, confident`,
        required: true,
      },
      {
        name: 'energy_arc',
        description: `How the energy should move across the clip's short runtime`,
        example: `builds from a single sparse riff to a fuller mix by the second half`,
        required: true,
      },
      {
        name: 'runtime_seconds',
        description: `Target length in seconds for the intro bed`,
        example: `12`,
        required: true,
      },
      {
        name: 'structure_note',
        description: `A specific structural instruction tied to how the intro will be used`,
        example: `a strong opening hit in the first second so it doesn't sound faded-in on a podcast app's auto-preview`,
        required: true,
      },
    ],
    targetTools: [`Suno v5`],
    tags: [`audio`, `music`, `podcast`, `suno`, `intro`, `branding`],
    whyItWorks: `A podcast intro's whole job is instant recognition, which is a completely different design brief than a full song — asking for "a signature sound" as a named, repeatable hook element (a specific riff, not just a genre) is what gives Suno v5 something concrete to build the entire 10-15 second clip around, rather than generating a miniature song with an intro/build/drop structure that never repeats anything long enough to become recognizable. Specifying the runtime in seconds up front matters because Suno's default generation length is tuned for full tracks; without an explicit short runtime target, the model tends to treat a 12-second request as an intro to a longer piece and the trimmed result loses its punch. The structural note about a strong opening hit addresses a real distribution constraint most people don't think to prompt for — podcast apps auto-preview show art and audio on tap, and a track that fades in from silence sounds broken or low-energy in that half-second preview window, while one that hits immediately reads as produced and intentional. Naming the energy arc (sparse to fuller) also gives the mix engineer's ear something to do across a very short clip instead of a static loop, which is what makes a 12-second sting still feel like a complete musical idea.`,
    exampleOutput: `A 12-second synthwave sting: a single arpeggiated synth riff hits hard on beat one, joined within four seconds by a soft bassline and light percussion, building to a fuller three-layer mix by the final bars before settling to a lower level in the last two seconds, ready for a host's voice to open on top of it.`,
    verifiedAgainst: [
      { tool: 'Suno v5', version: 'v5', date: '2026-08-09' },
    ],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against Suno v5.`,
      },
    ],
  },
  {
    slug: 'ai-audio-podcast-outro-cta-bed',
    category: 'ai-audio',
    title: `Write a podcast outro track that gives a call-to-action room to breathe`,
    description: `A Suno v5 instrumental outro prompt built specifically to fade under a spoken subscribe/follow call-to-action without stepping on it, then close cleanly.`,
    promptText: `STYLE OF MUSIC:
Instrumental only, no vocals. Same {{genre}} family as the show's intro theme but a calmer, {{closing_mood}} variation, {{tempo}} tempo. Structure: opens at moderate volume, then thins out to sparse instrumentation ({{sparse_instrumentation}}) starting around the {{cta_timing}} mark to leave clear room under a spoken call-to-action, then a gentle {{ending_style}} finish. Total runtime around {{runtime_seconds}} seconds.`,
    variables: [
      {
        name: 'genre',
        description: `The musical family, ideally matching the show's existing intro for brand consistency`,
        example: `synthwave with a hint of jazz`,
        required: true,
      },
      {
        name: 'closing_mood',
        description: `The emotional quality of this calmer outro variation`,
        example: `reflective, satisfied`,
        required: true,
      },
      {
        name: 'tempo',
        description: `Tempo feel, usually slower than the intro`,
        example: `slow, relaxed`,
        required: true,
      },
      {
        name: 'sparse_instrumentation',
        description: `What's left playing once the track thins out`,
        example: `just a soft piano and a light pad`,
        required: true,
      },
      {
        name: 'cta_timing',
        description: `Roughly when in the clip the thinning-out should begin`,
        example: `5-second`,
        required: true,
      },
      {
        name: 'ending_style',
        description: `How the track should resolve at the very end`,
        example: `fade-out`,
        required: true,
      },
      {
        name: 'runtime_seconds',
        description: `Target total length in seconds`,
        example: `20`,
        required: true,
      },
    ],
    targetTools: [`Suno v5`],
    tags: [`audio`, `music`, `podcast`, `suno`, `outro`, `call-to-action`],
    whyItWorks: `An outro has an opposite job from an intro — it needs to recede rather than announce itself, because a host is usually talking over the back half of it saying "subscribe, leave a review, see you next week," and a track that stays full-mix the whole way through will fight that voiceover for attention. Giving Suno v5 an explicit timing cue for when to thin out ("starting around the 5-second mark") is what actually produces that dynamic drop at a usable, predictable point, rather than a track that either stays busy throughout or drops out randomly wherever the model felt like resolving a phrase. Naming the exact sparse instrumentation left behind ("just a soft piano and a light pad") matters because it constrains frequency range too — a thinned-out track that still has a busy bassline or percussion hits will still mask a spoken voice even at lower volume, while two or three sustained, non-percussive elements sit underneath speech cleanly. Asking for the same genre family as the show's intro, just calmer, is a branding move as much as a musical one: it reinforces the show's sonic identity at the close of every episode instead of introducing a second, unrelated theme that dilutes recognition.`,
    exampleOutput: `A 20-second outro that opens with the full synthwave-jazz palette from the show's intro, then thins to just a soft piano and a warm pad by the five-second mark, holding steady and unobtrusive under a host's sign-off before fading out gently over the final three seconds.`,
    verifiedAgainst: [
      { tool: 'Suno v5', version: 'v5', date: '2026-08-10' },
    ],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against Suno v5.`,
      },
    ],
  },
  {
    slug: 'ai-audio-radio-style-audio-ad-30-second',
    category: 'ai-audio',
    title: `Script and voice a 30-second audio ad that hits its offer before listeners tune out`,
    description: `An ElevenLabs Voice Design brief for a radio-style audio ad read, tuned around the specific line that carries the offer and the urgency it needs to land in a strict 30-second window.`,
    promptText: `You are voicing a 30-second audio ad. Deliver the following read as: {{voice_persona}}, {{age_range}}, {{gender}}, {{accent}} accent, {{energy_level}} energy. The line "{{offer_line}}" must land with clear emphasis and a slight forward lean in pace — this is the one thing the listener needs to retain if nothing else. The closing line "{{cta_line}}" should slow down slightly and land with confident, unhurried clarity so it's easy to catch on a car radio or in the background. Overall pacing: {{overall_pacing}}, tight enough to fit a hard 30-second broadcast slot without sounding rushed.`,
    variables: [
      {
        name: 'voice_persona',
        description: `A short description of the announcer character, not just 'radio voice'`,
        example: `a friendly local business owner, not a slick national-brand announcer`,
        required: true,
      },
      {
        name: 'age_range',
        description: `Approximate age of the voice`,
        example: `40s`,
        required: true,
      },
      {
        name: 'gender',
        description: `Gender of the voice`,
        example: `male`,
        required: true,
      },
      {
        name: 'accent',
        description: `Accent or regional quality`,
        example: `midwestern American`,
        required: true,
      },
      {
        name: 'energy_level',
        description: `Overall energy of the read`,
        example: `upbeat but grounded, not shouty`,
        required: true,
      },
      {
        name: 'offer_line',
        description: `The exact line containing the core offer that must be retained`,
        example: `Everything in the store is 30% off this weekend only`,
        required: true,
      },
      {
        name: 'cta_line',
        description: `The exact closing call-to-action line`,
        example: `Visit us on Main Street, or find us online at rileyshardware dot com`,
        required: true,
      },
      {
        name: 'overall_pacing',
        description: `A description of the overall speaking speed for the full 30-second read`,
        example: `brisk conversational, no dead air`,
        required: true,
      },
    ],
    targetTools: [`ElevenLabs Voice Design`],
    tags: [`audio`, `voice`, `audio-ad`, `elevenlabs`, `radio`, `advertising`],
    whyItWorks: `A 30-second ad slot is a hard constraint, not a suggestion, and most audio-ad prompts fail by describing a voice character in general terms while leaving pacing entirely to the model's default read speed, which routinely produces a script that either runs long or rushes the one line that actually sells anything. Marking the offer line explicitly and instructing a slight forward lean in pace around it works because Voice Design treats inline delivery instructions as local overrides on rhythm — it will pick up pace and add stress precisely where told rather than applying one flat energy level across the whole 30 seconds, which is what a generic "upbeat, energetic" instruction produces. Slowing down specifically on the call-to-action line is the opposite move for a good reason: contact details and URLs are exactly the information listeners miss when a read stays fast throughout, and background or car-radio listening (the actual context this format is built for) means the CTA is often the only line getting real attention. Choosing "a friendly local business owner, not a slick national-brand announcer" as the persona anchor also matters because it steers away from the default over-produced announcer cadence Voice Design tends toward, which reads as generic stock-ad filler rather than an ad a listener trusts.`,
    exampleOutput: `An upbeat, grounded male voice in his 40s with a midwestern accent opens conversationally, picks up pace and stresses '30% off' on the offer line, then eases into a slower, clear, unhurried delivery of the address and website so both are easy to catch even with half an ear, closing right at the 30-second mark with no rushed final syllables.`,
    verifiedAgainst: [
      { tool: 'ElevenLabs Voice Design', version: '2026 release', date: '2026-08-11' },
    ],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ElevenLabs Voice Design 2026 release.`,
      },
    ],
  },
  {
    slug: 'ai-audio-voice-clone-consent-brief',
    category: 'ai-audio',
    title: `Write a voice-clone creation brief that captures the reference performance you actually need`,
    description: `An ElevenLabs Voice Design brief structured as a pre-production document for planning a consented voice clone — what reference audio to record, what attributes to describe, and what the clone must reliably reproduce.`,
    promptText: `I need you to act as a voice-clone pre-production consultant, not to generate audio yourself. Given the details below, produce: (1) a short reference-recording script the source speaker should read aloud (2-3 minutes, covering a range of emotional tones and sentence lengths so the clone captures more than one flat register), (2) a written voice-attribute description usable as a Voice Design prompt fallback if reference audio quality is insufficient, and (3) a plain-language note confirming this project requires the explicit, recorded consent of the person being cloned before any cloned voice is generated or used — flag this as a hard requirement, not optional.

Speaker context: {{speaker_description}}. Primary use case for the clone: {{use_case}}. Emotional range needed: {{emotional_range}}. Known vocal quirks to preserve: {{vocal_quirks}}. Recording conditions available: {{recording_conditions}}.`,
    variables: [
      {
        name: 'speaker_description',
        description: `Who the source speaker is and their general vocal profile`,
        example: `our company's founder, mid-50s, calm and measured public-speaking style`,
        required: true,
      },
      {
        name: 'use_case',
        description: `What the finished voice clone will actually be used for`,
        example: `narrating internal training videos so the founder doesn't have to re-record every update`,
        required: true,
      },
      {
        name: 'emotional_range',
        description: `The range of tones the clone needs to convincingly cover`,
        example: `calm instructional, plus occasional enthusiastic emphasis`,
        required: true,
      },
      {
        name: 'vocal_quirks',
        description: `Specific speech habits or textures that make the voice recognizably theirs`,
        example: `a slight pause before key points, a warm rasp on lower notes`,
        required: false,
      },
      {
        name: 'recording_conditions',
        description: `What kind of recording setup and environment is realistically available`,
        example: `a quiet home office with a USB condenser mic, no soundproofing`,
        required: true,
      },
    ],
    targetTools: [`ElevenLabs Voice Design`],
    tags: [`audio`, `voice-clone`, `elevenlabs`, `consent`, `pre-production`, `brief`],
    whyItWorks: `Voice cloning quality is decided almost entirely before generation happens, at the reference-recording stage, which is why this prompt is structured as a planning document rather than a direct generation request — a clone trained on 2-3 minutes of flat, single-register reading will only ever produce that one flat register back, so asking the AI to design a script covering a deliberate range of emotional tones and sentence lengths up front is what gives the eventual clone enough acoustic variety to sound natural across different real uses later. Including a written voice-attribute description as a fallback matters because recording conditions are often imperfect (a home office with no soundproofing, as in the example), and having a structured Voice Design prompt ready means a usable starting point exists even if the reference audio has noise or inconsistent mic distance. Making the consent requirement an explicit, non-optional output section rather than an assumed norm addresses a real and current failure mode in voice-clone workflows — people skip consent when it's not written down as a deliverable, and treating it as boilerplate the AI must produce alongside the technical brief keeps it from being quietly dropped when the project moves fast. The vocal-quirks field exists because generic clones tend toward a smoothed, characterless average voice; naming a specific quirk like a pre-point pause or a vocal rasp gives the source material something distinctive to preserve rather than average away.`,
    exampleOutput: `A reference script with six short passages — an instructional paragraph, an enthusiastic aside, and a calm closing statement — designed to be read aloud in one sitting; a fallback Voice Design attribute description (age, tone, pacing, a note on the characteristic pre-point pause); and a clearly flagged consent section stating that recorded, explicit permission from the founder is required before the clone is generated or used in any training video.`,
    verifiedAgainst: [
      { tool: 'ElevenLabs Voice Design', version: '2026 release', date: '2026-08-12' },
    ],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ElevenLabs Voice Design 2026 release.`,
      },
    ],
  },
  {
    slug: 'ai-audio-ambient-sound-design-scene-bed',
    category: 'ai-audio',
    title: `Design an ambient sound bed that sells a specific location without a single spoken word`,
    description: `A Suno v5 instrumental/textural prompt for scene-setting sound design — the layered environmental and tonal bed used under a video establishing shot, game scene, or immersive audio piece.`,
    promptText: `STYLE OF MUSIC:
Instrumental, textural, non-melodic-forward ambient sound design — not a song with a clear verse/chorus structure. Setting: {{scene_setting}}. Layer these environmental/tonal elements: {{sound_layers}}. Overall emotional undercurrent: {{emotional_undercurrent}}, without being on-the-nose or dramatic about it. Dynamic behavior: {{dynamic_behavior}}. No sudden loud transients or vocal elements — this needs to sit under other audio (dialogue, sound effects, or narration) without demanding attention. Runtime: {{runtime_note}}.`,
    variables: [
      {
        name: 'scene_setting',
        description: `The specific physical or fictional location the bed needs to evoke`,
        example: `an empty subway station at 3am`,
        required: true,
      },
      {
        name: 'sound_layers',
        description: `The specific environmental and tonal elements to layer together`,
        example: `a distant low train rumble, flickering fluorescent hum, sparse metallic drips, a thin sustained synth drone underneath`,
        required: true,
      },
      {
        name: 'emotional_undercurrent',
        description: `The subtle feeling the bed should carry without stating it directly`,
        example: `quiet unease, something slightly wrong`,
        required: true,
      },
      {
        name: 'dynamic_behavior',
        description: `How the bed should evolve or stay static over its runtime`,
        example: `mostly static and looping, with one subtle swell around the midpoint`,
        required: true,
      },
      {
        name: 'runtime_note',
        description: `How long the bed needs to run and any looping requirement`,
        example: `90 seconds, needs to loop seamlessly for a game level`,
        required: true,
      },
    ],
    targetTools: [`Suno v5`],
    tags: [`audio`, `sound-design`, `ambient`, `suno`, `scene-setting`, `game-audio`],
    whyItWorks: `Sound design prompts fail most often when they're written like music prompts — asking for a genre and mood produces a melodic ambient track with a recognizable musical shape, which is the wrong output entirely for a scene bed that needs to feel like environment rather than composition, so explicitly ruling out verse/chorus structure and naming this as "textural, non-melodic-forward" redirects Suno v5 away from its song-generation defaults toward something closer to a field-recording-plus-drone hybrid. Listing specific sound layers individually (the train rumble, the fluorescent hum, the metallic drips, the synth drone) rather than a single mood adjective works because each named element gives the model a distinct textural layer to generate and blend, which is how real sound designers build a scene bed — layer by layer, not as one homogenous pad. Asking for an emotional undercurrent "without being on-the-nose or dramatic about it" is a deliberate constraint against Suno's tendency to resolve ambiguous mood prompts into more conventional, obviously emotional cues (swelling strings, minor-key stabs) that would announce the mood instead of letting it sit underneath a scene quietly. The explicit looping requirement in the runtime note matters practically for game audio and installations specifically, where a bed that builds to an ending and stops is unusable — a mostly static loop with one subtle swell gives just enough movement to avoid sounding robotic on repeat without breaking the seamless-loop requirement.`,
    exampleOutput: `A 90-second ambient bed: a low, distant rumble pulses irregularly beneath a thin electrical hum, occasional sparse metallic drips panned around the stereo field, and a barely-there sustained drone underpinning all of it, holding mostly still until a subtle, brief swell around the 45-second mark before settling back down — engineered to loop without an audible seam.`,
    verifiedAgainst: [
      { tool: 'Suno v5', version: 'v5', date: '2026-08-13' },
    ],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against Suno v5.`,
      },
    ],
  },
  {
    slug: 'ai-audio-music-video-concept-track-pairing',
    category: 'ai-audio',
    title: `Pair a Suno track with a visual concept treatment built to match its actual structure`,
    description: `A Suno v5 prompt for a full song intended to become a music video, written together with the section-by-section visual beats it needs to support so the lyrics and structure serve a treatment, not just a listen.`,
    promptText: `Write this as a song intended for a music video, so structure has to match visual pacing, not just musical taste.

STYLE OF MUSIC:
{{genre}}, {{mood}} mood, {{tempo}} tempo. {{production_note}}.

LYRICS:
[Intro]
{{intro_line}}

[Verse 1]
{{verse_1_lines}}

[Pre-Chorus]
{{prechorus_line}}

[Chorus]
{{chorus_lines}}

[Verse 2]
{{verse_2_lines}}

[Bridge]
{{bridge_line}}

[Final Chorus]
{{chorus_lines}}

Visual pacing notes for the treatment: the Intro should correspond to an establishing shot with minimal cuts, each Chorus should land on the video's fastest cut rate and visual peak, and the Bridge should correspond to the video's one tonal shift or narrative turn.`,
    variables: [
      {
        name: 'genre',
        description: `The musical genre/style`,
        example: `indie pop with a driving 80s-influenced drum machine`,
        required: true,
      },
      {
        name: 'mood',
        description: `Overall emotional mood`,
        example: `nostalgic but hopeful`,
        required: true,
      },
      {
        name: 'tempo',
        description: `Tempo feel`,
        example: `mid-fast, danceable`,
        required: true,
      },
      {
        name: 'production_note',
        description: `A specific production detail that supports the visual concept`,
        example: `gated reverb on the snare and a bright synth lead, built for a neon-lit night-drive visual`,
        required: true,
      },
      {
        name: 'intro_line',
        description: `A short spoken or sung intro line, or instrumental note`,
        example: `(instrumental build, no vocals yet)`,
        required: false,
      },
      {
        name: 'verse_1_lines',
        description: `The first verse's lyric content`,
        example: `Streetlights blur past the window seat / Nobody's home but the radio's beat`,
        required: true,
      },
      {
        name: 'prechorus_line',
        description: `A short rising pre-chorus line`,
        example: `And I keep driving toward whatever's next`,
        required: true,
      },
      {
        name: 'chorus_lines',
        description: `The main chorus lyric, reused for the final chorus`,
        example: `We're chasing neon, chasing time / Nothing left behind, just you and the drive`,
        required: true,
      },
      {
        name: 'verse_2_lines',
        description: `The second verse's lyric content`,
        example: `Same old roads but they feel brand new / Every mile out here belongs to you`,
        required: true,
      },
      {
        name: 'bridge_line',
        description: `The bridge's lyric content, marking the song's one tonal shift`,
        example: `Maybe we don't know where this goes / But for tonight, that's all we know`,
        required: true,
      },
    ],
    targetTools: [`Suno v5`],
    tags: [`audio`, `music`, `music-video`, `suno`, `songwriting`, `visual-concept`],
    whyItWorks: `A song written purely for listening and a song written to become a music video need different internal structures, because a video treatment has to hang visual beats on musical ones, and if the chorus doesn't land at a clear, repeatable high-energy point, there's nothing for a fast-cut visual sequence to sync against. Writing the visual pacing notes directly into the same prompt as the lyrics — rather than as a separate creative brief — keeps Suno v5's generation of the actual musical dynamics (energy build into the chorus, a genuine tonal pivot at the bridge) aligned with what a director would need frame-accurate cues for, since the model responds to the tagged song sections as functional markers, not just lyric dividers. Naming a concrete production detail tied to the visual concept ("gated reverb on the snare... for a neon-lit night-drive visual") does double duty: it's a real production choice that shapes the mix, and it also seeds a consistent visual palette the treatment can be built around later, so the music and the imagery come from the same creative decision instead of being bolted together after the fact. Reusing the identical chorus lyric for both the Chorus and Final Chorus sections (rather than writing a slightly different one) matters structurally too — music videos rely on visual motifs repeating at the chorus specifically, and a mismatched final chorus lyric breaks the visual rhyme a treatment is counting on.`,
    exampleOutput: `A 3-minute indie-pop track with a gated-reverb snare and bright synth lead: a two-bar instrumental build opens over a slow pan, verse one sits low and intimate, the pre-chorus rises into a full-band chorus built for fast cuts and a neon color palette, verse two settles back down, and the bridge shifts into a stripped-back, more vulnerable arrangement before the final chorus returns at full energy to close the video on its visual peak.`,
    verifiedAgainst: [
      { tool: 'Suno v5', version: 'v5', date: '2026-08-14' },
    ],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against Suno v5.`,
      },
    ],
  },
]
