#!/usr/bin/env node
// Makes the scrypt `salt:hash` digest ADMIN_PASSWORD_HASH expects — see
// lib/admin/auth.ts's `hashPassword`.
//
//   node scripts/hash-admin-password.mjs '<password>'
//       Prints the digest (paste it into Vercel or .env.local yourself).
//
//   npm run admin:password          (= node scripts/hash-admin-password.mjs --write-local)
//       Asks for the password twice without echoing it (so it stays out of
//       shell history), then writes the digest into .env.local as
//       ADMIN_PASSWORD_HASH, keeping the previous value as a comment.
//       Restart `npm run dev` afterwards — Next reads .env.local at startup.
//       Local and production are separate: to use the same password on the
//       live site, paste the printed digest into Vercel too.
import { randomBytes, scryptSync } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const ENV_FILE = '.env.local'
const KEY = 'ADMIN_PASSWORD_HASH'

function hash(password) {
  const salt = randomBytes(16)
  return `${salt.toString('hex')}:${scryptSync(password, salt, 64).toString('hex')}`
}

/** Piped (non-terminal) input: every line, read once and handed out in
 * order — a single chunk can carry both answers. */
let pipedLines
async function nextPipedLine() {
  if (!pipedLines) {
    let data = ''
    process.stdin.setEncoding('utf8')
    for await (const chunk of process.stdin) data += chunk
    pipedLines = data.split(/\r?\n/)
  }
  return pipedLines.shift() ?? ''
}

/** Reads one line without echoing it when attached to a terminal. */
function prompt(question) {
  const { stdin, stdout } = process
  stdout.write(question)
  if (!stdin.isTTY) {
    return nextPipedLine().then((line) => {
      stdout.write('\n')
      return line
    })
  }
  return new Promise((resolve, reject) => {
    let value = ''
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    const onData = (chars) => {
      for (const ch of chars) {
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false)
          stdin.pause()
          stdin.off('data', onData)
          stdout.write('\n')
          resolve(value)
          return
        }
        if (ch === '\u0003') {
          stdin.setRawMode(false)
          stdout.write('\n')
          reject(new Error('Cancelled.'))
          return
        }
        if (ch === '\u007f' || ch === '\b') value = value.slice(0, -1)
        else value += ch
      }
    }
    stdin.on('data', onData)
  })
}

function writeLocal(digest) {
  const original = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8') : ''
  const eol = original.includes('\r\n') ? '\r\n' : '\n'
  const lines = original === '' ? [] : original.split(/\r?\n/)
  const at = lines.findIndex((l) => new RegExp(`^\\s*${KEY}\\s*=`).test(l))
  const stamp = new Date().toISOString().slice(0, 10)
  if (at >= 0) {
    lines.splice(at, 1, `# previous ${KEY} (replaced ${stamp}): ${lines[at].split('=').slice(1).join('=')}`, `${KEY}=${digest}`)
  } else {
    if (lines.length && lines[lines.length - 1] !== '') lines.push('')
    lines.push(`${KEY}=${digest}`, '')
  }
  writeFileSync(ENV_FILE, lines.join(eol))
}

async function main() {
  const args = process.argv.slice(2)
  if (!args.includes('--write-local')) {
    const password = args[0]
    if (!password) {
      console.error("Usage: node scripts/hash-admin-password.mjs '<password>'")
      console.error('   or: npm run admin:password   (prompts, then writes .env.local)')
      process.exit(1)
    }
    console.log(hash(password))
    return
  }

  const first = await prompt('New admin password: ')
  if (first.length < 12) throw new Error('Use at least 12 characters.')
  if (first !== first.trim()) throw new Error('The password starts or ends with a space — was that a paste accident? Nothing was changed.')
  const second = await prompt('Type it again: ')
  if (first !== second) throw new Error('The two entries did not match. Nothing was changed.')

  const digest = hash(first)
  writeLocal(digest)
  console.log(`\nUpdated ${KEY} in ${ENV_FILE} (old value kept as a comment).`)
  console.log('Restart `npm run dev` for it to take effect.')
  console.log(`\nTo use the same password on the live site, set ${KEY} in Vercel to:\n${digest}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
