import { spawn } from 'node:child_process'
import { platform } from 'node:os'

/**
 * Copy text to the system clipboard with zero dependencies: pipe into the
 * OS's own clipboard utility. Returns false (never throws) when no utility
 * exists — the caller prints the content anyway, so --copy failing softly
 * costs the user nothing.
 */
export function copyToClipboard(text: string): Promise<boolean> {
  const os = platform()
  const candidates: { cmd: string; args: string[] }[] =
    os === 'win32'
      ? [{ cmd: 'clip', args: [] }]
      : os === 'darwin'
        ? [{ cmd: 'pbcopy', args: [] }]
        : [
            { cmd: 'wl-copy', args: [] },
            { cmd: 'xclip', args: ['-selection', 'clipboard'] },
            { cmd: 'xsel', args: ['--clipboard', '--input'] },
          ]

  return candidates.reduce<Promise<boolean>>(
    (previous, candidate) =>
      previous.then((done) =>
        done ? true : tryCopy(candidate.cmd, candidate.args, text),
      ),
    Promise.resolve(false),
  )
}

function tryCopy(cmd: string, args: string[], text: string): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false
    const finish = (ok: boolean) => {
      if (!settled) {
        settled = true
        resolve(ok)
      }
    }
    try {
      const child = spawn(cmd, args, { stdio: ['pipe', 'ignore', 'ignore'] })
      child.on('error', () => finish(false))
      child.on('close', (code) => finish(code === 0))
      child.stdin.on('error', () => finish(false))
      child.stdin.end(text)
    } catch {
      finish(false)
    }
  })
}
