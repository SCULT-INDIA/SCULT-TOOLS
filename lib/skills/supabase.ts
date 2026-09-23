/**
 * Backward-compatible re-export. The client itself moved to
 * lib/supabase-anon.ts (2026-09-22) once `prompts` and `custom_categories`
 * needed the exact same anon, RLS-gated, timeout-wrapped client the Skills
 * Library already had — see that file's docblock for the full reasoning.
 * Every existing `import { supabaseSkills } from './supabase'` /
 * `'@/lib/skills/supabase'` site keeps working unchanged.
 */
export { supabaseAnon as supabaseSkills } from '../supabase-anon'
