/** Single source of the CLI's version — package.json mirrors this; keeping
 * it as a constant avoids a runtime package.json read from dist/. Bump both
 * together on release (checked by `npm run build` staying trivial to eyeball). */
export const VERSION = '0.1.0'
