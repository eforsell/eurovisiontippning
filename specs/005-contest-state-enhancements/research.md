# Research & Technical Decisions: Contest State Enhancements

## 1. Disabling Interactions on Closed Contests
- **Decision**: Use a combination of React state/props to conditionally render the `<Entry>` components without drag-and-drop handles and apply `pointer-events-none` via Tailwind CSS, while keeping the visual styling (border, opacity) intact.
- **Rationale**: Meets the requirement to avoid pop-ups while providing immediate, native-feeling feedback that the item is locked.

## 2. Final Start Position Database Change
- **Decision**: Add `final_start_position` (INTEGER, nullable) to the `entries` table via a new Supabase migration.
- **Rationale**: Follows the existing pattern for `start_position`. It allows the Grand Final to sort correctly even if the semifinal start positions were different.

## 3. Grand Final Sorting (TBD entries)
- **Decision**: Modify the frontend sorting logic for the Grand Final. Sort by `final_start_position` ascending. If `final_start_position` is null, place them at the end.
- **Rationale**: Keeps the logic mostly on the client side, reusing the existing data fetching but adjusting the presentation layer.

## 4. Leaderboard Score Partitioning
- **Decision**: Update the frontend leaderboard component to show an expandable row. The data for semi1, semi2, and final scores can either be fetched directly via user predictions or by updating the leaderboard RPC to return an array/JSON of contest scores. Given the spec, updating the RPC `get_friends_leaderboard` or making a supplementary query when expanding is ideal.
- **Rationale**: Reuses existing Supabase patterns. Since we only need it when expanded, fetching prediction details for that specific user on-demand might be the most performant, or modifying the RPC to return a score breakdown JSON.

## 5. Mock Data for Friends
- **Decision**: Update `supabase/seed.sql` to insert additional users, insert rows into `friends` table (status: 'accepted' and 'pending') linked to `eskil.forsell@gmail.com`, and insert mock predictions for these users across contests to generate scores.
- **Rationale**: Necessary for manual testing of the new UI features.