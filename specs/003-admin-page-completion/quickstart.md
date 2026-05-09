# Quickstart

No new dependencies are required beyond the existing tech stack.

1. Ensure the Supabase local environment is running: `supabase start`
2. Create the new schema migration for the data model changes:
   ```bash
   supabase migration new admin_page_completion
   ```
3. Apply the migration and reset the database:
   ```bash
   supabase db reset
   ```
4. Regenerate the TypeScript types:
   ```bash
   supabase gen types typescript --local > src/types/database.types.ts
   ```