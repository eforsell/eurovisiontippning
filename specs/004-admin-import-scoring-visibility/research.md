# Phase 0: Research & Clarifications

## Resolved Clarifications
1. **Betting Status Storage**: The `betting_started` toggle will be added to the existing `years` table, which serves as our central metadata store.
2. **JSON Import Destructiveness**: Importing entries via JSON will delete all existing entries for the given year. Due to `ON DELETE CASCADE` constraints in the database, this will also automatically delete all associated user bets (`predictions`), results, and notes. A prominent warning must be displayed in the UI prior to action.
3. **Scoring Calculation Trigger**: The scoring logic will remain a runtime calculation (handled via the `get_leaderboard` RPC and `scoringService.ts` on the frontend). It will be updated to only award points when `semi1_completed` or `semi2_completed` is true, ensuring users don't get points before the official outcome is finalized.

## Dependencies & Best Practices
- **JSON Import**: Utilize standard browser APIs (`FileReader`) to parse the JSON file on the client. Validate the structure before sending it to the backend to replace existing entries.
- **Cascade Deletes**: By executing `DELETE FROM entries WHERE year_id = current_year`, Supabase will automatically cascade the deletion to all related records, ensuring data consistency without manual cleanup.
- **Scoring Integrity**: Updating the `get_leaderboard` SQL RPC is the most robust way to ensure leaderboards don't show premature points, as this logic executes directly on the database.
