#!/usr/bin/env node
// One-off schema migration runner for the Skills Library's Supabase
// Postgres database. Not used by the deployed app at runtime — the app
// only ever talks to Supabase over the anon key via @supabase/supabase-js.
// Run manually: node scripts/db-migrate.mjs
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations')

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL
  if (!connectionString) {
    throw new Error('SUPABASE_DB_URL is not set (see .env.local)')
  }

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  try {
    await client.query(
      `create table if not exists public._migrations (
         name text primary key,
         applied_at timestamptz not null default now()
       )`,
    )
    const { rows: applied } = await client.query('select name from public._migrations')
    const appliedNames = new Set(applied.map((r) => r.name))

    const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith('.sql')).sort()
    for (const file of files) {
      if (appliedNames.has(file)) {
        console.log(`Skipping ${file} (already applied)`)
        continue
      }
      console.log(`Applying ${file}...`)
      const sql = await readFile(path.join(MIGRATIONS_DIR, file), 'utf8')
      await client.query(sql)
      await client.query('insert into public._migrations (name) values ($1)', [file])
      console.log(`  done`)
    }
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
