import { parentLink } from '@/lib/site'
import type { BlogPost } from '../types'

const SLUG = 'viral-ai-photo-trends-india'
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Prompt slugs verified against lib/prompts/photo-trends/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'Viral AI Photo Trends in India: What They Share, and Why India Adapts Them',
  h1: 'The trends keep changing. The prompt underneath them barely does.',
  targetKeyword: 'viral ai photo trends india',
  description:
    'The saree trend, the polaroid trend, the 3D figurine, the 80s retro look — what every viral AI photo trend in India has in common, and the prompt structure they all reduce to.',
  dek: 'Every few weeks a new AI photo trend takes over Indian Instagram, and every time the advice starts from scratch. It should not. Underneath the saree trend, the polaroid trend and the 1980s retro look is one prompt structure with the era swapped out.',
  sections: [
    {
      heading: 'India does not adopt these trends, it rewrites them',
      body: [
        [
          'When Google’s Gemini image model — nicknamed Nano Banana — reached a wide audience, the trends that followed took a distinctly local turn here. Reporting at the time noted that Indian users were the ones who pushed it hardest and most creatively, and the pattern has held since: a format goes global, and the Indian version of it is specific enough to be unrecognisable to anyone outside.',
        ],
        [
          'The 1980s retro trend is the clearest example so far. Elsewhere it produced generic Western retro — shoulder pads, neon, mall photography. In India and Pakistan it went straight to Bollywood: chiffon sarees on hillsides, Filmfare and Stardust cover mock-ups, Ambassador cars, Doordarshan drawing rooms, baraat processions. That local specificity is also why it has lasted longer here than in markets that took the generic version.',
        ],
        [
          'The same happened to the saree trend, where the reference was 1990s Bollywood portraiture rather than fashion photography, and to the polaroid trend, where the celebrity in the frame was almost always an Indian film star.',
        ],
      ],
    },
    {
      heading: 'The trends, and what each one is actually asking for',
      body: [
        [
          { text: 'The saree trend.', bold: true },
          ' A selfie re-rendered as a cinematic portrait in a flowing chiffon saree, golden-hour light, flowers in the hair, grainy film texture. Technically it is a fabric-physics problem: chiffon has to read as light, semi-sheer and finely draped, or the output looks like a wrapped sheet.',
        ],
        [
          { text: 'The polaroid trend.', bold: true },
          ' A photo of you standing beside a celebrity, framed as an instant print with a white border and a flash-lit look. Technically it is a two-subject composition problem, with all the identity-bleed risk that comes from putting two faces in one frame.',
        ],
        [
          { text: 'The 3D figurine trend.', bold: true },
          ' Yourself as a collectible figure on a desk, in packaging, at miniature scale. Technically it is the odd one out — it deliberately abandons photorealism, which is why its hit rate is high.',
        ],
        [
          { text: 'The 1980s and 1990s retro trends.', bold: true },
          ' Yourself, photographed in a specific past decade. Technically the hardest of the four, because it needs period-accurate objects, period-accurate lighting and a likeness that survives a total restyle — all at once. The ',
          { text: 'Photo Trends prompt library', href: '/prompts/photo-trends' },
          ' starts here for that reason.',
        ],
      ],
    },
    {
      heading: 'One structure underneath all of them',
      body: [
        [
          'Strip the era away and every one of these trends is the same request: keep this face, change everything around it. Which means the same seven blocks work across all of them, in the same order — identity lock, hair, wardrobe and props, setting, light, film stock or medium, exclusions, output.',
        ],
        [
          'The identity lock goes first because instructions near the start of a prompt carry more weight when a model re-renders an uploaded image. It has to name specific forbidden operations — do not slim, sharpen, lighten, smooth or beautify — rather than asking generally, and it has to name what is permitted to change, or the lock ends up competing with the styling instructions and losing.',
        ],
        [
          'Swap the decade and the wardrobe, and the structure carries over intact. That is the practical reason to learn it once rather than hunting for a new prompt list every time a format goes viral.',
        ],
      ],
    },
    {
      heading: 'The two blocks people always skip',
      body: [
        [
          'Light and film stock are what separate a photograph from a filter, and they are the two blocks almost every published prompt list leaves out.',
        ],
        [
          'On light, one sentence usually carries the whole period. A direct on-camera flash with a hot foreground and a hard little shadow behind the shoulder places an image in a family album immediately, because that is what a consumer camera did and what contemporary photography does not. Cold, flat, sunless overcast light does the same job for a hill-station holiday photo, precisely because it is the opposite of the golden hour a model reaches for by default.',
        ],
        [
          'On film stock, name the behaviour rather than the vibe: fine grain, colour faded warm, shadows shifted toward cyan, halation blooming around the brightest highlight, blacks that lift instead of going pure. Better still, name a limitation of the medium. A shaded face against a background blown out several stops is something 1985 consumer film genuinely could not avoid, and a reproduced limitation is more convincing than any amount of added grain. The ',
          {
            text: 'college campus snapshot prompt',
            href: '/prompts/photo-trends/photo-trends-80s-college-campus-denim',
          },
          ' is built almost entirely out of limitations for that reason.',
        ],
      ],
    },
    {
      heading: 'What breaks, in every trend, every time',
      body: [
        [
          { text: 'Text in the frame.', bold: true },
          ' Mastheads, signboards, wall calendars, school crests, poster walls. The reliable move is to declare it unreadable — soft, small, out of focus — rather than hoping the model spells it correctly. A soft run of near-letters reads as ordinary type at a glance; a sharp misspelling is unmissable.',
        ],
        [
          { text: 'Hands.', bold: true },
          ' Give the model an escape route. "Render every visible hand with five correctly formed fingers, or keep that hand out of frame" works, because a model that cannot render a hand will otherwise render a wrong one.',
        ],
        [
          { text: 'Anachronisms with a local accent.', bold: true },
          ' Satellite dishes on a 1986 rooftop, LED lamps on a period car, a flat-screen in a Doordarshan-era drawing room. These need naming individually, since the model’s defaults are drawn from photographs taken decades after the scene you are asking for.',
        ],
        [
          { text: 'Age.', bold: true },
          ' On any photo with older people, beautification shows up as rejuvenation. It has to be blocked by enumerating what must survive — grey hair, lines, folds, thinning hair, age spots, posture — as the ',
          {
            text: 'joint family portrait prompt',
            href: '/prompts/photo-trends/photo-trends-80s-family-joint-family-grandparents',
          },
          ' does.',
        ],
      ],
    },
    {
      heading: 'Before you upload a photo of someone else',
      body: [
        [
          'Most of these trends run on family photographs, and a few things are worth being deliberate about. Ask the people in the picture first, particularly older relatives, who may have a view about an AI version of themselves circulating. Remember that whatever you upload goes to a third-party service, which is a different calculation for a family photograph than for a selfie you would post anyway.',
        ],
        [
          'And look properly at what comes back before it goes anywhere. Check that nobody has been quietly de-aged, that the headcount matches the original, that every face still belongs to the right person, and that hands and text hold up at full zoom rather than at thumbnail size.',
        ],
      ],
    },
    {
      heading: 'Where the next one will come from',
      body: [
        [
          'The pattern so far is consistent: a capable image model reaches a mass audience, someone finds a format that turns a selfie into a memory rather than a picture, and India localises it within days. Nostalgia formats travel furthest here — the decade, the wedding, the film poster, the family album — because they give people something to send to their parents rather than only something to post.',
        ],
        [
          'The prompts in the library will grow with that. The structure will not need to, which is the point of learning it once. And if you are building a product on top of this rather than posting to it — where these failure modes have to be handled rather than hoped away — ',
          {
            text: 'that is work we take on directly',
            href: BOOK_MEETING,
            external: true,
          },
          '.',
        ],
      ],
    },
  ],
  relatedTools: [],
  relatedPrompts: [
    'photo-trends-80s-chiffon-saree-hillside',
    'photo-trends-80s-college-campus-denim',
    'photo-trends-80s-family-joint-family-grandparents',
    'photo-trends-80s-couple-film-poster',
    'photo-trends-80s-doordarshan-living-room',
  ],
  updatedAt: '2026-09-09',
  readingMinutes: 9,
  faq: [
    {
      question: 'Which AI photo trends have gone viral in India?',
      answer: [
        'The Nano Banana saree trend, the polaroid-with-a-celebrity trend, the 3D figurine trend, the 1990s retro Bollywood look, and most recently the 1980s retro photo trend. Each takes a global format and localises it — Indian film references, Indian settings, Indian period objects.',
      ],
    },
    {
      question: 'Do I need a different prompt for each trend?',
      answer: [
        'No. All of them reduce to the same request — keep this face, change everything around it — and so to the same seven-block structure with the era swapped. Learning the structure once is more useful than collecting prompt lists.',
      ],
    },
    {
      question: 'Which tool works best for these trends?',
      answer: [
        'Both ChatGPT and the Gemini app work, and the prompt structure is identical in both. Gemini’s image model is free in the app, fast, and unusually good at keeping a face recognisable through heavy restyling, which matters most on group and multi-generation photos.',
      ],
    },
    {
      question: 'Why do these trends look so different in India?',
      answer: [
        'Because Indian users rewrite the reference rather than adopting it. The 80s trend elsewhere produced generic Western retro; here it went to Bollywood — chiffon sarees, film magazine covers, Ambassador cars, Doordarshan drawing rooms. That specificity is also why the trends tend to last longer in this market.',
      ],
    },
    {
      question: 'Is it safe to upload family photos to these tools?',
      answer: [
        'Anything you upload goes to a third-party service, so it is a different decision for a family photograph than for a selfie. Ask the people in the picture first, especially older relatives, and check the output carefully before sharing — de-aging of elders and merged faces are the failures people notice.',
      ],
    },
  ],
  sources: [
    'https://techcrunch.com/2025/09/17/india-leads-the-way-on-googles-nano-banana-with-a-local-creative-twist',
    'https://www.businesstoday.in/technology/news/story/instagram-80s-photo-trend-goes-viral-how-to-create-your-own-retro-photo-using-chatgpt-554148-2026-09-09',
    'https://ai.google.dev/gemini-api/docs/image-generation',
  ],
}
