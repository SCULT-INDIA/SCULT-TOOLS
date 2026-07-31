import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

/**
 * Composites every tool icon onto a white disc — the same anatomy as the main
 * Scult mark in app/icon.png (mark on a white circle, transparent corners).
 *
 * Why: the raw icons are violet marks on a fully transparent canvas. As
 * favicons that makes them hostage to the browser chrome behind them — nearly
 * invisible on a dark tab strip — and their transparent padding varies from
 * file to file, so they also rendered at inconsistent visual sizes. The disc
 * gives every icon its own guaranteed-contrast background in the tab AND a
 * uniform silhouette, and the same processed file is what the site itself
 * renders wherever a tool icon appears, so tab and page always agree.
 *
 * Layout maths, in the 1024px working canvas:
 *   - disc radius 500 (centred) — 12px inset so the circle's antialiased edge
 *     is never clipped by the bitmap boundary
 *   - the mark is TRIMMED of its transparent padding first, then fitted into
 *     620x620. Trimming first is the important step: the source files carry
 *     wildly different amounts of padding, so compositing them untrimmed would
 *     reproduce that inconsistency inside the disc. Trim + refit means every
 *     mark occupies the same ~62% of its disc regardless of how the source
 *     was exported.
 *   - output downsampled to 512px: more than any tab or on-page use needs
 *     (next/image re-optimises page usage down further anyway), at a fraction
 *     of the source files' 200-450KB.
 *
 * Idempotent by construction: sources of truth are the untouched originals in
 * assets/tool-icons-src/ (copied there from public/ on first run), and output
 * always regenerates from those — re-running can never double-shrink an icon.
 */

const SRC_DIR = 'assets/tool-icons-src'
const OUT_DIR = 'public/tool-icons'
const CANVAS = 1024
const DISC_RADIUS = 500
const MARK_FIT = 620
const OUT_SIZE = 512

mkdirSync(SRC_DIR, { recursive: true })

// First run: seed the source dir from public/ so originals are never lost.
for (const file of readdirSync(OUT_DIR)) {
  if (!file.endsWith('.png')) continue
  const src = join(SRC_DIR, file)
  if (!existsSync(src)) {
    copyFileSync(join(OUT_DIR, file), src)
    console.log(`seeded source: ${src}`)
  }
}

const disc = Buffer.from(
  `<svg width="${CANVAS}" height="${CANVAS}">
     <circle cx="${CANVAS / 2}" cy="${CANVAS / 2}" r="${DISC_RADIUS}" fill="#ffffff"/>
   </svg>`,
)

for (const file of readdirSync(SRC_DIR)) {
  if (!file.endsWith('.png')) continue

  const mark = await sharp(join(SRC_DIR, file))
    .trim()
    .resize(MARK_FIT, MARK_FIT, { fit: 'inside', withoutEnlargement: false })
    .toBuffer()

  await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: disc, top: 0, left: 0 },
      { input: mark, gravity: 'centre' },
    ])
    .png()
    .toBuffer()
    .then((buf) =>
      sharp(buf).resize(OUT_SIZE, OUT_SIZE).png({ compressionLevel: 9 }).toFile(join(OUT_DIR, file)),
    )

  console.log(`disc'd: ${file}`)
}

console.log('done')
