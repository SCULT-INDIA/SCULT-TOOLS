/**
 * Terminal output helpers — tiny by design (no chalk): ANSI codes behind a
 * single gate that honors --no-color, NO_COLOR, and non-TTY stdout, so
 * piped output is always clean text.
 */

let colorEnabled =
  process.stdout.isTTY === true &&
  process.env.NO_COLOR === undefined &&
  process.env.TERM !== 'dumb'

export function setColorEnabled(enabled: boolean): void {
  colorEnabled = enabled && process.stdout.isTTY === true
}

function paint(code: string, text: string): string {
  return colorEnabled ? `[${code}m${text}[0m` : text
}

export const bold = (t: string) => paint('1', t)
export const dim = (t: string) => paint('2', t)
export const violet = (t: string) => paint('38;5;99', t)
export const yellow = (t: string) => paint('33', t)
export const green = (t: string) => paint('32', t)
export const red = (t: string) => paint('31', t)

export function heading(text: string): string {
  return `\n${bold(violet(text))}`
}

/** One search hit / list row: bold title line, dimmed meta line, wrapped blurb. */
export function listRow(title: string, meta: string, blurb: string): string {
  return [`  ${bold(title)}  ${dim(meta)}`, blurb ? `  ${wrap(blurb, 76, '  ')}` : '']
    .filter(Boolean)
    .join('\n')
}

export function wrap(text: string, width: number, indent: string): string {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    if (line !== '' && line.length + 1 + word.length > width) {
      lines.push(line)
      line = word
    } else {
      line = line === '' ? word : `${line} ${word}`
    }
  }
  if (line !== '') lines.push(line)
  return lines.map((l, i) => (i === 0 ? l : `${indent}${l}`)).join('\n')
}

export function printJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`)
}

export function fail(message: string): never {
  process.stderr.write(`${red('error')} ${message}\n`)
  process.exit(1)
}
