-- Create predictions type enum
CREATE TYPE prediction_type AS ENUM ('semi1', 'semi2', 'final');

-- Create predictions table
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  is_qualifier BOOLEAN,
  rank INTEGER CHECK (rank >= 1 AND rank <= 26),
  type prediction_type NOT NULL,
  UNIQUE(user_id, entry_id) -- A user can only have one prediction per entry
);

-- Enable RLS
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Basic RLS for predictions (Users can only see and manage their own predictions for now)
CREATE POLICY "Users can manage their own predictions"
ON predictions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);