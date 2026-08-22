import { createClient } from '@supabase/supabase-js'

/**
 * The Skills Library's only database client. Uses the anon key exclusively
 * — read-only by Row Level Security (see supabase/migrations/0001_create_skills.sql)
 * — because this app never writes to `skills`. Writes come only from the
 * separate Vercel sync-worker project's service_role key, which lives in
 * that project's own environment, never this one.
 */
export const supabaseSkills = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
)
