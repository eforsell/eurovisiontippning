# Phase 1: Data Model

## Schema Modifications

### `years` table
We will add a new column to manage the betting window state.
- **`betting_started`**: `BOOLEAN NOT NULL DEFAULT false`

### `entries` table
No schema changes required. The table already supports the necessary fields (`country`, `artist`, `song_title`, `starting_contest`, `start_position`, `youtube_id`) and is properly linked to the `years` table.

## Data Lifecycle

### JSON Import Process
The JSON import replaces all entries for a specific year.
1. The client parses and validates the imported JSON against the expected schema.
2. The system executes a destructive delete: `DELETE FROM entries WHERE year_id = [current_year_id]`.
3. Due to existing `ON DELETE CASCADE` constraints on `predictions`, `results`, and `notes`, all associated user data for these entries is automatically purged.
4. The system inserts the new records into the `entries` table.

### Scoring Process
The `get_leaderboard` RPC computes scores at runtime. The logic will be updated to factor in the `semi1_completed` and `semi2_completed` flags from the `years` table, guaranteeing that points for semi-final progression bets are only awarded after the respective semi-final is officially marked as complete by the admin.
