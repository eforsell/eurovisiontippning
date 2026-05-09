# Data Model

## Existing Tables to Modify

### `years` table (Metadata)
Extend with the following fields:
- `location` (TEXT): The location of the event (e.g., "Stockholm").
- `semi1_progression_target` (INTEGER, default 10): Target number of entries progressing from semi 1.
- `semi2_progression_target` (INTEGER, default 10): Target number of entries progressing from semi 2.
- `semi1_completed` (BOOLEAN, default false): Indicates if the progression for semi 1 is finalized.
- `semi2_completed` (BOOLEAN, default false): Indicates if the progression for semi 2 is finalized.

### `entries` table
Modify to handle the starting contest requirement:
- Add column `starting_contest` (TEXT): Must be one of `'semi1'`, `'semi2'`, or `'final'`.
- Deprecate or replace the old `semi_final` column.

### `results` table (Progressions & Ranking)
Already exists with fields: `year_id`, `entry_id`, `final_rank`, `is_semi1_qualifier`, `is_semi2_qualifier`.
- Use `is_semi1_qualifier` and `is_semi2_qualifier` to mark entries as progressed.
- Final ranking uses `final_rank`.

## Validation Rules & Edge Case Logic
1. **Progression validation**: When saving a semi-final progression, the UI must count how many entries are marked as `is_semi1_qualifier = true` and ensure it exactly matches `years.semi1_progression_target`.
2. **Target decrease validation**: When updating the `semi1_progression_target` in Metadata, if it's being reduced, the system must check the current number of progressed entries. If the target is lower, it rejects the change.
3. **Changing starting-contest**: If an entry's `starting_contest` is changed from 'semi1' to 'final' while it's already progressed (`is_semi1_qualifier = true`), it must automatically be "de-progressed" (`is_semi1_qualifier = false`), and the `semi1_progression_target` should be reduced by 1 to reflect the loss.
4. **Final Activation**: Final ranking UI is only active when both `years.semi1_completed` and `years.semi2_completed` are true.