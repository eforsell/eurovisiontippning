-- Make start_position nullable
ALTER TABLE entries ALTER COLUMN start_position DROP NOT NULL;

-- Enforce uniqueness of start_position within the same year and contest, ignoring nulls
CREATE UNIQUE INDEX entries_start_position_unique_idx ON entries (year_id, starting_contest, start_position) WHERE start_position IS NOT NULL;