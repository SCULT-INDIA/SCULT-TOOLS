#!/usr/bin/env node
// Prints a `salt:hash` scrypt digest for ADMIN_PASSWORD_HASH — see
// lib/admin/auth.ts's `hashPassword`. Usage: node scripts/hash-admin-password.mjs '<password>'
import { randomBytes, scryptSync } from 'node:crypto'

const password = process.argv[2]
if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs <password>')
  process.exit(1)
}

const salt = randomBytes(16)
const hash = scryptSync(password, salt, 64)
console.log(`${salt.toString('hex')}:${hash.toString('hex')}`)
