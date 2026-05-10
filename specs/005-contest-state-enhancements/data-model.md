# Data Model: Contest State Enhancements

## Database Changes (Supabase)

### Table: `entries`
- **Added Field**: `final_start_position` (INTEGER, NULLABLE)
  - Purpose: To store the start position of an entry in the Grand Final, distinct from its `start_position` in the semifinal.

### Table: `friends` & `predictions` (Seed Data Only)
- Mock data will be added to the `seed.sql` file.
- New user profiles will be created.
- Friend relationships will be established with `user_id` pointing to `eskil.forsell@gmail.com`'s UUID.
- Mock predictions will be inserted for these new users to ensure they have scores for Semi 1, Semi 2, and the Grand Final.

## API / RPC Changes

### RPC: `get_friends_leaderboard` (Potential Update)
- Depending on implementation details, this RPC may be updated to return a `score_breakdown` JSON object containing `semi1`, `semi2`, and `final` scores alongside the `total_score`, OR the client will fetch these details on-demand when a user expands the row.