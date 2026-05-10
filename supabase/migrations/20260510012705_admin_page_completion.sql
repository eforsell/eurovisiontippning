-- Add new columns to years table
ALTER TABLE years 
ADD COLUMN location TEXT NOT NULL DEFAULT 'TBD',
ADD COLUMN semi1_progression_target INTEGER NOT NULL DEFAULT 10,
ADD COLUMN semi2_progression_target INTEGER NOT NULL DEFAULT 10,
ADD COLUMN semi1_completed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN semi2_completed BOOLEAN NOT NULL DEFAULT false;

-- Modify entries table to use starting_contest instead of semi_final
ALTER TABLE entries 
ADD COLUMN starting_contest TEXT CHECK (starting_contest IN ('semi1', 'semi2', 'final'));

-- Migrate existing data
UPDATE entries 
SET starting_contest = 
  CASE 
    WHEN semi_final = 1 THEN 'semi1'
    WHEN semi_final = 2 THEN 'semi2'
    ELSE 'final'
  END;

ALTER TABLE entries ALTER COLUMN starting_contest SET NOT NULL;

-- Remove old constraint and column
ALTER TABLE entries DROP CONSTRAINT entries_semi_final_check;
ALTER TABLE entries DROP COLUMN semi_final;
