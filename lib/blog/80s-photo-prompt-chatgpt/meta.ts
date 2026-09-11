import { parentLink } from '@/lib/site'
import type { BlogPost } from '../types'

const SLUG = '80s-photo-prompt-chatgpt'
const BOOK_MEETING = parentLink('/#book-meeting', SLUG)

/** Prompt slugs verified against lib/prompts/photo-trends/prompts.ts. */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'prompt',
  title: '80s Photo Prompt for ChatGPT: The Order That Keeps Your Face',
  h1: 'Everyone is posting 1986 versions of themselves. Half of them do not look like themselves.',
  targetKeyword: '80s photo prompt chatgpt',
  description:
    'The 80s photo prompt structure that actually holds a likeness in ChatGPT — identity lock first, then seven blocks — plus the three mistakes in most published versions.',
  dek: 'The difference between an 80s photo that looks like you and one that looks like a stranger in a corduroy blazer is not the era description. It is where the identity instruction sits, and almost every prompt circulating this week puts it in the wrong place.',
  sections: [
    {
      heading: 'What you are actually asking the model to do',
      body: [
        [
          'When you upload a selfie and ask for a 1986 version, you are not asking for a new image. You are asking for an edit — keep one thing, change everything around it. That framing matters, because the model has no built-in sense of which parts of your photo are precious. Left to itself it treats the face as raw material like anything else in the frame, and re-renders it along with the hair and the shirt.',
        ],
        [
          'So a working prompt has to do two jobs in a specific order: state what must not change, then describe what should. Every prompt in the ',
          { text: 'Photo Trends library', href: '/prompts/photo-trends' },
          ' is built that way, and the order is not stylistic preference. Instructions near the start of a prompt carry more weight when a model re-renders an uploaded image, which is why an identity lock buried in the last line loses to a paragraph of styling above it.',
        ],
      ],
    },
    {
      heading: 'The seven blocks, in order',
      body: [
        [
          'A prompt that holds up has seven parts, and skipping any of them shows in the output. Identity lock first. Then hair. Then wardrobe and props. Then the setting. Then the light. Then the film stock. Then what to keep out of frame, and what to output.',
        ],
        [
          'Most published 80s prompts cover three or four of these — usually wardrobe, hair and a vague gesture at "vintage colours" — and then wonder why the result looks like a filter rather than a photograph. The two blocks people skip most often are the two doing the heaviest lifting.',
        ],
        [
          'The light block is the first of them. One sentence — a direct on-camera flash, a hot foreground, a hard little shadow behind the shoulder — does more to date an image to 1986 than any amount of grain, because a hard, close, unbounced flash is exactly what a family camera did and exactly what contemporary photography does not. You can see it working in the ',
          {
            text: 'Doordarshan-era living room prompt',
            href: '/prompts/photo-trends/photo-trends-80s-doordarshan-living-room',
          },
          ', where the whole period read comes from the flash behaviour rather than from the wood panelling.',
        ],
        [
          'The film stock block is the second. Real 35mm negative from 1986, printed and left in an album, has specific behaviour: fine grain, colour faded warm, shadows shifted toward cyan, halation blooming around the brightest highlight, blacks that lift slightly instead of going pure black. Asking for those five things separately produces a photograph. Asking for "a vintage look" produces a sepia overlay.',
        ],
      ],
    },
    {
      heading: 'Why the face drifts, and the line that stops it',
      body: [
        [
          'The most common complaint about this trend is that the output is beautiful and belongs to someone else. That happens because image models beautify by default. Asked to restyle a portrait, they narrow noses, sharpen jaws, enlarge eyes, smooth skin texture and lighten skin tone — not as a bug, but as the average of what the training data considers a good portrait.',
        ],
        [
          'A general instruction does not stop this. "Keep the face the same" is too abstract to bind, because the model does not consider a slightly slimmer jaw to be a different face. What works is naming the specific operations that are forbidden, and then naming what is allowed to change: hair, clothing, accessories, pose, props, background. Giving the model a permitted set is as important as giving it a forbidden one — without it, an instruction to change nothing competes with an instruction to make it 1986, and something has to give.',
        ],
        [
          'There is a men-specific version of this worth knowing. Ask for thick 80s hair and models quietly restore a fuller hairline. It is one of the most common reasons a result feels off without anyone being able to say why, and the ',
          {
            text: 'angry-young-man studio prompt',
            href: '/prompts/photo-trends/photo-trends-80s-angry-young-man-studio',
          },
          ' rules it out in a single clause.',
        ],
      ],
    },
    {
      heading: 'Three mistakes in most of the prompts circulating this week',
      body: [
        [
          { text: 'Midjourney flags do nothing in ChatGPT.', bold: true },
          ' Several widely-shared 80s prompt lists end with parameters like --ar 9:16 or --v 6.1. Those belong to Midjourney. ChatGPT and the Gemini app have no parameter parser; they read those characters as literal text sitting at the end of your instructions, which at best is ignored and at worst confuses the request. If you want a vertical image, write "vertical 9:16 portrait crop" as a sentence.',
        ],
        [
          { text: 'There is no negative prompt field.', bold: true },
          ' Some tools let you list things to exclude in a separate box. ChatGPT does not, and neither does the Gemini app. Every exclusion has to be a positive sentence inside the same prose the model is already reading — "show no smartphone, no modern logos, no printed caption" — or it will not be applied at all.',
        ],
        [
          { text: 'Do not feed the output back in.', bold: true },
          ' If the first result is close but not right, the instinct is to download it and upload it again with a correction. That compounds the drift: each pass re-renders the face from the previous render rather than from you, and by the third round the likeness is gone. Stay in the same conversation and ask for the change against the original upload instead.',
        ],
      ],
    },
    {
      heading: 'Pick the prompt that matches your photo',
      body: [
        [
          'The single most useful thing you can do is stop trying to make one prompt cover everything. A studio portrait and a roadside snapshot need different light, different framing and different exclusions, and a prompt written for both does neither well.',
        ],
        [
          'For a clean, flattering result from any decent selfie, the ',
          {
            text: 'mottled blue canvas studio portrait',
            href: '/prompts/photo-trends/photo-trends-80s-studio-portrait-blue-canvas',
          },
          ' is the most reliable in the set — it names a real four-light rig, so the model applies lighting physics it has genuinely learned rather than guessing at something pleasant.',
        ],
        [
          'For something that reads as a genuinely old photograph rather than a styled one, go the other way. The ',
          {
            text: '1985 college campus snapshot',
            href: '/prompts/photo-trends/photo-trends-80s-college-campus-denim',
          },
          ' deliberately asks for flat contrast, open shade, a blown-out background and a slightly crooked horizon. Reproduced limitations are more convincing than added grain, every time.',
        ],
        [
          'And for the frame nobody else in this trend is making, the ',
          {
            text: '1984 government office portrait',
            href: '/prompts/photo-trends/photo-trends-80s-government-office-portrait',
          },
          ' — steel almirah, red-tape files, green fluorescent cast — tends to get a stronger reaction from Indian viewers over thirty than any of the film-star looks.',
        ],
      ],
    },
    {
      heading: 'Couples, families and groups need three extra rules',
      body: [
        [
          'The moment there is more than one face, three new failures appear, and none of them are covered by a single-person identity lock.',
        ],
        [
          { text: 'Identity bleed.', bold: true },
          ' The model averages two faces toward a shared middle, and a couple comes back looking like siblings. The fix is to anchor each output face to its counterpart by position in the source — left stays left — and to state outright that the people must not be made to look more alike than they are.',
        ],
        [
          { text: 'Headcount drift.', bold: true },
          ' Groups gain or lose a person. Counting the source explicitly and requiring the output to match is the only reliable guard, and it is why every group prompt in the library opens by counting.',
        ],
        [
          { text: 'Age flattening.', bold: true },
          ' This is the one that upsets people. Beautification and rejuvenation are the same operation, so grandparents come back with smooth skin and dark hair. A general instruction to preserve age is too vague; the ',
          {
            text: 'three-generation joint family portrait',
            href: '/prompts/photo-trends/photo-trends-80s-family-joint-family-grandparents',
          },
          ' enumerates what has to survive — grey hair, deep lines, folds, thinning hair, age spots, stooped posture — because a list is something a model can check itself against.',
        ],
      ],
    },
    {
      heading: 'Check these four things before you post it',
      body: [
        [
          'Look at the face at full zoom, not at thumbnail size. Thumbnails hide exactly the drift you are trying to catch, and a result that reads as you on a phone preview often does not survive a closer look.',
        ],
        [
          'Count the hands and fingers. Hands remain the most reliable giveaway, which is why every prompt in the library offers the model an escape route — render a hand correctly or keep it out of frame — rather than hoping.',
        ],
        [
          'Read any text in the frame. Signboards, magazine mastheads, wall calendars and school crests are where these images break. The prompts here deliberately declare that text illegible or soft, so if you see sharp, confidently misspelled words, something has overridden that instruction.',
        ],
        [
          'And check the anachronisms. A satellite dish on a 1986 rooftop, an LED lamp on a period car, a flat-screen in a drawing room. If you are building something more serious than a weekend trend — a campaign, a product, a tool of your own — that same discipline is the difference between a demo and something shippable, and it is the kind of work ',
          { text: 'we take on directly', href: BOOK_MEETING, external: true },
          '.',
        ],
      ],
    },
  ],
  relatedTools: [],
  relatedPrompts: [
    'photo-trends-80s-angry-young-man-studio',
    'photo-trends-80s-studio-portrait-blue-canvas',
    'photo-trends-80s-college-campus-denim',
    'photo-trends-80s-government-office-portrait',
    'photo-trends-80s-doordarshan-living-room',
    'photo-trends-80s-family-joint-family-grandparents',
  ],
  updatedAt: '2026-09-09',
  readingMinutes: 9,
  faq: [
    {
      question: 'What is the best 80s photo prompt for ChatGPT?',
      answer: [
        'There is no single best one, because a studio portrait and an outdoor snapshot need different light and different exclusions. The most reliable starting point for an ordinary selfie is the ',
        {
          text: 'mottled blue canvas studio portrait',
          href: '/prompts/photo-trends/photo-trends-80s-studio-portrait-blue-canvas',
        },
        ', which names a real four-light studio rig rather than asking for a vintage look.',
      ],
    },
    {
      question: 'Why does ChatGPT change my face in the 80s photo?',
      answer: [
        'Because image models beautify by default — narrowing noses, sharpening jaws, smoothing skin, lightening skin tone. A vague instruction to keep the face the same does not bind, since the model does not consider a slightly slimmer jaw a different face. Naming the specific forbidden operations, and separately naming what is allowed to change, is what stops it.',
      ],
    },
    {
      question: 'Do I write --ar 9:16 for a vertical 80s photo?',
      answer: [
        'No. That is Midjourney syntax. ChatGPT and the Gemini app have no parameter parser and read it as literal text. Write the aspect ratio as a sentence instead — "vertical 9:16 portrait crop" — inside the prompt itself.',
      ],
    },
    {
      question: 'Is the 80s prompt different for ChatGPT and Gemini?',
      answer: [
        'The structure is the same in both: identity lock first, then hair, wardrobe, setting, light, film stock, exclusions, output. Neither has a negative-prompt field, so exclusions have to be positive sentences in both. Gemini is faster and free in the Gemini app; the differences are covered in ',
        {
          text: 'the Gemini version of this guide',
          href: '/blog/80s-photo-prompt-gemini',
        },
        '.',
      ],
    },
    {
      question: 'Can I use these prompts on a family or group photo?',
      answer: [
        'Yes, but use a prompt written for groups rather than adapting a single-person one. Groups introduce headcount drift, identity bleed between faces, and age flattening that makes elders look decades younger. The family and group prompts in the library open by counting the people in the source and anchoring each face by position.',
      ],
    },
    {
      question: 'The first result was close but not right. What now?',
      answer: [
        'Stay in the same conversation and ask for the correction against your original upload — "harder key light, stronger shadow on the backdrop" works well. Do not download the result and re-upload it. Each pass re-renders the face from the previous render rather than from you, and the likeness degrades quickly.',
      ],
    },
  ],
  sources: [
    'https://www.businesstoday.in/technology/news/story/instagram-80s-photo-trend-goes-viral-how-to-create-your-own-retro-photo-using-chatgpt-554148-2026-09-09',
    'https://ai.google.dev/gemini-api/docs/image-generation',
    'https://techcrunch.com/2025/09/17/india-leads-the-way-on-googles-nano-banana-with-a-local-creative-twist',
  ],
}
