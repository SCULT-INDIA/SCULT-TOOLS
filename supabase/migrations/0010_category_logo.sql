-- Adds an optional uploaded-logo image to custom_categories, so the admin
-- "New category" form can offer "upload an icon image" instead of asking
-- for an exact lucide-react component name (a near-impossible guess against
-- components/ui/Icon.tsx's fixed registry — an unrecognised name silently
-- fell back to a wrench icon).
--
-- Stored as a data: URL string directly in Postgres, not in a Supabase
-- Storage bucket — the same "no bucket" call migration 0007's admin-write
-- docblock (lib/admin/skills.ts) already made for skill .zip uploads: this
-- app's admin writes go through a direct elevated Postgres connection
-- (lib/admin/pg.ts), not a service_role key, and there is deliberately no
-- Storage write policy to add. A category logo is a small icon-sized image,
-- so a data: URL column is cheap and needs no new infrastructure.
alter table public.custom_categories
  add column if not exists logo_data_url text;
