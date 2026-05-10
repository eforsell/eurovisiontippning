# Phase 1: Quickstart & Setup

## 1. Database Migrations
Create a new Supabase migration to add the `betting_started` column to the `years` table and update the `get_leaderboard` RPC.
```bash
npx supabase migration new admin_import_scoring
```
Add the `ALTER TABLE` statement and the `CREATE OR REPLACE FUNCTION public.get_leaderboard` logic to the migration file.

## 2. TypeScript Types Update
After applying the migration locally (`npx supabase db reset` or `db push`), regenerate the types:
```bash
npx supabase gen types typescript --local > src/types/database.types.ts
```

## 3. Frontend Implementation Tasks
- **Admin View**: Update `MetadataForm.tsx` to include a switch/checkbox for `betting_started`.
- **Entries Import**: Implement the "Import from JSON" button and file parsing logic in `EntryManager.tsx`. Ensure a clear warning is shown to the user before the destructive deletion of existing entries.
- **Access Control**: Update `App.tsx` or the specific view components (`SemifinalView`, `FinalView`) to check `betting_started` and block non-admins from tipping if false.
- **Leaderboard Enhancements**: Update `LeaderboardView.tsx` to include tabs for "Semi 1", "Semi 2", and "Final". Fetch friends' predictions and display them in an expandable row format for each entry.
